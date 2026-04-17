import styles from './Card.module.css'

/**
 * Visual container with optional title
 *
 * @param {Object} props
 * @param {string} [props.title]
 * @param {React.ReactNode} props.children
 */
export default function Card({ title, children }) {
  return (
    <div className={styles.card}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.content}>{children}</div>
    </div>
  )
}
