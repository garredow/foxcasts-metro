import { useEffect } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { PlayerProvider } from './contexts/PlayerProvider';
import { SettingsProvider } from './contexts/SettingsProvider';
import { Collection } from './routes/Collection';
import { EpisodeDetail } from './routes/EpisodeDetail';
import Home from './routes/Home';
import { Player } from './routes/Player';
import { Playlists } from './routes/Playlists';
import { PodcastDetail } from './routes/Podcast';
// import { Core } from './services/core';

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

export default function App() {
  // const { settings } = useSettings();

  useEffect(() => {
    // Core.health().then((res) => console.log(res));
    // Core.checkForUpdates();
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/home/:panelId">
          <Home />
        </Route>
        <Redirect exact from="/" to="/home/collection" />

        <Route path="/collection/:panelId">
          <Collection />
        </Route>
        <Redirect from="/collection" to="/collection/podcasts" />

        <Route path="/podcast/:podcastId/:panelId">
          <PodcastDetail />
        </Route>
        <Redirect from="/podcast/:podcastId" to="/podcast/:podcastId/info" />

        <Route path="/episode/:episodeId/:panelId">
          <EpisodeDetail />
        </Route>
        <Redirect from="/episode/:episodeId" to="/episode/:episodeId/info" />

        <Route path="/playlist/:playlist">
          <Playlists />
        </Route>

        <Route path="/player">
          <Player />
        </Route>
      </Switch>
    </Router>
  );
}
