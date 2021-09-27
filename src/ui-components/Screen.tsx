import _ from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useAppBar } from '../contexts/AppBarProvider';
import { useSettings } from '../contexts/SettingsProvider';
import { useTheme } from '../contexts/ThemeProvider';
import { ComponentBaseProps } from '../models';
import { ifClass, joinClasses } from '../utils/classes';
import styles from './Screen.module.css';

type PanelConfig = {
  id: string;
  label: string;
};

type Props = ComponentBaseProps & {
  heroText?: string;
  title?: string;
  panelPeek?: boolean;
  backgroundImageUrl?: string;
  dynamicTheme?: boolean;
  disableAppBar?: boolean;
  showTabs?: boolean;
  activePanel?: string;
  headerRef?: any;
  panels: PanelConfig[];
  onScroll?: (progress: number) => void;
  onPanelChanged?: (panelId: string) => void;
};

export function Screen({
  panelPeek = false,
  dynamicTheme = false,
  disableAppBar = true,
  showTabs = true,
  ...props
}: Props) {
  const rootRef = useRef(null);
  const heroTextRef = useRef(null);
  const tabsRef = useRef(null);
  const panelsRef = useRef(null);

  const history = useHistory();
  const location = useLocation();
  // console.log('loc', location);

  const { settings } = useSettings();
  const {
    setBackgroundImage,
    setBackgroundScroll,
    setBackgroundVisible,
    theme,
  } = useTheme();
  const { setCommands } = useAppBar();

  useEffect(() => {
    if (disableAppBar) {
      setCommands(null);
    }
  }, [disableAppBar, setCommands]);

  useEffect(() => {
    const panels = panelsRef.current as unknown as HTMLDivElement;
    let panelIndex = Array.from(panels.children).findIndex(
      (a: any) => a.dataset.panelId === props.activePanel
    );

    if (panelIndex >= 0) {
      panels.scrollLeft = panels.clientWidth * panelIndex;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.activePanel]);

  useEffect(() => {
    if (props.backgroundImageUrl) {
      setBackgroundImage(props.backgroundImageUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.backgroundImageUrl]);

  useEffect(() => {
    const root = rootRef.current as unknown as HTMLDivElement;

    if (!settings.dynamicAccentColor || !dynamicTheme) {
      root?.style.removeProperty('--app-accent-color');
      root?.style.removeProperty('--accent-text-color');
      return;
    }

    if (theme.accentColor) {
      root.style.setProperty('--app-accent-color', `${theme.accentColor}`);
      root.style.setProperty('--accent-text-color', `${theme.accentColor}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.accentColor, settings.dynamicAccentColor, dynamicTheme]);

  useEffect(() => {
    setBackgroundVisible(dynamicTheme);
  }, [dynamicTheme, setBackgroundVisible]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollingDone = useCallback<any>(
    _.debounce((ev: any) => {
      const panels = ev.target as HTMLDivElement;
      const panel: any = Array.from(panels.children).find((a: any) => {
        return Math.round(a.offsetLeft) === panels.scrollLeft;
      });

      const panelId = panel?.dataset?.panelId;
      if (!panelId) return;

      props.onPanelChanged
        ? props.onPanelChanged(panelId)
        : history.replace(`${panelId}${location.search}`);
    }, 200),
    [props.onPanelChanged, panelPeek, location.search]
  );

  function handleScroll(ev: any) {
    const panels = ev.target as HTMLDivElement;

    const progress =
      (panels.scrollLeft / (panels.scrollWidth - panels.clientWidth)) * 100;

    if (dynamicTheme) {
      setBackgroundScroll(progress);
    }

    const heroText = heroTextRef?.current as unknown as HTMLDivElement;
    if (heroText && heroText.scrollWidth > heroText.clientWidth) {
      const headerDiff = heroText.scrollWidth - heroText.clientWidth;
      const newLeft = (progress / 100) * headerDiff;
      heroText.style.transform = `translateX(-${newLeft}px)`;
    }

    const tabs = tabsRef?.current as unknown as HTMLDivElement;
    if (tabs && props.panels.length > 0) {
      const currentPanelIndex = Math.floor(
        panels.scrollLeft / panels.clientWidth
      );
      const panelProgress =
        ((panels.scrollLeft - panels.clientWidth * currentPanelIndex) /
          panels.clientWidth) *
        100;
      const currentTab = tabs.children[currentPanelIndex] as HTMLDivElement;

      const offset =
        currentTab.offsetLeft + (currentTab.clientWidth * panelProgress) / 100;
      tabs.style.transform = `translateX(-${offset}px)`;
    }

    props.onScroll?.(progress);
    scrollingDone(ev);
  }
  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.content}>
        {props.heroText ? (
          <div className={styles.heroText} ref={heroTextRef}>
            {props.heroText}
          </div>
        ) : null}
        {props.title ? <div className={styles.title}>{props.title}</div> : null}
        {showTabs && props.panels ? (
          <div className={styles.tabs} ref={tabsRef}>
            {props.panels.map((tab) => (
              <div
                key={tab.id}
                className={ifClass(tab.id === props.activePanel, styles.active)}
                data-tab-id={tab.id}
              >
                {tab.label}
              </div>
            ))}
          </div>
        ) : null}
        <div
          ref={panelsRef}
          className={joinClasses(
            styles.panels,
            ifClass(!panelPeek, styles.fullWidth)
          )}
          onScroll={handleScroll}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
