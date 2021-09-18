import { useEffect } from 'react';
import { HashRouter as Router, Redirect, Route } from 'react-router-dom';
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
      <Route path="/collection/:panelId">
        <Collection />
      </Route>
      <Route path="/podcast/:podcastId">
        <PodcastDetail />
      </Route>
      <Route path="/episode/:episodeId">
        <EpisodeDetail />
      </Route>
      <Route path="/playlist/:playlist">
        <Playlists />
      </Route>
      <Route path="/player">
        <Player />
      </Route>
      <Route path="/home/:panelId">
        <Home />
      </Route>
      <Route path="/" exact>
        <Redirect to="/home/collection" />
      </Route>
    </Router>
  );
}
