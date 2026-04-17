import styles from './Header.module.css'

/**
 * App header showing user name and greeting
 *
 * @param {Object} props
 * @param {string} props.userName - Current user name to display
 */
export default function Header({ userName }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Mat-Kids</h1>
      {userName && (
        <span className={styles.greeting}>Hola, {userName}</span>
      )}
    </header>
  )
}
