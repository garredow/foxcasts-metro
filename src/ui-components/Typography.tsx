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
  color?: 'primary' | 'secondary' | 'accent';
};

export function Typography({
  type = 'body',
  color = 'primary',
  ...props
}: Props) {
  return (
    <div
      className={joinClasses(
        styles.root,
        styles[type],
        styles[color],
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
