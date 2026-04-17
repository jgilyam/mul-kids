import { useEffect, useRef } from 'react'
import Badge from '../ui/Badge'
import styles from './ScoreFeedback.module.css'

/**
 * Visual feedback overlay after answering a question
 *
 * @param {Object} props
 * @param {boolean} props.isCorrect - Whether the answer was correct
 * @param {number} props.correctAnswer - The correct answer
 * @param {number} props.userAnswer - The user's answer
 * @param {number} props.score - Score earned for this question
 * @param {() => void} props.onContinue - Callback when advancing to next question
 */
export default function ScoreFeedback({ isCorrect, correctAnswer, userAnswer, score, onContinue }) {
  const hasAdvanced = useRef(false)

  useEffect(() => {
    // Auto-advance after 1.5 seconds
    const timer = setTimeout(() => {
      if (!hasAdvanced.current) {
        hasAdvanced.current = true
        onContinue()
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [onContinue])

  const handleClick = () => {
    if (!hasAdvanced.current) {
      hasAdvanced.current = true
      onContinue()
    }
  }

  return (
    <div
      className={`${styles.overlay} ${isCorrect ? styles.correct : styles.incorrect}`}
      onClick={handleClick}
    >
      <div className={styles.content}>
        <div className={styles.icon}>
          {isCorrect ? '✓' : '✗'}
        </div>

        <h2 className={styles.message}>
          {isCorrect ? '¡Correcto!' : '¡Incorrecto!'}
        </h2>

        {!isCorrect && (
          <p className={styles.correctAnswerText}>
            La respuesta correcta es: {correctAnswer}
          </p>
        )}

        <div className={styles.scoreDisplay}>
          <Badge variant={isCorrect ? 'success' : 'error'}>
            +{score} puntos
          </Badge>
        </div>

        <p className={styles.hint}>Toca para continuar</p>
      </div>
    </div>
  )
}
