import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSettings } from '../contexts/SettingsProvider';
import { ComponentBaseProps, Settings } from '../models';
import { ListItem } from '../ui-components/ListItem';
import { Panel } from '../ui-components/Panel';
import { Screen } from '../ui-components/Screen';
import { Select } from '../ui-components/Select';
import { SettingsRow } from '../ui-components/SettingsRow';
import { Toggle } from '../ui-components/Toggle';
import { Typography } from '../ui-components/Typography';
import styles from './System.module.css';

type Params = {
  panelId: string;
};
type Props = ComponentBaseProps;

const panels = [
  { id: 'settings', label: 'settings' },
  { id: 'theme', label: 'theme' },
  { id: 'about', label: 'about' },
];

export function System(props: Props) {
  const history = useHistory();
  const { panelId } = useParams<Params>();
  const { settings, setSettings } = useSettings();

  function saveSetting(key: keyof Settings, value: any): void {
    setSettings({
      ...settings,
      [key]: value,
    });
  }

  return (
    <Screen
      className={styles.root}
      title="System"
      tabs={panels}
      activePanel={panels.find((a) => a.id === panelId)?.id}
      panelPeek={false}
      onPanelChanged={(index) => {
        if (index === -1) {
          return;
        }
        history.replace(`/system/${panels[index].id}`);
      }}
    >
      <Panel paddingRight={true}>
        <Select
          label="Podcasts Layout"
          value={settings.podcastsLayout}
          options={[
            { key: 'list', label: 'list' },
            { key: 'grid', label: 'grid' },
          ]}
          onChange={(val) => saveSetting('podcastsLayout', val)}
        />
      </Panel>
      <Panel paddingRight={true}>
        <Typography type="bodyLarge">
          Change your phone's background and{' '}
          <span className={styles.accentText}>accent color</span> to match your
          mood today, this week, or all month.
        </Typography>
        <SettingsRow
          label="Background"
          control={
            <Select
              value={settings.theme}
              options={[
                // { key: 'light', label: 'light' },
                { key: 'dark', label: 'dark' },
              ]}
              onChange={(val) => saveSetting('theme', val)}
            />
          }
        />
        <SettingsRow
          label="Accent Color"
          control={
            <Select
              value={settings.accentColor}
              options={[
                { key: '1ba1e2', label: 'Cyan', isColor: true },
                { key: 'ec5817', label: 'Orange', isColor: true },
              ]}
              onChange={(val) => saveSetting('accentColor', val)}
            />
          }
        />
        <Typography type="bodyLarge">
          You can change the background and accent color of the app depending on
          which screen you're on or what you're listening to.
        </Typography>
        <SettingsRow
          label="Dynamic Background"
          text={settings.dynamicBackground ? 'On' : 'Off'}
          control={
            <Toggle
              value={settings.dynamicBackground}
              onClick={() =>
                saveSetting('dynamicBackground', !settings.dynamicBackground)
              }
            />
          }
        />
        <SettingsRow
          label="Dynamic Accent Color"
          text={settings.dynamicAccentColor ? 'On' : 'Off'}
          control={
            <Toggle
              value={settings.dynamicAccentColor}
              onClick={() =>
                saveSetting('dynamicAccentColor', !settings.dynamicAccentColor)
              }
            />
          }
        />
      </Panel>
      <Panel paddingRight={true}>
        <ListItem primaryText="about" />
      </Panel>
    </Screen>
  );
}
