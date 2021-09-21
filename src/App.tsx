import { useEffect, useRef } from 'react';
import { HashRouter as Router, Redirect, Route } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { PlayerProvider } from './contexts/PlayerProvider';
import { SettingsProvider } from './contexts/SettingsProvider';
import { Collection } from './routes/Collection';
import { EpisodeDetail } from './routes/EpisodeDetail';
import Home from './routes/Home';
import { Player } from './routes/Player';
import { Playlists } from './routes/Playlists';
import { PodcastDetail } from './routes/Podcast';
// import { Core } from './services/core';
import './App.css';
import { Search } from './routes/Search';
import { PodcastPreview } from './routes/PodcastPreview';
import { System } from './routes/System';

export function AppWrapper() {
  return (
    <div id="preact_root">
      <SettingsProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </SettingsProvider>
    </div>
  );
}

function AnimatedRoute({ component: Component, ...rest }: any): JSX.Element {
  const nodeRef = useRef(null);

  return (
    <Route {...rest}>
      {({ match, history }) => (
        <CSSTransition
          nodeRef={nodeRef}
          in={match != null}
          timeout={1000}
          classNames={history.action === 'PUSH' ? 'page-forward' : 'page-back'}
          unmountOnExit
        >
          <div ref={nodeRef} className="page">
            <Component />
          </div>
        </CSSTransition>
      )}
    </Route>
  );
}

export default function App() {
  // const { settings } = useSettings();

  useEffect(() => {
    // Core.health().then((res) => console.log(res));
    // Core.checkForUpdates();
  }, []);

  return (
    <div className="container">
      <Router>
        <AnimatedRoute path="/home/:panelId" component={Home} />
        <AnimatedRoute path="/collection/:panelId" component={Collection} />
        <AnimatedRoute
          path="/podcast/preview/:podexId/:panelId"
          component={PodcastPreview}
        />
        <AnimatedRoute
          exact
          path="/podcast/:podcastId/:panelId"
          component={PodcastDetail}
        />
        <AnimatedRoute
          path="/episode/:episodeId/:panelId"
          component={EpisodeDetail}
        />
        <AnimatedRoute path="/playlist/:playlist" component={Playlists} />
        <AnimatedRoute path="/player/:panelId" component={Player} />
        <AnimatedRoute path="/search/:panelId" component={Search} />
        <AnimatedRoute path="/system/:panelId" component={System} />
        <Route path="/" exact>
          <Redirect to="/home/collection" />
        </Route>
      </Router>
    </div>
  );
}
