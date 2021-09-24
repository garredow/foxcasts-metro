import { createContext, useContext, useEffect, useState } from 'react';
import { usePalette } from 'react-palette';
import { ComponentBaseProps, ThemeSettings } from '../models';

const defaultTheme: ThemeSettings = {
  accentColor: null,
  backgroundImage: null,
  backgroundScroll: 0,
  backgroundVisible: true,
};

type ThemeContextValue = {
  theme: ThemeSettings;
  setBackgroundImage: (imageUrl: string | null) => void;
  setBackgroundScroll: (percentage: number) => void;
  setBackgroundVisible: (show: boolean) => void;
  reset: () => void;
};

const defaultValue: ThemeContextValue = {
  theme: defaultTheme,
  setBackgroundImage: (imageUrl) => {
    console.log('default', imageUrl);
  },
  setBackgroundScroll: (percentage) => {
    console.log('default', percentage);
  },
  setBackgroundVisible: (show) => {
    console.log('default', show);
  },
  reset: () => {
    console.log('default');
  },
};

const ThemeContext = createContext<ThemeContextValue>(defaultValue);

type ThemeProviderProps = ComponentBaseProps;

export function ThemeProvider(props: ThemeProviderProps) {
  const [accentColor, setAccentColor] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundScroll, setBackgroundScroll] = useState<number>(0);
  const [backgroundVisible, setBackgroundVisible] = useState(false);

  const { data } = usePalette(backgroundImage || '');

  useEffect(() => {
    setAccentColor(data.vibrant || data.lightVibrant || null);
  }, [data]);

  function reset() {
    setAccentColor(null);
    setBackgroundImage(null);
    setBackgroundScroll(0);
    setBackgroundVisible(false);
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: {
          backgroundImage,
          backgroundVisible,
          backgroundScroll,
          accentColor,
        },
        setBackgroundImage,
        setBackgroundScroll,
        setBackgroundVisible,
        reset,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
