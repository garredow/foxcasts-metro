import { createContext, useContext, useEffect, useState } from 'react';
import { ComponentBaseProps, PodcastsLayout, Settings, Theme } from '../models';
import { getStorageItem, setStorageItem, StorageKey } from '../utils/storage';

const defaultSettings: Settings = {
  podcastsLayout: PodcastsLayout.Grid,
  theme: Theme.Dark,
  accentColor: '1ba1e2',
};

type SettingsContextValue = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
};

const defaultValue: SettingsContextValue = {
  settings: defaultSettings,
  setSettings: (settings) => {
    console.log('default', settings);
  },
};

const SettingsContext = createContext<SettingsContextValue>(defaultValue);

type SettingsProviderProps = ComponentBaseProps;

export function SettingsProvider(props: SettingsProviderProps) {
  const [settings, setSettingsInternal] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const result = getStorageItem<Settings>(StorageKey.Settings);
    setSettingsInternal({ ...defaultSettings, ...result });
  }, []);

  function setSettings(val: Settings): void {
    setStorageItem<Settings>(StorageKey.Settings, val);
    setSettingsInternal(val);
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
