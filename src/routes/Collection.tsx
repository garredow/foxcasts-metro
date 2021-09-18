import { Podcast } from 'foxcasts-core/lib/types';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { ListItem } from '../ui-components/ListItem';
import { Panel } from '../ui-components/Panel';
import { Screen } from '../ui-components/Screen';
import styles from './Collection.module.css';

type Params = {
  initialType: string;
};
type Props = ComponentBaseProps & {
  headerText?: string;
};

const categories = [
  {
    id: 1,
    name: 'Arts',
  },
  {
    id: 2,
    name: 'Books',
  },
  {
    id: 3,
    name: 'Design',
  },
  {
    id: 4,
    name: 'Fashion',
  },
  {
    id: 5,
    name: 'Beauty',
  },
  {
    id: 6,
    name: 'Food',
  },
  {
    id: 7,
    name: 'Performing',
  },
  {
    id: 8,
    name: 'Visual',
  },
  {
    id: 9,
    name: 'Business',
  },
  {
    id: 10,
    name: 'Careers',
  },
  {
    id: 11,
    name: 'Entrepreneurship',
  },
  {
    id: 12,
    name: 'Investing',
  },
  {
    id: 13,
    name: 'Management',
  },
  {
    id: 14,
    name: 'Marketing',
  },
  {
    id: 15,
    name: 'Non-Profit',
  },
  {
    id: 16,
    name: 'Comedy',
  },
  {
    id: 17,
    name: 'Interviews',
  },
  {
    id: 18,
    name: 'Improv',
  },
  {
    id: 19,
    name: 'Stand-Up',
  },
  {
    id: 20,
    name: 'Education',
  },
  {
    id: 21,
    name: 'Courses',
  },
  {
    id: 22,
    name: 'How-To',
  },
  {
    id: 23,
    name: 'Language',
  },
  {
    id: 24,
    name: 'Learning',
  },
  {
    id: 25,
    name: 'Self-Improvement',
  },
  {
    id: 26,
    name: 'Fiction',
  },
  {
    id: 27,
    name: 'Drama',
  },
  {
    id: 28,
    name: 'History',
  },
  {
    id: 29,
    name: 'Health',
  },
  {
    id: 30,
    name: 'Fitness',
  },
  {
    id: 31,
    name: 'Alternative',
  },
  {
    id: 32,
    name: 'Medicine',
  },
  {
    id: 33,
    name: 'Mental',
  },
  {
    id: 34,
    name: 'Nutrition',
  },
  {
    id: 35,
    name: 'Sexuality',
  },
  {
    id: 36,
    name: 'Kids',
  },
  {
    id: 37,
    name: 'Family',
  },
  {
    id: 38,
    name: 'Parenting',
  },
  {
    id: 39,
    name: 'Pets',
  },
  {
    id: 40,
    name: 'Animals',
  },
  {
    id: 41,
    name: 'Stories',
  },
  {
    id: 42,
    name: 'Leisure',
  },
  {
    id: 43,
    name: 'Animation',
  },
  {
    id: 44,
    name: 'Manga',
  },
  {
    id: 45,
    name: 'Automotive',
  },
  {
    id: 46,
    name: 'Aviation',
  },
  {
    id: 47,
    name: 'Crafts',
  },
  {
    id: 48,
    name: 'Games',
  },
  {
    id: 49,
    name: 'Hobbies',
  },
  {
    id: 50,
    name: 'Home',
  },
  {
    id: 51,
    name: 'Garden',
  },
  {
    id: 52,
    name: 'Video-Games',
  },
  {
    id: 53,
    name: 'Music',
  },
  {
    id: 54,
    name: 'Commentary',
  },
  {
    id: 55,
    name: 'News',
  },
  {
    id: 56,
    name: 'Daily',
  },
  {
    id: 57,
    name: 'Entertainment',
  },
  {
    id: 58,
    name: 'Government',
  },
  {
    id: 59,
    name: 'Politics',
  },
  {
    id: 60,
    name: 'Buddhism',
  },
  {
    id: 61,
    name: 'Christianity',
  },
  {
    id: 62,
    name: 'Hinduism',
  },
  {
    id: 63,
    name: 'Islam',
  },
  {
    id: 64,
    name: 'Judaism',
  },
  {
    id: 65,
    name: 'Religion',
  },
  {
    id: 66,
    name: 'Spirituality',
  },
  {
    id: 67,
    name: 'Science',
  },
  {
    id: 68,
    name: 'Astronomy',
  },
  {
    id: 69,
    name: 'Chemistry',
  },
  {
    id: 70,
    name: 'Earth',
  },
  {
    id: 71,
    name: 'Life',
  },
  {
    id: 72,
    name: 'Mathematics',
  },
  {
    id: 73,
    name: 'Natural',
  },
  {
    id: 74,
    name: 'Nature',
  },
  {
    id: 75,
    name: 'Physics',
  },
  {
    id: 76,
    name: 'Social',
  },
  {
    id: 77,
    name: 'Society',
  },
  {
    id: 78,
    name: 'Culture',
  },
  {
    id: 79,
    name: 'Documentary',
  },
  {
    id: 80,
    name: 'Personal',
  },
  {
    id: 81,
    name: 'Journals',
  },
  {
    id: 82,
    name: 'Philosophy',
  },
  {
    id: 83,
    name: 'Places',
  },
  {
    id: 84,
    name: 'Travel',
  },
  {
    id: 85,
    name: 'Relationships',
  },
  {
    id: 86,
    name: 'Sports',
  },
  {
    id: 87,
    name: 'Baseball',
  },
  {
    id: 88,
    name: 'Basketball',
  },
  {
    id: 89,
    name: 'Cricket',
  },
  {
    id: 90,
    name: 'Fantasy',
  },
  {
    id: 91,
    name: 'Football',
  },
  {
    id: 92,
    name: 'Golf',
  },
  {
    id: 93,
    name: 'Hockey',
  },
  {
    id: 94,
    name: 'Rugby',
  },
  {
    id: 95,
    name: 'Running',
  },
  {
    id: 96,
    name: 'Soccer',
  },
  {
    id: 97,
    name: 'Swimming',
  },
  {
    id: 98,
    name: 'Tennis',
  },
  {
    id: 99,
    name: 'Volleyball',
  },
  {
    id: 100,
    name: 'Wilderness',
  },
  {
    id: 101,
    name: 'Wrestling',
  },
  {
    id: 102,
    name: 'Technology',
  },
  {
    id: 103,
    name: 'True Crime',
  },
  {
    id: 104,
    name: 'TV',
  },
  {
    id: 105,
    name: 'Film',
  },
  {
    id: 106,
    name: 'After-Shows',
  },
  {
    id: 107,
    name: 'Reviews',
  },
  {
    id: 108,
    name: 'Climate',
  },
  {
    id: 109,
    name: 'Weather',
  },
  {
    id: 110,
    name: 'Tabletop',
  },
  {
    id: 111,
    name: 'Role-Playing',
  },
  {
    id: 112,
    name: 'Cryptocurrency',
  },
];

