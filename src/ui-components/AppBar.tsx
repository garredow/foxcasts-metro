import { useState } from 'react';
import { ComponentBaseProps } from '../models';
import { ifClass, joinClasses } from '../utils/classes';
import { Icon } from './Icon';
import styles from './AppBar.module.css';
import { ListItem } from './ListItem';

export type TopItem = {
  id: string;
  icon: string;
  label: string;
};

export type BottomItem = {
  id: string;
  label: string;
};

type Props = ComponentBaseProps & {
  buttons: TopItem[];
  listItems?: BottomItem[];
  onAction?: (action: string) => void;
};

export function AppBar({ ...props }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={joinClasses(styles.root, ifClass(open, styles.open))}>
      <div className={styles.buttons}>
        <div className={styles.placeholder}></div>
        <div className={styles.flex}></div>
        {props.buttons.map((a) => (
          <Icon
            key={a.id}
            className={styles.button}
            icon={a.icon}
            label={a.label}
            onClick={() => props.onAction?.(a.id)}
          />
        ))}
        <div className={styles.flex}></div>
        <Icon icon="overflow-dots" onClick={() => setOpen(!open)} />
      </div>
      {props.listItems ? (
        <div className={styles.list}>
          {props.listItems.map((item) => (
            <ListItem key={item.id} primaryText={item.label} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
