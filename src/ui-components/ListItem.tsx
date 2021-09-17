import { ComponentBaseProps } from '../models';
import { joinClasses } from '../utils/classes';
import styles from './ListItem.module.css';

type Props = ComponentBaseProps & {
  imageUrl?: string;
  primaryText: string;
  secondaryText?: string;
  accentText?: string;
  onClick?: () => void;
};

export function ListItem(props: Props) {
  return (
    <div
      className={joinClasses(styles.root, props.className)}
      onClick={props.onClick}
    >
      {props.imageUrl ? <img src={props.imageUrl} alt="" /> : null}
      <div>
        <div className={styles.primaryText}>{props.primaryText}</div>
        <div className={styles.secondaryText}>{props.secondaryText}</div>
        <div className={styles.accentText}>{props.accentText}</div>
      </div>
    </div>
  );
}
