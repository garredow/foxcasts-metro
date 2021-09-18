import { useEffect } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { PlayerProvider } from './contexts/PlayerProvider';
import { SettingsProvider } from './contexts/SettingsProvider';
import { Collection } from './routes/Collection';
import { EpisodeDetail } from './routes/EpisodeDetail';
import Home from './routes/Home';
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
      <Route path="/collection/:initialType">
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
      <Route path="/" exact>
        <Home />
      </Route>
    </Router>
  );
}
