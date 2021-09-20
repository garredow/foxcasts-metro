import _ from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
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
  initialPanelIndex?: number;
  headerRef?: any;
  tabs?: Tab[];
  onScroll?: (progress: number) => void;
  onPanelChanged?: (index: number) => void;
};

export function Screen({ panelPeek = false, ...props }: Props) {
  const backgroundRef = useRef(null);
  const heroTextRef = useRef(null);
  const tabsRef = useRef(null);
  const panelsRef = useRef(null);

  useEffect(() => {
    const panels = panelsRef.current as unknown as HTMLDivElement;
    if (panels && props.initialPanelIndex !== undefined) {
      panels.scrollLeft = panels.clientWidth * props.initialPanelIndex;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollingDone = useCallback<any>(
    _.debounce((ev: any) => {
      const panels = ev.target as HTMLDivElement;
      const index = Array.from(panels.children).findIndex(
        (a) => Math.round(a.getBoundingClientRect().left) === 0
      );

      props.onPanelChanged?.(index);
    }, 200),
    [props.onPanelChanged]
  );

  function handleScroll(ev: any) {
    const panels = ev.target as HTMLDivElement;

    const panelsDiff = panels.scrollWidth - panels.clientWidth;
    const progress = (panels.scrollLeft / panelsDiff) * 100;
    // console.log('scroll', progress);
    props.onScroll?.(progress);

    const background = backgroundRef?.current as unknown as HTMLDivElement;
    if (background && panels) {
      // const diff = background.scrollWidth - background.clientWidth;
      // const newLeft = (progress / 100) * diff;
      background.style.backgroundPositionX = `${progress * -2}px`;
    }

    const heroText = heroTextRef?.current as unknown as HTMLDivElement;
    if (heroText && panels && heroText.scrollWidth > heroText.clientWidth) {
      const headerDiff = heroText.scrollWidth - heroText.clientWidth;
      const newLeft = (progress / 100) * headerDiff;
      heroText.style.transform = `translateX(-${newLeft}px)`;
    }

    // TODO: Scroll tabs
    // const tabs = tabsRef?.current as unknown as HTMLDivElement;
    // const panelSizePct = 100 / (panels.length - 1);
    // const panelIndex = panels.findIndex(
    //   (panel, i) => progress < (i + 1) * panelSizePct - 0.0001
    // );

    scrollingDone(ev);
  }
  return (
    <div
      ref={backgroundRef}
      className={styles.root}
      style={
        props.backgroundImageUrl
          ? { backgroundImage: `url(${props.backgroundImageUrl})` }
          : {}
      }
    >
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
              <div key={tab.id}>{tab.label}</div>
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
