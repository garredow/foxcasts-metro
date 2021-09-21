import { Chapter, EpisodeExtended, Podcast } from 'foxcasts-core/lib/types';
import { formatFileSize, formatTime } from 'foxcasts-core/lib/utils';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { usePlayer } from '../contexts/PlayerProvider';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { AppBar } from '../ui-components/AppBar';
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
  const history = useHistory();
  const { episodeId, panelId } = useParams<Params>();
  const [podcast, setPodcast] = useState<Podcast>();
  const [episode, setEpisode] = useState<EpisodeExtended>();
  const [chapters, setChapters] = useState<Chapter[] | null>(null);

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

  useEffect(() => {
    if (panelId === 'chapters' && chapters === null && episode) {
      console.log('get chapters');

      Core.getEpisodeChapters(episode.id, episode.podexId).then(setChapters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelId]);

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
      activePanel={panels.find((a) => a.id === panelId)?.id}
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
        <AppBar
          buttons={[{ id: 'play', label: 'Play', icon: 'play' }]}
          listItems={[
            { id: 'play', label: 'play' },
            { id: 'resume', label: 'resume' },
            { id: 'markPlayed', label: 'mark as played' },
            { id: 'markUnplayed', label: 'mark as unplayed' },
            { id: 'download', label: 'download' },
          ]}
          onAction={handleAction}
        />
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
