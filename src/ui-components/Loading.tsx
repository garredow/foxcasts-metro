import { ComponentBaseProps } from '../models';
import { joinClasses } from '../utils/classes';
import styles from './Loading.module.css';

type Props = ComponentBaseProps;

// Took this sweet loading animation from:
// https://thecodeplayer.com/walkthrough/windows-phone-loading-animation
export function Loading(props: Props) {
  return (
    <div className={styles.root}>
      <span className={joinClasses(styles.dot, styles.dot1)}></span>
      <span className={joinClasses(styles.dot, styles.dot2)}></span>
      <span className={joinClasses(styles.dot, styles.dot3)}></span>
      <span className={joinClasses(styles.dot, styles.dot4)}></span>
      <span className={joinClasses(styles.dot, styles.dot5)}></span>
      <span className={joinClasses(styles.dot, styles.dot6)}></span>
    </div>
  );
}
