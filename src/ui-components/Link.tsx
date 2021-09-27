import { ComponentBaseProps } from '../models';
import { ifClass, joinClasses } from '../utils/classes';
import styles from './Link.module.css';

type Props = ComponentBaseProps & {
  url: string;
  inline?: boolean;
  openInNewTab?: boolean;
};

export function Link({ inline = true, openInNewTab = true, ...props }: Props) {
  return (
    <a
      className={joinClasses(
        styles.root,
        ifClass(inline, styles.inline, styles.block)
      )}
      href={props.url}
      target={openInNewTab ? '_blank' : '_self'}
      rel="noreferrer"
    >
      {props.children}
    </a>
  );
}
