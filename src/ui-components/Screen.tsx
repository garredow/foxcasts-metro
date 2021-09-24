import _ from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { useAppBar } from '../contexts/AppBarProvider';
import { useSettings } from '../contexts/SettingsProvider';
import { useTheme } from '../contexts/ThemeProvider';
import { ComponentBaseProps } from '../models';
import { ifClass, joinClasses } from '../utils/classes';
import styles from './Screen.module.css';

type Tab = {
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
  activePanel?: string;
  headerRef?: any;
  tabs?: Tab[];
  onScroll?: (progress: number) => void;
  onPanelChanged?: (index: number) => void;
};

export function Screen({
  panelPeek = false,
  dynamicTheme = false,
  disableAppBar = true,
  ...props
}: Props) {
  const rootRef = useRef(null);
  const heroTextRef = useRef(null);
  const tabsRef = useRef(null);
  const panelsRef = useRef(null);

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
    let panelIndex = props.tabs?.findIndex((a) => a.id === props.activePanel);
    if (panelIndex === undefined || panelIndex === null) {
      panelIndex = -1;
    }

    if (panels && props.activePanel && panelIndex >= 0) {
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
    setBackgroundVisible(dynamicTheme);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollingDone = useCallback<any>(
    _.debounce((ev: any) => {
      const panels = ev.target as HTMLDivElement;
      const index = Array.from(panels.children).findIndex((a: any, i) => {
        return Math.round(a.offsetLeft) === panels.scrollLeft;
      });

      props.onPanelChanged?.(index);
    }, 200),
    [props.onPanelChanged]
  );

  function handleScroll(ev: any) {
    const panels = ev.target as HTMLDivElement;

    const panelsDiff = panels.scrollWidth - panels.clientWidth;
    const progress = (panels.scrollLeft / panelsDiff) * 100;
    props.onScroll?.(progress);

    if (dynamicTheme) {
      setBackgroundScroll(progress);
    }

    const heroText = heroTextRef?.current as unknown as HTMLDivElement;
    if (heroText && panels && heroText.scrollWidth > heroText.clientWidth) {
      const headerDiff = heroText.scrollWidth - heroText.clientWidth;
      const newLeft = (progress / 100) * headerDiff;
      heroText.style.transform = `translateX(-${newLeft}px)`;
    }

    // TODO: Temporary. Need more WP accurate scrolling tabs
    const tabs = tabsRef?.current as unknown as HTMLDivElement;
    if (tabs && panels) {
      // const panelSizePct = 100 / (panels.children.length - 1);
      // const panelIndex = Array.from(panels.children).findIndex(
      //   (panel, i) => progress < (i + 1) * panelSizePct - 0.0001
      // );
      const diff = tabs.scrollWidth - tabs.clientWidth;
      const newLeft = (progress / 100) * diff;
      tabs.style.transform = `translateX(-${newLeft}px)`;
    }

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
        {props.tabs ? (
          <div className={styles.tabs} ref={tabsRef}>
            {props.tabs.map((tab) => (
              <div
                key={tab.id}
                className={ifClass(tab.id === props.activePanel, styles.active)}
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
