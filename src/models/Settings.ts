export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export enum PodcastsLayout {
  List = 'list',
  Grid = 'grid',
}

export type Settings = {
  podcastsLayout: PodcastsLayout;
  theme: Theme;
  accentColor: string;
  dynamicBackground: boolean;
  dynamicAccentColor: boolean;
};

export type ThemeSettings = {
  accentColor: string | null;
  backgroundImage: string | null;
  backgroundScroll: number;
};
