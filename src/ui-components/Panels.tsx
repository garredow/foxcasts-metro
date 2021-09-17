import { useCallback, useState } from 'react';
import _ from 'lodash';
import { ComponentBaseProps } from '../models';
import { ifClass, joinClasses } from '../utils/classes';
import styles from './Panels.module.css';

type Props = ComponentBaseProps & {
  fullWidth?: boolean;
  headerRef?: any;
  onPanelChanged?: (index: number) => void;
};

export function Panels({ fullWidth = false, ...props }: Props) {
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
    if (props.headerRef) {
      const header = props.headerRef.current as unknown as HTMLDivElement;
      const panels = ev.target as HTMLDivElement;
      if (!header || !panels || header.scrollWidth <= header.clientWidth) {
        return;
      }

      const headerDiff = header.scrollWidth - header.clientWidth;
      const panelsDiff = panels.scrollWidth - panels.clientWidth;
      const progress = (panels.scrollLeft / panelsDiff) * 100;
      const newLeft = (progress / 100) * headerDiff;
      // console.log('scroll', progress, headerDiff, panelsDiff, newLeft);
      header.scrollLeft = newLeft;
    }

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
      {props.children}
    </div>
  );
}
