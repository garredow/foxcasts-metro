import { ComponentBaseProps } from '../models';
import { ifClass, joinClasses } from '../utils/classes';
import styles from './LinkButton.module.css';

type Props = ComponentBaseProps & {
  disabled?: boolean;
  onClick?: () => void;
};

export function LinkButton({ disabled = false, ...props }: Props) {
  return (
    <div
      className={joinClasses(styles.root, ifClass(disabled, styles.disabled))}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}
