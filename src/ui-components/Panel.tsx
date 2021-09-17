import { ComponentBaseProps } from '../models';
import { joinClasses } from '../utils/classes';
import styles from './Panel.module.css';

type Props = ComponentBaseProps & {
  headerText?: string;
};

export function Panel({ headerText, ...props }: Props) {
  return (
    <div className={joinClasses(styles.root, props.className)}>
      {headerText ? <div className={styles.header}>{headerText}</div> : null}
      {props.children}
    </div>
  );
}
