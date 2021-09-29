import { useState } from 'react';
import { ComponentBaseProps } from '../models';
import { joinClasses } from '../utils/classes';
import styles from './IconButton.module.css';

type Props = ComponentBaseProps & {
  icon: string;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  disabled?: boolean;
  interactive?: boolean;
  onClick?: (ev: any) => void;
};

export function IconButton({
  disabled = false,
  interactive = true,
  size = 'medium',
  ...props
}: Props) {
  const [active, setActive] = useState(false);

  let iconName = props.icon;
  if (interactive && active) {
    iconName += '-down';
  }
  return (
    <button
      className={joinClasses(styles.root, styles[size], props.className)}
      disabled={disabled}
      onClick={props.onClick}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      onPointerLeave={() => setActive(false)}
      onPointerCancel={() => setActive(false)}
    >
      <img
        className={styles[`icon-${size}`]}
        src={`/icons/${iconName}.png`}
        alt=""
      />
      {props.label ? <div className={styles.label}>{props.label}</div> : null}
    </button>
  );
}
