import { Podcast } from 'foxcasts-core/lib/types';
import { useEffect, useState } from 'react';
import { useSettings } from '../contexts/SettingsProvider';
import { Core } from '../services/core';
import styles from './Podcasts.module.css';

interface Props {
  selectedItemId?: string;
}

export default function Podcasts({ selectedItemId }: Props) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [seeding, setSeeding] = useState(false);

  const { settings } = useSettings();

  useEffect(() => {
    Core.getPodcasts().then((result) => {
      setPodcasts(result);
    });

    // seedData();
    // Core.subscribeByFeedUrl('https://feed.syntax.fm/rss');
  }, []);

  async function seedData(): Promise<void> {
    setSeeding(true);
    try {
      // Need to do one at a time so KaiOS can handle it
      await Core.subscribeByFeedUrl('https://feed.syntax.fm/rss');
      await Core.subscribeByFeedUrl('https://shoptalkshow.com/feed/podcast');
      await Core.subscribeByFeedUrl('https://feeds.simplecast.com/JoR28o79'); // React Podcast
      await Core.subscribeByFeedUrl(
        'https://feeds.feedwrench.com/js-jabber.rss'
      );
      await Core.subscribeByFeedUrl('https://feeds.megaphone.fm/vergecast');

      console.log('seed success');
    } catch (err) {
      console.error('Failed to seed data', err);
    }

    Core.getPodcasts().then((result) => {
      setPodcasts(result);
    });

    setSeeding(false);
  }

  console.log('podcasts', podcasts);

  return (
    <div>
      <div className={styles.pageHeader}>podcasts</div>
      <button onClick={seedData}>Seed data</button>
    </div>
  );
}
