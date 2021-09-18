import { ComponentBaseProps } from '../models';
import { ifClass, joinClasses } from '../utils/classes';
import styles from './Button.module.css';

type Props = ComponentBaseProps & {
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({
  fullWidth = false,
  disabled = false,
  ...props
}: Props) {
  return (
    <button
      className={joinClasses(styles.root, ifClass(fullWidth, styles.fullWidth))}
      disabled={disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
