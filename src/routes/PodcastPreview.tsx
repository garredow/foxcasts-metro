import { ApiEpisode, ApiPodcast } from 'foxcasts-core/lib/types';
import { NotFoundError } from 'foxcasts-core/lib/utils';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { AppBar } from '../ui-components/AppBar';
import { ListItem } from '../ui-components/ListItem';
import { Panel } from '../ui-components/Panel';
import { Screen } from '../ui-components/Screen';
import { Typography } from '../ui-components/Typography';
import styles from './PodcastPreview.module.css';

type Params = {
  podexId: string;
  panelId: string;
};
type Props = ComponentBaseProps & {
  headerText?: string;
};

const panels = [
  { id: 'info', label: 'info' },
  { id: 'episodes', label: 'episodes' },
];

export function PodcastPreview(props: Props) {
  const history = useHistory();
  const { podexId, panelId } = useParams<Params>();
  const [podcast, setPodcast] = useState<ApiPodcast | null>(null);
  const [episodes, setEpisodes] = useState<ApiEpisode[] | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const podId = parseInt(podexId, 10);
    Core.fetchPodcast(podId).then(setPodcast);
    Core.fetchEpisodes(podId).then(setEpisodes);

    Core.getPodcastByPodexId(parseInt(podexId, 10))
      .then(() => setSubscribed(true))
      .catch((err) => {
        if (err instanceof NotFoundError) setSubscribed(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAction(action: string) {
    if (subscribing) {
      return;
    }

    switch (action) {
      case 'subscribe':
        setSubscribing(true);
        await Core.subscribeByPodexId(parseInt(podexId, 10))
          .then(() => setSubscribed(true))
          .catch((err) =>
            console.error('Failed to subscribe to podcast', err.message)
          );
        break;
      case 'unsubscribe':
        setSubscribing(true);
        await Core.unsubscribeByPodexId(parseInt(podexId, 10))
          .then(() => setSubscribed(false))
          .catch((err) =>
            console.error('Failed to unsubscribe from podcast', err.message)
          );
        break;
    }

    setSubscribing(false);
  }

  return (
    <Screen
      className={styles.root}
      title={podcast?.title || 'podcast'}
      tabs={panels}
      activePanel={panels.find((a) => a.id === panelId)?.id}
      panelPeek={false}
      onPanelChanged={(index) => {
        if (index === -1) {
          return;
        }
        history.replace(`/podcast/preview/${podexId}/${panels[index].id}`);
      }}
    >
      <Panel className={styles.panel}>
        <div className={styles.container}>
          <img className={styles.artwork} src={podcast?.artworkUrl} alt="" />
          <Typography type="subtitle">by {podcast?.author}</Typography>
        </div>
        <div className={styles.divider}></div>
        <Typography>{podcast?.description}</Typography>
        <div className={styles.divider}></div>
        <Typography type="subtitle">Latest Episode</Typography>
        {episodes?.[0] ? (
          <ListItem
            primaryText={episodes[0].title}
            secondaryText={new Date(episodes[0].date).toLocaleDateString()}
          />
        ) : null}
        <div className={styles.divider}></div>
        <Typography type="subtitle">Categories</Typography>
        {podcast?.categories.map((category) => (
          <ListItem key={category} primaryText={category} />
        ))}
        <AppBar
          buttons={[
            subscribed
              ? { id: 'unsubscribe', label: 'Unsubscribe', icon: 'delete' }
              : { id: 'subscribe', label: 'Subscribe', icon: 'add' },
          ]}
          onAction={handleAction}
        />
      </Panel>
      <Panel>
        {episodes?.map((episode) => (
          <ListItem
            key={episode.podexId}
            primaryText={episode.title}
            secondaryText={new Date(episode.date).toLocaleDateString()}
          />
        ))}
      </Panel>
    </Screen>
  );
}