const panels = [
  { id: 'podcasts', label: 'podcasts' },
  { id: 'episodes', label: 'episodes' },
  { id: 'playlists', label: 'playlists' },
  { id: 'categories', label: 'categories' },
];

export function Collection(props: Props) {
  const history = useHistory();
  const { initialType } = useParams<Params>();
  const [podcasts, setPodcasts] = useState<Podcast[] | null>(null);

  useEffect(() => {
    console.log('panel type changed', initialType);
    if (initialType === 'podcasts' && podcasts === null) {
      Core.getPodcasts().then(setPodcasts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialType]);

  function navTo(path: string) {
    history.push(path);
  }

  return (
    <Screen
      className={styles.root}
      title="Collection"
      tabs={panels}
      initialPanelIndex={panels.findIndex((a) => a.id === initialType)}
      onPanelChanged={(index) => {
        if (index === -1) {
          return;
        }
        history.replace(`/collection/${panels[index].id}`);
      }}
    >
      <Panel>
        {podcasts?.map((podcast) => (
          <ListItem
            key={podcast.id}
            primaryText={podcast.title}
            secondaryText={podcast.author}
            imageUrl={podcast.artwork}
            onClick={() => navTo(`/podcast/${podcast.id}`)}
          />
        ))}
      </Panel>
      <Panel>
        <ListItem primaryText="episodes" />
      </Panel>
      <Panel>
        <ListItem
          primaryText="most recent"
          onClick={() => navTo('/playlist/recent')}
        />
        <ListItem
          primaryText="in progress"
          onClick={() => navTo('/playlist/inProgress')}
        />
        <ListItem
          primaryText="favorites"
          onClick={() => navTo('/playlist/favorites')}
        />
      </Panel>
      <Panel>
        {categories.map((category) => (
          <ListItem key={category.id} primaryText={category.name} />
        ))}
      </Panel>
    </Screen>
  );
}
