import { ApiPodcast } from 'foxcasts-core/lib/types';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { ListItem } from '../ui-components/ListItem';
import { Loading } from '../ui-components/Loading';
import { Panel } from '../ui-components/Panel';
import { Screen } from '../ui-components/Screen';
import styles from './Trending.module.css';

type Params = {
  categoryId: string;
};

type Props = ComponentBaseProps;

export function Trending(props: Props) {
  const [podcasts, setPodcasts] = useState<ApiPodcast[] | null>(null);

  const history = useHistory();
  const { categoryId } = useParams<Params>();

  useEffect(() => {
    const catId = parseInt(categoryId, 10);
    if (categoryId !== 'all' && isNaN(catId)) {
      return;
    }
    Core.fetchTrendingPodcasts(-31536000, catId ? [catId] : undefined).then(
      (res) => setPodcasts(res.slice(0, 25))
    );
  }, [categoryId]);

  return (
    <Screen className={styles.root} title="Trending Podcasts" panelPeek={false}>
      <Panel paddingRight={true}>
        {podcasts === null && <Loading />}
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
