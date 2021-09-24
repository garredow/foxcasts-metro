import { createContext, useContext, useState } from 'react';
import { ComponentBaseProps } from '../models';
import { BottomItem, TopItem } from '../ui-components/AppBar';

type Commands = {
  top: TopItem[];
  bottom: BottomItem[];
  callback: (id: string) => void;
};

type AppBarContextValue = {
  commands: Commands | null;
  setCommands: (commands: Commands | null) => void;
};

const defaultValue: AppBarContextValue = {
  commands: null,
  setCommands: () => {
    console.log('default');
  },
};

const AppBarContext = createContext<AppBarContextValue>(defaultValue);

type AppBarProviderProps = ComponentBaseProps;

export function AppBarProvider(props: AppBarProviderProps) {
  const [commands, setCommands] = useState<Commands | null>(null);

  return (
    <AppBarContext.Provider
      value={{
        commands,
        setCommands,
      }}
    >
      {props.children}
    </AppBarContext.Provider>
  );
}

export function useAppBar(): AppBarContextValue {
  const context = useContext(AppBarContext);
  if (context === undefined) {
    throw new Error('useAppBar must be used within a AppBar');
  }

  return context;
}
