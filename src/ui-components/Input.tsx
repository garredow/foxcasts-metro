import { ComponentBaseProps } from '../models';
import { ifClass, joinClasses } from '../utils/classes';
import styles from './Input.module.css';

type Props = ComponentBaseProps & {
  type?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (newVal: string) => void;
  onEnter?: () => void;
};

export function Input({
  type = 'text',
  fullWidth = true,
  disabled = false,
  ...props
}: Props) {
  return (
    <input
      className={joinClasses(styles.root, ifClass(fullWidth, styles.fullWidth))}
      type={type}
      disabled={disabled}
      onKeyDown={(ev) => ev.key === 'Enter' && props.onEnter?.()}
      onChange={(ev) => props.onChange?.(ev.target.value)}
      value={props.value}
    />
  );
}
