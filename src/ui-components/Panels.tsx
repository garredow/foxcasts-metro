import { useCallback, useRef } from 'react';
import _ from 'lodash';
import { ComponentBaseProps } from '../models';
import { ifClass, joinClasses } from '../utils/classes';
import styles from './Panels.module.css';

type Props = ComponentBaseProps & {
  fullWidth?: boolean;
  headerRef?: any;
  tabs?: string[];
  onScroll?: (progress: number) => void;
  onPanelChanged?: (index: number) => void;
};

export function Panels({ fullWidth = false, ...props }: Props) {
  const tabsRef = useRef(null);

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

    const header = props.headerRef?.current as unknown as HTMLDivElement;
    if (header && panels && header.scrollWidth > header.clientWidth) {
      const headerDiff = header.scrollWidth - header.clientWidth;
      const newLeft = (progress / 100) * headerDiff;
      header.scrollLeft = newLeft;
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
      className={joinClasses(
        styles.root,
        ifClass(fullWidth, styles.fullWidth),
        props.className
      )}
      onScroll={handleScroll}
    >
      {props.tabs ? (
        <div className={styles.tabs} ref={tabsRef}>
          <div>podcasts</div>
          <div>episodes</div>
          <div>playlists</div>
          <div>categories</div>
        </div>
      ) : null}

      <div className={styles.panels}>{props.children}</div>
    </div>
  );
}
