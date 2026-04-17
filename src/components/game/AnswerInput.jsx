import { useState } from 'react'
import Button from '../ui/Button'
import styles from './AnswerInput.module.css'

/**
 * Numeric input for the user's answer
 *
 * @param {Object} props
 * @param {(answer: number) => void} props.onSubmit - Callback with numeric answer
 * @param {boolean} [props.disabled=false] - Disable input and button
 */
export default function AnswerInput({ onSubmit, disabled = false }) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    const numValue = parseInt(value, 10)

    // Validate input is a number
    if (isNaN(numValue) || value.trim() === '') {
      return
    }

    onSubmit(numValue)
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className={styles.container}>
      <input
        type="number"
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoFocus
        placeholder="Tu respuesta..."
      />
      <Button onClick={handleSubmit} disabled={disabled} size="lg">
        Responder
      </Button>
    </div>
  )
}
