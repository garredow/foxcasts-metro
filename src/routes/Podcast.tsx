import { Episode, Podcast } from 'foxcasts-core/lib/types';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { ListItem } from '../ui-components/ListItem';
import { Panel } from '../ui-components/Panel';
import { Screen } from '../ui-components/Screen';
import { Typography } from '../ui-components/Typography';
import styles from './Podcast.module.css';

type Params = {
  podcastId: string;
};
type Props = ComponentBaseProps & {
  headerText?: string;
};

const panels = [
  { id: 'info', label: 'info' },
  { id: 'episodes', label: 'episodes' },
];

export function PodcastDetail(props: Props) {
  const history = useHistory();
  const { podcastId } = useParams<Params>();
  const [podcast, setPodcast] = useState<Podcast>();
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    console.log('panel type changed', podcastId, typeof podcastId);
    const podId = parseInt(podcastId, 10);
    Core.getPodcastById(podId).then(setPodcast);
    Core.getEpisodesByPodcastId(podId).then(setEpisodes);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(podcast);

  function navTo(path: string) {
    history.push(path);
  }

  return (
    <Screen
      className={styles.root}
      title={podcast?.title || 'podcast'}
      backgroundImageUrl={podcast?.artworkUrl}
      tabs={panels}
      panelPeek={false}
      onPanelChanged={(index) => {
        if (index === -1) {
          return;
        }
        history.replace(`/podcast/${podcastId}/${panels[index].id}`);
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
        {episodes[0] ? (
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
      <Panel>
        {episodes.map((episode) => (
          <ListItem
            key={episode.id}
            primaryText={episode.title}
            secondaryText={new Date(episode.date).toLocaleDateString()}
          />
        ))}
      </Panel>
    </Screen>
  );
}
