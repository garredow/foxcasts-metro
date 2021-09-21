import { ComponentBaseProps } from '../models';
import { joinClasses } from '../utils/classes';
import styles from './Icon.module.css';

type Props = ComponentBaseProps & {
  icon: string;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  onClick?: () => void;
};

export function Icon({ size = 'medium', ...props }: Props) {
  return (
    <div
      className={joinClasses(styles.root, styles[size], props.className)}
      onClick={props.onClick}
    >
      <img
        className={styles[`icon-${size}`]}
        src={`/icons/${props.icon}.png`}
        alt=""
      />
      {props.label ? <div className={styles.label}>{props.label}</div> : null}
    </div>
  );
}
