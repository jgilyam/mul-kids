import styles from './Badge.module.css'

/**
 * Badge for highlighting info
 *
 * @param {Object} props
 * @param {'success' | 'warning' | 'info' | 'error'} [props.variant='info']
 * @param {React.ReactNode} props.children
 */
export default function Badge({ variant = 'info', children }) {
  const className = `${styles.badge} ${styles[variant]}`

  return <span className={className}>{children}</span>
}
