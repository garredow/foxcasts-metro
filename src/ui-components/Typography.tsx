import { ComponentBaseProps } from '../models';
import { joinClasses } from '../utils/classes';
import styles from './Typography.module.css';

type Props = ComponentBaseProps & {
  display?: 'block' | 'inline';
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
};

export function Typography({
  display = 'block',
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
        styles[display],
        styles[type],
        styles[color],
        styles[decoration],
        styles[transform],
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
