import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { ListItem } from '../ui-components/ListItem';
import { Panel } from '../ui-components/Panel';
import { Panels } from '../ui-components/Panels';
import styles from './Home.module.css';

interface Props {}

export default function Home(props: Props) {
  const headerRef = useRef(null);
  const history = useHistory();

  function handleNavigate(screen: string) {
    console.log('nav to', screen);

    switch (screen) {
      case 'podcasts':
      case 'episodes':
      case 'playlists':
      case 'categories':
      case 'player':
        history.push(`collection/${screen}`);
        break;
      case 'settings':
      case 'theme':
      case 'about':
        history.push(`system/${screen}`);
        break;
    }
  }

  return (
    <div>
      <div className={styles.appHeader} ref={headerRef}>
        foxcasts metro
      </div>
      <Panels headerRef={headerRef}>
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
          <div className={styles.listItem}>podcast index</div>
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
          <ListItem
            primaryText="theme"
            onClick={() => handleNavigate('theme')}
          />
          <ListItem
            primaryText="about"
            onClick={() => handleNavigate('about')}
          />
        </Panel>
      </Panels>
    </div>
  );
}
