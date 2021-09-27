import { SearchResult } from 'foxcasts-core/lib/types';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router';
import { useAppBar } from '../contexts/AppBarProvider';
import { useQueryParams } from '../hooks/useQueryParams';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { Input } from '../ui-components/Input';
import { ListItem } from '../ui-components/ListItem';
import { Loading } from '../ui-components/Loading';
import { Panel } from '../ui-components/Panel';
import { Screen } from '../ui-components/Screen';
import { Typography } from '../ui-components/Typography';
import { getStorageItem, setStorageItem, StorageKey } from '../utils/storage';
import styles from './Search.module.css';

type Params = {
  panelId: string;
};
type QueryParams = {
  q: string;
};
type Props = ComponentBaseProps;

const panels = [
  { id: 'results', label: 'results' },
  { id: 'recent', label: 'recent searches' },
];

export function Search(props: Props) {
  const [query, setQuery] = useState<string>('');
  const [searches, setSearches] = useState<string[]>([]);
  const history = useHistory();
  const { panelId } = useParams<Params>();
  const { q } = useQueryParams<QueryParams>();
  const { data: results, isLoading } = useQuery<SearchResult[]>(
    ['search', q],
    () => Core.searchPodcasts(q),
    { enabled: q !== undefined, keepPreviousData: true }
  );

  const { setCommands } = useAppBar();

  useEffect(() => {
    setSearches(getStorageItem(StorageKey.RecentSearches) || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setQuery(q || ''), [q]);

  useEffect(() => {
    if (panelId === 'recent') {
      setCommands({
        top: [{ id: 'clear', label: 'Clear', icon: 'delete' }],
        bottom: [],
        callback: clearRecents,
      });
    } else {
      setCommands(null);
    }
  }, [panelId, setCommands]);

  function search(term: string) {
    if (!term) {
      history.replace(`/search/${panelId}`);
      return;
    }

    const newSearches = [
      term,
      ...searches.filter((a) => a.toLowerCase() !== term.toLowerCase()),
    ].slice(0, 10);

    setSearches(newSearches);
    setStorageItem<string[]>(StorageKey.RecentSearches, newSearches);

    history.replace(`/search/results?q=${term}`);
  }

  function clearRecents() {
    setStorageItem<string[]>(StorageKey.RecentSearches, []);
    setSearches([]);
  }

  return (
    <Screen
      className={styles.root}
      title="Search"
      tabs={panels}
      activePanel={panels.find((a) => a.id === panelId)?.id}
      panelPeek={false}
      dynamicTheme={true}
      disableAppBar={false}
      onPanelChanged={(index) => {
        if (index === -1) {
          return;
        }
        history.replace(`/search/${panels[index].id}${q ? `?q=${q}` : ''}`);
      }}
    >
      <Panel paddingRight={true}>
        <Input value={query} onChange={setQuery} onEnter={search} />
        {isLoading && <Loading />}
        {results?.map((result) => (
          <ListItem
            key={result.podexId}
            imageUrl={result.artworkUrl}
            primaryText={result.title}
            secondaryText={result.author}
            onClick={() =>
              history.push(`/podcast/preview/${result.podexId}/info`)
            }
          />
        ))}
      </Panel>
      <Panel>
        {searches.map((searchTerm) => (
          <ListItem
            key={searchTerm}
            primaryText={searchTerm}
            onClick={() => search(searchTerm)}
          />
        ))}
        {searches.length === 0 ? (
          <Typography>No recent searches.</Typography>
        ) : null}
      </Panel>
    </Screen>
  );
}
