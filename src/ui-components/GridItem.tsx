import { ComponentBaseProps } from '../models';
import styles from './GridItem.module.css';

type Props = ComponentBaseProps & {
  imageUrl: string;
  onClick?: () => void;
};

export function GridItem(props: Props) {
  return (
    <img
      className={styles.root}
      src={props.imageUrl}
      alt=""
      onClick={props.onClick}
    />
  );
}
