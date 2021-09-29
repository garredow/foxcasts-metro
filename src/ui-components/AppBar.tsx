import { useEffect, useState } from 'react';
import { ComponentBaseProps } from '../models';
import { joinClasses } from '../utils/classes';
import styles from './AppBar.module.css';
import { ListItem } from './ListItem';
import { useAppBar } from '../contexts/AppBarProvider';
import { IconButton } from './IconButton';

export type TopItem = {
  id: string;
  icon: string;
  label: string;
};

export type BottomItem = {
  id: string;
  label: string;
};

type Props = ComponentBaseProps;

export function AppBar(props: Props) {
  const [openState, setOpenState] = useState<
    'hidden' | 'peek' | 'icons' | 'open'
  >('hidden');
  const [isOpen, setIsOpen] = useState(false);
  const { commands } = useAppBar();

  useEffect(() => {
    const isEmpty =
      !commands || (commands.top.length === 0 && commands.bottom.length === 0);

    if (isEmpty) {
      setIsOpen(false);
      setOpenState('hidden');
    } else if (isOpen) {
      setOpenState('open');
    } else if (!isOpen && commands.top.length === 0) {
      setOpenState('peek');
    } else {
      setOpenState('icons');
    }
  }, [isOpen, commands]);

  return (
    <div
      className={joinClasses(styles.root, styles[`state-${openState}`])}
      onClick={() => setIsOpen(false)}
    >
      <div className={joinClasses(styles.appbar, styles[`state-${openState}`])}>
        <div className={styles.buttons}>
          <div className={styles.placeholder}></div>
          <div className={styles.flex}></div>
          {commands?.top.map((a) => (
            <IconButton
              key={a.id}
              className={styles.button}
              icon={a.icon}
              label={a.label}
              onClick={() => commands.callback(a.id)}
            />
          ))}
          <div className={styles.flex}></div>
          <IconButton
            icon="overflow-dots"
            interactive={false}
            onClick={(ev: any) => {
              ev.stopPropagation();
              setIsOpen(!isOpen);
            }}
          />
        </div>
        {commands && commands.bottom.length > 0 ? (
          <div className={styles.list}>
            {commands.bottom.map((item) => (
              <ListItem
                key={item.id}
                primaryText={item.label}
                onClick={() => commands.callback(item.id)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
