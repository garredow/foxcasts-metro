import { ComponentBaseProps } from '../models';
import { ifClass, joinClasses } from '../utils/classes';
import styles from './Picker.module.css';

export type PickerConfig = {
  open: boolean;
  type: 'list' | 'grid';
  label: string;
  value: string;
  options: Option[];
  onChange: (val: string) => void;
};

export const defaultPickerConfig: PickerConfig = {
  open: false,
  type: 'list',
  label: 'Picker',
  value: '',
  options: [] as Option[],
  onChange: (val: string) => {},
};

type Option = {
  key: string;
  label: string;
  isColor?: boolean;
};

type Props = ComponentBaseProps & {
  type?: 'list' | 'grid';
  label: string;
  open: boolean;
  options: Option[];
  value: string;
  onChange?: (key: string) => void;
};

export function Picker({ type = 'list', open = false, ...props }: Props) {
  return (
    <div className={joinClasses(styles.root, ifClass(open, styles.open))}>
      <div className={styles.title}>{props.label}</div>
      <div className={joinClasses(styles.options, styles[type])}>
        {props.options.map((opt) =>
          type === 'list' ? (
            <div
              key={opt.key}
              className={joinClasses(
                styles.option,
                styles.listItem,
                ifClass(opt.key === props.value, styles.selected)
              )}
              onClick={(ev) => props.onChange?.(opt.key)}
            >
              {opt.label}
            </div>
          ) : (
            <div
              key={opt.key}
              className={joinClasses(
                styles.option,
                styles.gridItem,
                ifClass(opt.key === props.value, styles.selected)
              )}
              style={{ backgroundColor: `#${opt.key}` }}
              onClick={(ev) => props.onChange?.(opt.key)}
            />
          )
        )}
      </div>
    </div>
  );
}
