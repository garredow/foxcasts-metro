import { useState } from 'react';
import { ComponentBaseProps } from '../models';
import { ifClass, joinClasses } from '../utils/classes';
import styles from './Select.module.css';

type Option = {
  key: string;
  label: string;
  isColor?: boolean;
};

type Props = ComponentBaseProps & {
  type?: 'inline' | 'fullscreen';
  label?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  options: Option[];
  value: string;
  onChange: (key: string) => void;
};

export function Select({
  type = 'inline',
  fullWidth = true,
  disabled = false,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);

  function getOffset() {
    const index = props.options.findIndex((a) => a.key === props.value);
    if (index >= 0) {
      return index * 48 + 13;
    }
  }

  return (
    <>
      <div
        className={joinClasses(
          styles.root,
          ifClass(fullWidth, styles.fullWidth)
        )}
      >
        {props.label ? <div className={styles.label}>{props.label}</div> : null}
        <div
          className={joinClasses(styles.container, ifClass(open, styles.open))}
          style={{
            maxHeight:
              open && type === 'inline'
                ? `${(props.options.length - 1) * 48 + 66}px`
                : '40px',
          }}
          onClick={() => setOpen(true)}
        >
          <div
            className={joinClasses(
              styles.options,
              ifClass(type === 'fullscreen', styles.noAnimate)
            )}
            style={{ transform: `translateY(-${getOffset()}px)` }}
          >
            {props.options.map((opt) => (
              <div
                key={opt.key}
                className={joinClasses(
                  styles.option,
                  ifClass(opt.key === props.value, styles.selected)
                )}
                onClick={(ev) => {
                  if (open) {
                    ev.stopPropagation();
                    props.onChange?.(opt.key);
                    setOpen(false);
                  } else {
                    setOpen(true);
                  }
                }}
              >
                {opt.isColor ? (
                  <div
                    className={styles.colorBox}
                    style={{ backgroundColor: `#${opt.key}` }}
                  ></div>
                ) : null}
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      {type === 'fullscreen' && (
        <div
          className={joinClasses(styles.fullPicker, ifClass(open, styles.open))}
        >
          <div className={styles.title}>Accent Color</div>
          <div className={styles.options}>
            {props.options.map((opt) => (
              <div
                key={opt.key}
                className={joinClasses(
                  styles.option,
                  ifClass(opt.key === props.value, styles.selected)
                )}
                onClick={(ev) => {
                  if (open) {
                    ev.stopPropagation();
                    props.onChange?.(opt.key);
                    setOpen(false);
                  } else {
                    setOpen(true);
                  }
                }}
              >
                {opt.isColor ? (
                  <div
                    className={styles.colorBox}
                    style={{ backgroundColor: `#${opt.key}` }}
                  ></div>
                ) : null}
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
