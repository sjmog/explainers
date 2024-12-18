import cx from 'classnames'

import styles from './MarkdownContent.module.scss'

export const MarkdownContent = ({
  children,
  as= 'div',
  className,
  ...restProps
}) => {
  const Component = as;
  return (
    <Component
      {...restProps}
      className={cx(styles.markdownBody, 'markdown-body', className)}
      {...(typeof children === 'string'
        ? { dangerouslySetInnerHTML: { __html: children } }
        : { children })}
    />
  )
}
