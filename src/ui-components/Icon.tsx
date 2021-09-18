import { ComponentBaseProps } from '../models';
import { joinClasses } from '../utils/classes';
import styles from './Icon.module.css';

type Props = ComponentBaseProps & {
  icon: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
};

export function Icon({ size = 'medium', ...props }: Props) {
  return (
    <div
      className={joinClasses(styles.root, props.className)}
      onClick={props.onClick}
    >
      <img className={styles[size]} src={`/icons/${props.icon}.png`} alt="" />
    </div>
  );
}
