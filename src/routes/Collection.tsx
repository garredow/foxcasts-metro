import { Podcast } from 'foxcasts-core/lib/types';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { ListItem } from '../ui-components/ListItem';
import { Panel } from '../ui-components/Panel';
import { Panels } from '../ui-components/Panels';
import styles from './Collection.module.css';

type Params = {
  initialType: string;
};
type Props = ComponentBaseProps & {
  headerText?: string;
};

const panels = ['podcasts', 'episodes', 'playlists', 'categories'];

export function Collection(props: Props) {
  const history = useHistory();
  const { initialType } = useParams<Params>();
  const tabsRef = useRef(null);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    console.log('panel type changed', initialType);
    if (initialType === 'podcasts') {
      Core.getPodcasts().then(setPodcasts);
    }
  }, [initialType]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>COLLECTION</div>
      <div className={styles.tabs}>
        <div>podcasts</div>
        <div>episodes</div>
        <div>playlists</div>
        <div>categories</div>
      </div>
      <Panels
        className={styles.panels}
        fullWidth={true}
        onPanelChanged={(index) => {
          if (index === -1) {
            return;
          }
          history.replace(`/collection/${panels[index]}`);
        }}
      >
        <Panel>
          {podcasts.map((podcast) => (
            <ListItem
              key={podcast.id}
              primaryText={podcast.title}
              secondaryText={podcast.author}
              imageUrl={podcast.artwork}
            />
          ))}
        </Panel>
        <Panel>
          <ListItem primaryText="episodes" />
        </Panel>
        <Panel>
          <ListItem primaryText="playlists" />
        </Panel>
        <Panel>
          <ListItem primaryText="categories" />
        </Panel>
      </Panels>
    </div>
  );
}
