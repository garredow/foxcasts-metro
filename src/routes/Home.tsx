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
import { useTheme } from '../contexts/ThemeProvider';
import { useSettings } from '../contexts/SettingsProvider';

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
  const { theme, reset } = useTheme();
  const { settings } = useSettings();

  useEffect(() => {
    if (!player.episode) {
      reset();
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
      Core.updateEpisode(player.episode!.id, { progress: status.currentTime });
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
      case 'categories':
      case 'recent':
      case 'inProgress':
      case 'favorites':
        history.push(`/collection/${screen}`);
        break;
      case 'trending':
        history.push(`/trending`);
        break;
      case 'trendingCategories':
        history.push(`/categories`);
        break;
      case 'search':
        history.push(`/search/results`);
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
      panels={panels}
      showTabs={false}
      backgroundImageUrl={podcast?.artwork}
      dynamicTheme={!!podcast?.artwork}
      activePanel={panels.find((a) => a.id === panelId)?.id}
    >
      {player.episode ? (
        <Panel headerText="now playing" panelId={panels[0].id}>
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
          <Typography
            color="accent"
            decoration="underline"
            onClick={() => handleNavigate('player')}
          >
            Open full player
          </Typography>
        </Panel>
      ) : null}
      <Panel headerText="collection" panelId={panels[1].id}>
        <ListItem
          primaryText="podcasts"
          onClick={() => handleNavigate('podcasts')}
        />
        <ListItem
          primaryText="categories"
          onClick={() => handleNavigate('categories')}
        />
        <ListItem
          primaryText="most recent"
          onClick={() => handleNavigate('recent')}
        />
        <ListItem
          primaryText="in progress"
          onClick={() => handleNavigate('inProgress')}
        />
        <ListItem
          primaryText="favorites"
          onClick={() => handleNavigate('favorites')}
        />
      </Panel>
      <Panel headerText="get podcasts" panelId={panels[2].id}>
        <Typography type="subtitle">Podcast Index</Typography>
        <div className={styles.tiles}>
          <div
            className={styles.tile}
            style={
              theme.accentColor &&
              !!podcast?.artwork &&
              settings.dynamicAccentColor
                ? { backgroundColor: theme.accentColor }
                : {}
            }
            onClick={() => handleNavigate('trending')}
          >
            Trending podcasts
          </div>
          <div
            className={styles.tile}
            style={
              theme.accentColor &&
              !!podcast?.artwork &&
              settings.dynamicAccentColor
                ? { backgroundColor: theme.accentColor }
                : {}
            }
            onClick={() => handleNavigate('trendingCategories')}
          >
            Browse by category
          </div>
          <div
            className={styles.tile}
            style={
              theme.accentColor &&
              !!podcast?.artwork &&
              settings.dynamicAccentColor
                ? { backgroundColor: theme.accentColor }
                : {}
            }
            onClick={() => handleNavigate('search')}
          >
            Search
          </div>
        </div>
      </Panel>
      <Panel headerText="system" panelId={panels[3].id}>
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
