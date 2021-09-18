import { Chapter, Podcast } from 'foxcasts-core/lib/types';
import { formatFileSize, formatTime } from 'foxcasts-core/lib/utils';
import { useEffect, useState } from 'react';
import { PlaybackStatus, usePlayer } from '../contexts/PlayerProvider';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { Icon } from '../ui-components/Icon';
import { ListItem } from '../ui-components/ListItem';
import { Panel } from '../ui-components/Panel';
import ProgressBar from '../ui-components/ProgressBar';
import { Screen } from '../ui-components/Screen';
import { Typography } from '../ui-components/Typography';
import styles from './Player.module.css';

type Props = ComponentBaseProps & {
  headerText?: string;
};

const panels = [
  { id: 'player', label: 'player' },
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
    }, 1000);

    return (): void => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode]);

  return (
    <Screen
      className={styles.root}
      title={podcast?.title || 'podcast'}
      backgroundImageUrl={podcast?.artworkUrl}
      tabs={panels}
    >
      <Panel paddingRight={true}>
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
              <Icon
                icon="rewind"
                size="large"
                onClick={() => player.jump(-30)}
              />
              {status.playing ? (
                <Icon
                  icon="pause"
                  size="large"
                  onClick={() => player.pause()}
                />
              ) : (
                <Icon icon="play" size="large" onClick={() => player.play()} />
              )}
              <Icon icon="ff" size="large" onClick={() => player.jump(30)} />
            </div>
          </>
        ) : (
          <Typography>Nothing is playing</Typography>
        )}
      </Panel>
      <Panel>
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
        {chapters?.length === 0 ? (
          <Typography>This episode does not have chapters.</Typography>
        ) : null}
      </Panel>
      <Panel>
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
      </Panel>
    </Screen>
  );
}
