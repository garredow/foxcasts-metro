import { useHistory, useParams } from 'react-router-dom';
import { formatTime } from 'foxcasts-core/lib/utils';
import { Podcast } from 'foxcasts-core/lib/types';
import { PlaybackStatus, usePlayer } from '../contexts/PlayerProvider';
import { ListItem } from '../ui-components/ListItem';
import { Panel } from '../ui-components/Panel';
import ProgressBar from '../ui-components/ProgressBar';
import { Screen } from '../ui-components/Screen';
import { Typography } from '../ui-components/Typography';
import styles from './Home.module.css';
import { useEffect, useState } from 'react';
import { Icon } from '../ui-components/Icon';
import { Core } from '../services/core';

type Params = {
  panelId: string;
};

interface Props {}

const panels = [
  { id: 'player', label: 'player' },
  { id: 'collection', label: 'collection' },
  { id: 'browse', label: 'browse' },
  { id: 'system', label: 'system' },
];

export default function Home(props: Props) {
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>({
    playing: false,
    currentTime: 0,
    duration: 0,
  });

  const history = useHistory();
  const { panelId } = useParams<Params>();
  const player = usePlayer();

  useEffect(() => {
    if (!player.episode) {
      setPodcast(null);
      return;
    }

    if (podcast?.id !== player.episode.podcastId) {
      Core.getPodcastById(player.episode.podcastId).then(setPodcast);
    }

    const status = player.getStatus();
    setStatus(status);

    const timer = setInterval(() => {
      const status = player.getStatus();
      setStatus(status);
    }, 1000);

    return (): void => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.episode]);

  function handleNavigate(screen: string) {
    // if (screen === 'categories') {
    //   player.load(26, false);
    //   return;
    // }
    switch (screen) {
      case 'player':
        history.push(`/player/status`);
        break;
      case 'podcasts':
      case 'episodes':
      case 'playlists':
      case 'categories':
        history.push(`/collection/${screen}`);
        break;
      case 'settings':
      case 'theme':
      case 'about':
        history.push(`/system/${screen}`);
        break;
    }
  }

  return (
    <Screen
      heroText="foxcasts metro"
      panelPeek={true}
      backgroundImageUrl={podcast?.artworkUrl}
      activePanel={panels.find((a) => a.id === panelId)?.id}
      onPanelChanged={(index) => {
        if (index === -1) {
          return;
        }
        if (!player.episode) {
          index++;
        }
        history.replace(`/home/${panels[index].id}`);
      }}
    >
      {player.episode ? (
        <Panel headerText="now playing">
          <img src={player.episode.cover} alt="" />
          <Typography type="subtitle">{player.episode.title}</Typography>
          <Typography type="bodyLarge" color="accent">
            {player.episode.podcastTitle}
          </Typography>
          <ProgressBar
            className={styles.progressBar}
            position={(status.currentTime / status.duration) * 100 || 0}
          />
          <div className={styles.playerTimes}>
            <div>{formatTime(status.currentTime)}</div>
            <div>-{formatTime(status.duration - status.currentTime || 0)}</div>
          </div>
          <div className={styles.playbackControls}>
            <Icon icon="rewind" onClick={() => player.jump(-30)} />
            {status.playing ? (
              <Icon icon="pause" onClick={() => player.pause()} />
            ) : (
              <Icon icon="play" onClick={() => player.play()} />
            )}
            <Icon icon="ff" onClick={() => player.jump(30)} />
          </div>
        </Panel>
      ) : null}
      <Panel headerText="collection">
        <ListItem
          primaryText="podcasts"
          onClick={() => handleNavigate('podcasts')}
        />
        <ListItem
          primaryText="episodes"
          onClick={() => handleNavigate('episodes')}
        />
        <ListItem
          primaryText="playlists"
          onClick={() => handleNavigate('playlists')}
        />
        <ListItem
          primaryText="categories"
          onClick={() => handleNavigate('categories')}
        />
        <ListItem
          primaryText="player"
          onClick={() => handleNavigate('player')}
        />
      </Panel>
      <Panel headerText="get podcasts">
        <Typography type="subtitle">Podcast Index</Typography>
        <div className={styles.tiles}>
          <div className={styles.tile}>Trending podcasts</div>
          <div className={styles.tile}>Browse by category</div>
          <div className={styles.tile}>Search</div>
        </div>
      </Panel>
      <Panel headerText="system">
        <ListItem
          primaryText="settings"
          onClick={() => handleNavigate('settings')}
        />
        <ListItem primaryText="theme" onClick={() => handleNavigate('theme')} />
        <ListItem primaryText="about" onClick={() => handleNavigate('about')} />
      </Panel>
    </Screen>
  );
}
