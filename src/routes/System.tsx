import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { useSettings } from '../contexts/SettingsProvider';
import { ComponentBaseProps, Settings } from '../models';
import { Core } from '../services/core';
import { Link } from '../ui-components/Link';
import { Loading } from '../ui-components/Loading';
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
  const { panelId } = useParams<Params>();
  const { settings, setSettings } = useSettings();
  const { data: stats, isLoading: statsLoading } = useQuery(
    'pistats',
    () => Core.fetchPIStats(),
    {
      enabled: panelId === 'about',
      keepPreviousData: true,
    }
  );

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
      panels={panels}
      activePanel={panels.find((a) => a.id === panelId)?.id}
      panelPeek={false}
    >
      <Panel paddingRight={true} panelId={panels[0].id}>
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
      <Panel paddingRight={true} panelId={panels[1].id}>
        <Typography type="bodyLarge">
          Change your phone's background and{' '}
          <Typography display="inline" type="bodyLarge" color="accent">
            accent color
          </Typography>{' '}
          to match your mood today, this week, or all month.
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
              type="fullscreen"
              value={settings.accentColor}
              options={[
                { key: 'ec5817', label: 'Foxcasts Orange', isColor: true },
                { key: 'A4C400', label: 'Lime', isColor: true },
                { key: '60A917', label: 'Green', isColor: true },
                { key: '008A00', label: 'Emerald', isColor: true },
                { key: '00ABA9', label: 'Teal', isColor: true },
                { key: '1BA1E2', label: 'Cyan', isColor: true },
                { key: '0050EF', label: 'Cobalt', isColor: true },
                { key: '6A00FF', label: 'Indigo', isColor: true },
                { key: 'AA00FF', label: 'Violet', isColor: true },
                { key: 'F472D0', label: 'Pink', isColor: true },
                { key: 'D80073', label: 'Magenta', isColor: true },
                { key: 'A20025', label: 'Crimson', isColor: true },
                { key: 'E51400', label: 'Red', isColor: true },
                { key: 'FA6800', label: 'Orange', isColor: true },
                { key: 'F0A30A', label: 'Amber', isColor: true },
                { key: 'E3C800', label: 'Yellow', isColor: true },
                { key: '825A2C', label: 'Brown', isColor: true },
                { key: '6D8764', label: 'Olive', isColor: true },
                { key: '647687', label: 'Steel', isColor: true },
                { key: '76608A', label: 'Mauve', isColor: true },
                { key: '87794E', label: 'Taupe', isColor: true },
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
      <Panel paddingRight={true} panelId={panels[2].id}>
        <Typography type="title">Foxcasts Metro</Typography>
        <Typography type="bodyLarge">
          This app was built for fun by{' '}
          <Link url="https://garrettdowns.com">Garrett Downs</Link>. React was
          used for the UI, the fantastic{' '}
          <Link url="https://podcastindex.org/">Podcast Index</Link> as the data
          source, and hosted on{' '}
          <Link url="https://app.netlify.com/sites/garredow-foxcasts-metro/deploys">
            Netlify
          </Link>
          . If you'd like to check out the source code, it's available on{' '}
          <Link url="https://github.com/garredow/foxcasts-metro">Github</Link>.
        </Typography>
        <Typography type="title">Podcast Index Stats</Typography>
        {statsLoading && <Loading />}
        {stats ? (
          <>
            <Typography type="bodyLarge">
              Total Feeds: {stats?.feedCountTotal.toLocaleString()}
            </Typography>
            <Typography type="bodyLarge">
              Total Episodes: {stats?.episodeCountTotal.toLocaleString()}
            </Typography>
          </>
        ) : null}
      </Panel>
    </Screen>
  );
}
