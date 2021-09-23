import { ComponentBaseProps } from '../models';
import styles from './SettingsRow.module.css';

type Props = ComponentBaseProps & {
  label?: string;
  text?: string;
  control: any;
};

export function SettingsRow(props: Props) {
  return (
    <div className={styles.root}>
      {props.label ? <div className={styles.label}>{props.label}</div> : null}
      <div className={styles.content}>
        {props.text ? <div className={styles.text}>{props.text}</div> : null}
        {props.control}
      </div>
    </div>
  );
}
