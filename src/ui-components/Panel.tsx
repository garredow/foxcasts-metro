import { ComponentBaseProps } from '../models';
import { ifClass, joinClasses } from '../utils/classes';
import styles from './Panel.module.css';

type Props = ComponentBaseProps & {
  panelId: string;
  headerText?: string;
  paddingRight?: boolean;
};

export function Panel({ headerText, paddingRight = false, ...props }: Props) {
  return (
    <div
      className={joinClasses(
        styles.root,
        ifClass(paddingRight, styles.paddingRight),
        props.className
      )}
      data-panel-id={props.panelId}
    >
      {headerText ? <div className={styles.header}>{headerText}</div> : null}
      {props.children}
    </div>
  );
}
