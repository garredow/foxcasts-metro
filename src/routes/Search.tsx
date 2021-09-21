import { SearchResult } from 'foxcasts-core/lib/types';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useQuery } from '../hooks/useQuery';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { Button } from '../ui-components/Button';
import { Input } from '../ui-components/Input';
import { ListItem } from '../ui-components/ListItem';
import { Panel } from '../ui-components/Panel';
import { Screen } from '../ui-components/Screen';
import { Typography } from '../ui-components/Typography';
import { getStorageItem, setStorageItem, StorageKey } from '../utils/storage';
import styles from './Search.module.css';

type Params = {
  panelId: string;
};
type Props = ComponentBaseProps & {
  headerText?: string;
};

const panels = [
  { id: 'search', label: 'search' },
  { id: 'recent', label: 'recent searches' },
];

export function Search(props: Props) {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [searches, setSearches] = useState<string[]>([]);
  const history = useHistory();
  const { panelId } = useParams<Params>();

  const queryParams = useQuery();

  useEffect(() => {
    setSearches(getStorageItem(StorageKey.RecentSearches) || []);

    const initialQuery = queryParams.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      search(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function search(q: string, updateHistory = false) {
    history.replace(`/search/search?q=${q}`);
    Core.searchPodcasts(q).then(setResults);

    if (updateHistory) {
      const newSearches = [
        q,
        ...searches.filter((a) => a.toLowerCase() !== q.toLowerCase()),
      ];
      if (newSearches.length > 10) {
        newSearches.length = 10;
      }
      setStorageItem<string[]>(StorageKey.RecentSearches, newSearches);
      setSearches(newSearches);
    }
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
      onPanelChanged={(index) => {
        if (index === -1) {
          return;
        }
        history.replace(
          `/search/${panels[index].id}${query ? `?q=${query}` : ''}`
        );
      }}
    >
      <Panel paddingRight={true}>
        <Input
          value={query}
          onChange={(val) => setQuery(val)}
          onEnter={() => search(query, true)}
        />
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
        {searches.map((q) => (
          <ListItem
            key={q}
            primaryText={q}
            onClick={() => {
              setQuery(q);
              search(q, true);
            }}
          />
        ))}
        {searches.length === 0 ? (
          <Typography>No recent searches.</Typography>
        ) : (
          <Button onClick={clearRecents}>Clear Searches</Button>
        )}
      </Panel>
    </Screen>
  );
}
