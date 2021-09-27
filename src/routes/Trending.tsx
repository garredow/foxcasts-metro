import { ApiPodcast } from 'foxcasts-core/lib/types';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';
import { useQueryParams } from '../hooks/useQueryParams';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { ListItem } from '../ui-components/ListItem';
import { Loading } from '../ui-components/Loading';
import { Panel } from '../ui-components/Panel';
import { Screen } from '../ui-components/Screen';
import styles from './Trending.module.css';

type QueryParams = {
  categoryId?: number;
};

type Props = ComponentBaseProps;

const panels = [{ id: 'trending', label: 'trending' }];

export function Trending(props: Props) {
  const history = useHistory();
  const { categoryId } = useQueryParams<QueryParams>();

  const { data: podcasts, isLoading } = useQuery<ApiPodcast[]>(
    ['trending', categoryId],
    () =>
      Core.fetchTrendingPodcasts(
        -31536000,
        categoryId ? [categoryId] : undefined
      )
  );

  return (
    <Screen
      className={styles.root}
      title="Trending Podcasts"
      panelPeek={false}
      panels={panels}
      showTabs={false}
    >
      <Panel paddingRight={true} panelId={panels[0].id}>
        {isLoading && <Loading />}
        {podcasts?.map((podcast) => (
          <ListItem
            key={podcast.podexId}
            imageUrl={podcast.artworkUrl}
            primaryText={podcast.title}
            secondaryText={podcast.author}
            accentText={`Trend score: ${podcast.trendScore}`}
            onClick={() =>
              history.push(`/podcast/preview/${podcast.podexId}/info`)
            }
          />
        ))}
      </Panel>
    </Screen>
  );
}
