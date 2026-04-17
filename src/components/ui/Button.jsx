import styles from './Button.module.css'

/**
 * Reusable button component
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'ghost'} [props.variant='primary']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {boolean} [props.disabled=false]
 * @param {React.ReactNode} props.children
 * @param {() => void} [props.onClick]
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children
}) {
  const className = `${styles.button} ${styles[variant]} ${styles[size]}`

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}
