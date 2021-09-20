import { EpisodeExtended, Podcast } from 'foxcasts-core/lib/types';
import { formatFileSize, formatTime } from 'foxcasts-core/lib/utils';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { usePlayer } from '../contexts/PlayerProvider';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { ListItem } from '../ui-components/ListItem';
import { Panel } from '../ui-components/Panel';
import { Screen } from '../ui-components/Screen';
import { Typography } from '../ui-components/Typography';
import styles from './EpisodeDetail.module.css';

type Params = {
  episodeId: string;
  panelId: string;
};
type Props = ComponentBaseProps & {
  headerText?: string;
};

const panels = [
  { id: 'info', label: 'info' },
  { id: 'actions', label: 'actions' },
];

export function EpisodeDetail(props: Props) {
  const history = useHistory();
  const { episodeId, panelId } = useParams<Params>();
  const [podcast, setPodcast] = useState<Podcast>();
  const [episode, setEpisode] = useState<EpisodeExtended>();

  const player = usePlayer();

  useEffect(() => {
    if (episodeId) {
      Core.getEpisodeById(parseInt(episodeId, 10))
        .then((res) => {
          setEpisode(res);
          return Core.getPodcastById(res.podcastId);
        })
        .then(setPodcast);
    }
  }, [episodeId]);

  function handleAction(action: string) {
    if (!episode) return;

    switch (action) {
      case 'play':
        player.load(episode.id, false);
        break;
      case 'resume':
        player.load(episode.id, true);
        break;
    }
  }

  return (
    <Screen
      className={styles.root}
      title={podcast?.title || 'podcast'}
      backgroundImageUrl={podcast?.artworkUrl}
      tabs={panels}
      initialPanelIndex={panels.findIndex((a) => a.id === panelId)}
      panelPeek={false}
      onPanelChanged={(index) => {
        if (index === -1) {
          return;
        }
        history.replace(`/episode/${episodeId}/${panels[index].id}`);
      }}
    >
      <Panel paddingRight={true}>
        <Typography type="title">{episode?.title}</Typography>
        <Typography type="subtitle">Description</Typography>
        <Typography type="body">{episode?.description}</Typography>
        <Typography type="subtitle">Published Date</Typography>
        <Typography color="accent" type="bodyLarge">
          {new Date(episode?.date || '').toLocaleString()}
        </Typography>
        <Typography type="subtitle">Duration</Typography>
        <Typography color="accent" type="bodyLarge">
          {formatTime(episode?.duration || 0)}
        </Typography>
        <Typography type="subtitle">File Size</Typography>
        <Typography color="accent" type="bodyLarge">
          {formatFileSize(episode?.fileSize || 0)}
        </Typography>
      </Panel>
      <Panel>
        <ListItem primaryText="Play" onClick={() => handleAction('play')} />
        <ListItem primaryText="Resume" />
        <ListItem primaryText="Mark as played" />
        <ListItem primaryText="Mark as unplayed" />
        <ListItem primaryText="Download" />
      </Panel>
    </Screen>
  );
}
