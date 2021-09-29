import { Chapter, Podcast } from 'foxcasts-core/lib/types';
import { formatFileSize, formatTime } from 'foxcasts-core/lib/utils';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlaybackStatus, usePlayer } from '../contexts/PlayerProvider';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { IconButton } from '../ui-components/IconButton';
import { ListItem } from '../ui-components/ListItem';
import { Loading } from '../ui-components/Loading';
import { Panel } from '../ui-components/Panel';
import ProgressBar from '../ui-components/ProgressBar';
import { Screen } from '../ui-components/Screen';
import { Typography } from '../ui-components/Typography';
import styles from './Player.module.css';

type Params = {
  panelId: string;
};

type Props = ComponentBaseProps & {
  headerText?: string;
};

const panels = [
  { id: 'status', label: 'status' },
  { id: 'chapters', label: 'chapters' },
  { id: 'info', label: 'info' },
];

export function Player(props: Props) {
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>({
    playing: false,
    currentTime: 0,
    duration: 0,
  });
  const [chapters, setChapters] = useState<Chapter[] | null>(null);
  const { panelId } = useParams<Params>();

  const { episode, ...player } = usePlayer();

  useEffect(() => {
    if (!episode) {
      setPodcast(null);
      setChapters(null);
      return;
    }

    if (podcast?.id !== episode.podcastId) {
      Core.getPodcastById(episode.podcastId).then(setPodcast);
    }

    Core.getEpisodeChapters(episode.id, episode.podexId).then(setChapters);

    const status = player.getStatus();
    setStatus(status);

    const timer = setInterval(() => {
      const status = player.getStatus();
      setStatus(status);
      Core.updateEpisode(episode.id, { progress: status.currentTime });
    }, 1000);

    return (): void => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode]);

  return (
    <Screen
      className={styles.root}
      title="Player"
      backgroundImageUrl={podcast?.artwork}
      dynamicTheme={!!podcast?.artwork}
      panels={panels}
      activePanel={panels.find((a) => a.id === panelId)?.id}
    >
      <Panel paddingRight={true} panelId={panels[0].id}>
        {episode ? (
          <>
            {podcast ? (
              <img className={styles.artwork} src={podcast.artworkUrl} alt="" />
            ) : null}
            <Typography type="subtitle">{episode.title}</Typography>
            <Typography type="bodyLarge" color="accent">
              {episode.podcastTitle}
            </Typography>
            <ProgressBar
              className={styles.progressBar}
              position={(status.currentTime / status.duration) * 100 || 0}
            />
            <div className={styles.times}>
              <div>{formatTime(status.currentTime)}</div>
              <div>
                -{formatTime(status.duration - status.currentTime || 0)}
              </div>
            </div>
            <div className={styles.controls}>
              <IconButton
                icon="rewind"
                size="large"
                onClick={() => player.jump(-30)}
              />
              {status.playing ? (
                <IconButton
                  icon="pause"
                  size="large"
                  onClick={() => player.pause()}
                />
              ) : (
                <IconButton
                  icon="play"
                  size="large"
                  onClick={() => player.play()}
                />
              )}
              <IconButton
                icon="ff"
                size="large"
                onClick={() => player.jump(30)}
              />
            </div>
          </>
        ) : (
          <Typography>Nothing is playing</Typography>
        )}
      </Panel>
      <Panel panelId={panels[1].id}>
        {chapters?.map((chapter) => {
          let times = formatTime(chapter.startTime / 1000);
          if (chapter.endTime) {
            times = `${times} - ${formatTime(chapter.endTime / 1000)}`;
          }
          return (
            <ListItem
              key={chapter.startTime}
              primaryText={chapter.title}
              secondaryText={times}
              onClick={() => player.goTo(Math.floor(chapter.startTime / 1000))}
            />
          );
        })}
        {chapters === null && episode ? <Loading /> : null}
        {!episode ? <Typography>Nothing is playing</Typography> : null}
        {chapters?.length === 0 ? (
          <Typography>This episode does not have chapters.</Typography>
        ) : null}
      </Panel>
      <Panel panelId={panels[2].id}>
        {episode ? (
          <>
            <Typography>{episode?.description}</Typography>
            <Typography type="subtitle">Published Date</Typography>
            <Typography color="accent">
              {new Date(episode?.date || '').toLocaleString()}
            </Typography>
            <Typography type="subtitle">Duration</Typography>
            <Typography color="accent">
              {formatTime(episode?.duration || 0)}
            </Typography>
            <Typography type="subtitle">File Size</Typography>
            <Typography color="accent">
              {formatFileSize(episode?.fileSize || 0)}
            </Typography>
            <Typography type="title">About the author</Typography>
            <Typography type="bodyLarge">{podcast?.title}</Typography>
            <Typography>{podcast?.description}</Typography>
          </>
        ) : (
          <Typography>Nothing is playing</Typography>
        )}
      </Panel>
    </Screen>
  );
}
