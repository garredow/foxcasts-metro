import { ComponentBaseProps } from '../models';
import { joinClasses } from '../utils/classes';
import styles from './Typography.module.css';

type Props = ComponentBaseProps & {
  type?:
    | 'caption'
    | 'body'
    | 'bodyStrong'
    | 'bodyLarge'
    | 'subtitle'
    | 'title'
    | 'titleLarge'
    | 'display';
};

export function Typography({ type = 'body', ...props }: Props) {
  return (
    <div className={joinClasses(styles.root, styles[type], props.className)}>
      {props.children}
    </div>
  );
}
