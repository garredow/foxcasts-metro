import { EpisodeExtended } from 'foxcasts-core/lib/types';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { ListItem } from '../ui-components/ListItem';
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
    console.log('panel type changed', playlist);
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
      tabs={panels}
      initialPanelIndex={panels.findIndex((a) => a.id === playlist)}
      onPanelChanged={(index) => {
        if (index === -1) {
          return;
        }
        history.replace(`/playlist/${panels[index].id}`);
      }}
    >
      <Panel>
        {recent?.map((episode) => (
          <ListItem
            key={episode.id}
            primaryText={episode.title}
            secondaryText={episode.podcastTitle}
            onClick={() => navTo(`/episode/${episode.id}`)}
          />
        ))}
        {recent?.length === 0 ? <p>No episodes</p> : null}
      </Panel>
      <Panel>
        {inProgress?.map((episode) => (
          <ListItem
            key={episode.id}
            primaryText={episode.title}
            secondaryText={episode.podcastTitle}
            onClick={() => navTo(`/episode/${episode.id}`)}
          />
        ))}
        {inProgress?.length === 0 ? <p>No episodes</p> : null}
      </Panel>
      <Panel>
        {favorites?.map((episode) => (
          <ListItem
            key={episode.id}
            primaryText={episode.title}
            secondaryText={episode.podcastTitle}
            onClick={() => navTo(`/episode/${episode.id}`)}
          />
        ))}
        {favorites?.length === 0 ? <p>No episodes</p> : null}
      </Panel>
    </Screen>
  );
}
