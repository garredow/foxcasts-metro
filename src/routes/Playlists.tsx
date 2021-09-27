import { EpisodeExtended } from 'foxcasts-core/lib/types';
import { formatTime } from 'foxcasts-core/lib/utils';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { ListItem } from '../ui-components/ListItem';
import { Loading } from '../ui-components/Loading';
import { Panel } from '../ui-components/Panel';
import { Screen } from '../ui-components/Screen';
import styles from './Collection.module.css';

type Params = {
  playlist: string;
};
type Props = ComponentBaseProps & {
  headerText?: string;
};

const panels = [
  { id: 'recent', label: 'most recent' },
  { id: 'inProgress', label: 'in progress' },
  { id: 'favorites', label: 'favorites' },
];

export function Playlists(props: Props) {
  const history = useHistory();
  const { playlist } = useParams<Params>();
  const [recent, setRecent] = useState<EpisodeExtended[] | null>(null);
  const [inProgress, setInProgress] = useState<EpisodeExtended[] | null>(null);
  const [favorites, setFavorites] = useState<EpisodeExtended[] | null>(null);

  useEffect(() => {
    if (playlist === 'recent' && recent === null) {
      Core.getEpisodesByFilter('recent').then(setRecent);
    } else if (playlist === 'inProgress' && inProgress === null) {
      Core.getEpisodesByFilter('inProgress').then(setInProgress);
    } else if (playlist === 'favorites' && favorites === null) {
      setFavorites([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist]);

  function navTo(path: string) {
    history.push(path);
  }

  return (
    <Screen
      className={styles.root}
      title="Playlists"
      panels={panels}
      activePanel={panels.find((a) => a.id === playlist)?.id}
    >
      <Panel panelId={panels[0].id}>
        {recent === null && <Loading />}
        {recent?.map((episode) => (
          <ListItem
            key={episode.id}
            primaryText={episode.title}
            secondaryText={episode.podcastTitle}
            accentText={new Date(episode.date).toLocaleDateString()}
            onClick={() => navTo(`/episode/${episode.id}/info`)}
          />
        ))}
        {recent?.length === 0 ? <p>No episodes</p> : null}
      </Panel>
      <Panel panelId={panels[1].id}>
        {inProgress === null && <Loading />}
        {inProgress?.map((episode) => (
          <ListItem
            key={episode.id}
            primaryText={episode.title}
            secondaryText={episode.podcastTitle}
            accentText={`${formatTime(episode.progress)} of ${formatTime(
              episode.duration
            )} played`}
            onClick={() => navTo(`/episode/${episode.id}/info`)}
          />
        ))}
        {inProgress?.length === 0 ? <p>No episodes</p> : null}
      </Panel>
      <Panel panelId={panels[2].id}>
        {favorites === null && <Loading />}
        {favorites?.map((episode) => (
          <ListItem
            key={episode.id}
            primaryText={episode.title}
            secondaryText={episode.podcastTitle}
            onClick={() => navTo(`/episode/${episode.id}/info`)}
          />
        ))}
        {favorites?.length === 0 ? <p>No episodes</p> : null}
      </Panel>
    </Screen>
  );
}
