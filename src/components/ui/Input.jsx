import { useId } from 'react'
import styles from './Input.module.css'

/**
 * Input component with label and error display
 *
 * @param {Object} props
 * @param {string} props.label - Visible label text
 * @param {string} [props.type='text']
 * @param {string} [props.error] - Error message to display
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {boolean} [props.autoFocus=false]
 */
export default function Input({
  label,
  type = 'text',
  error,
  value,
  onChange,
  autoFocus = false
}) {
  const id = useId()
  const errorId = `${id}-error`

  const inputClassName = error
    ? `${styles.input} ${styles.error}`
    : styles.input

  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={inputClassName}
        value={value}
        onChange={handleChange}
        autoFocus={autoFocus}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && (
        <span id={errorId} className={styles.errorText}>
          {error}
        </span>
      )}
    </div>
  )
}
