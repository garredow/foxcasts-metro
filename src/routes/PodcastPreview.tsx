import { ApiEpisode, ApiPodcast } from 'foxcasts-core/lib/types';
import { NotFoundError } from 'foxcasts-core/lib/utils';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useAppBar } from '../contexts/AppBarProvider';
import { useRouteParams } from '../hooks/useRouteParams';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { ListItem } from '../ui-components/ListItem';
import { Loading } from '../ui-components/Loading';
import { Panel } from '../ui-components/Panel';
import { Screen } from '../ui-components/Screen';
import { Typography } from '../ui-components/Typography';
import styles from './PodcastPreview.module.css';

type Params = {
  podexId: number;
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
  const { podexId, panelId } = useRouteParams<Params>();

  const { data: podcast, isLoading: podcastLoading } =
    useQuery<ApiPodcast | null>(
      ['podcast', podexId],
      () => Core.fetchPodcast(podexId),
      { enabled: podexId !== undefined, keepPreviousData: true }
    );
  const { data: episodes, isLoading: episodesLoading } = useQuery<
    ApiEpisode[] | null
  >(['episodes', podexId], () => Core.fetchEpisodes(podexId), {
    enabled: podexId !== undefined,
    keepPreviousData: true,
  });

  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const { setCommands } = useAppBar();

  useEffect(() => {
    Core.getPodcastByPodexId(podexId)
      .then(() => setSubscribed(true))
      .catch((err) => {
        if (err instanceof NotFoundError) setSubscribed(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCommands({
      top: [
        subscribed
          ? { id: 'unsubscribe', label: 'Unsubscribe', icon: 'delete' }
          : { id: 'subscribe', label: 'Subscribe', icon: 'add' },
      ],
      bottom: [],
      callback: handleCommand,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribed]);

  async function handleCommand(command: string) {
    if (subscribing) {
      return;
    }

    switch (command) {
      case 'subscribe':
        setSubscribing(true);
        await Core.subscribeByPodexId(podexId)
          .then(() => setSubscribed(true))
          .catch((err) =>
            console.error('Failed to subscribe to podcast', err.message)
          );
        break;
      case 'unsubscribe':
        setSubscribing(true);
        await Core.unsubscribeByPodexId(podexId)
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
      panels={panels}
      activePanel={panels.find((a) => a.id === panelId)?.id}
      panelPeek={false}
      disableAppBar={false}
    >
      <Panel className={styles.panel} panelId={panels[0].id}>
        {podcastLoading && <Loading />}
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
      </Panel>
      <Panel panelId={panels[1].id}>
        {episodesLoading && <Loading />}
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
