import { EpisodeExtended, Podcast } from 'foxcasts-core/lib/types';
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
  const { episodeId } = useParams<Params>();
  const [podcast, setPodcast] = useState<Podcast>();
  const [episode, setEpisode] = useState<EpisodeExtended>();

  const player = usePlayer();

  useEffect(() => {
    console.log('panel type changed', episodeId);
    Core.getEpisodeById(parseInt(episodeId, 10))
      .then((res) => {
        setEpisode(res);
        return Core.getPodcastById(res.podcastId);
      })
      .then(setPodcast);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(episode);

  // console.log(podcast);

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
      panelPeek={false}
      onPanelChanged={(index) => {
        if (index === -1) {
          return;
        }
        history.replace(`/episode/${episodeId}/${panels[index].id}`);
      }}
    >
      <Panel paddingRight={true}>
        <Typography type="subtitle" color="accent">
          {new Date(episode?.date || '').toLocaleDateString()}
        </Typography>
        <Typography type="title">{episode?.title}</Typography>
        <Typography type="body">{episode?.description}</Typography>
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
