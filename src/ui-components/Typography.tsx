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
  decoration?: 'none' | 'underline';
  transform?: 'none' | 'uppercase' | 'lowercase';
  onClick?: () => void;
};

export function Typography({
  type = 'body',
  color = 'primary',
  decoration = 'none',
  transform = 'none',
  ...props
}: Props) {
  return (
    <div
      className={joinClasses(
        styles.root,
        styles[type],
        styles[color],
        styles[decoration],
        styles[transform],
        props.className
      )}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}
