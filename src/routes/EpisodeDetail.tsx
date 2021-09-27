import { Chapter, EpisodeExtended, Podcast } from 'foxcasts-core/lib/types';
import { formatFileSize, formatTime } from 'foxcasts-core/lib/utils';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useAppBar } from '../contexts/AppBarProvider';
import { usePlayer } from '../contexts/PlayerProvider';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { ListItem } from '../ui-components/ListItem';
import { Loading } from '../ui-components/Loading';
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
  { id: 'chapters', label: 'chapters' },
];

export function EpisodeDetail(props: Props) {
  const { episodeId, panelId } = useParams<Params>();
  const [podcast, setPodcast] = useState<Podcast>();
  const [episode, setEpisode] = useState<EpisodeExtended>();
  const [chapters, setChapters] = useState<Chapter[] | null>(null);

  const player = usePlayer();
  const { setCommands } = useAppBar();

  useEffect(() => {
    if (!episode) {
      return;
    }

    const commands = {
      top: [{ id: 'play', label: 'Play', icon: 'play' }],
      bottom: [
        { id: 'markPlayed', label: 'mark as played' },
        { id: 'markUnplayed', label: 'mark as unplayed' },
        { id: 'download', label: 'download' },
      ],
      callback: handleCommand,
    };

    if (episode.progress > 0) {
      commands.bottom.unshift({
        id: 'resume',
        label: `resume at ${formatTime(episode.progress)}`,
      });
    }

    setCommands(commands);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode]);

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

  useEffect(() => {
    if (panelId === 'chapters' && chapters === null && episode) {
      console.log('get chapters');

      Core.getEpisodeChapters(episode.id, episode.podexId).then(setChapters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelId]);

  function handleCommand(command: string) {
    if (!episode) return;

    switch (command) {
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
      backgroundImageUrl={podcast?.artwork}
      dynamicTheme={!!podcast?.artwork}
      disableAppBar={false}
      panels={panels}
      activePanel={panels.find((a) => a.id === panelId)?.id}
      panelPeek={false}
    >
      <Panel paddingRight={true} panelId={panels[0].id}>
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
            />
          );
        })}
        {chapters === null ? <Loading /> : null}
        {!episode ? <Typography>Nothing is playing</Typography> : null}
        {chapters?.length === 0 ? (
          <Typography>This episode does not have chapters.</Typography>
        ) : null}
      </Panel>
    </Screen>
  );
}
