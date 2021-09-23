import { ComponentBaseProps } from '../models';
import { ifClass, joinClasses } from '../utils/classes';
import styles from './Toggle.module.css';

type Props = ComponentBaseProps & {
  label?: string;
  disabled?: boolean;
  value: boolean;
  onClick?: () => void;
};

export function Toggle({ disabled = false, ...props }: Props) {
  return (
    <div
      className={joinClasses(
        styles.root,
        ifClass(props.value, styles.on),
        ifClass(disabled, styles.disabled)
      )}
      onClick={() => !disabled && props.onClick?.()}
    >
      <div className={styles.background}></div>
      <div className={styles.handle}></div>
    </div>
  );
}
