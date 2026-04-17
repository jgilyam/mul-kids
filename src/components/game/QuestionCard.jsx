import ProgressBar from '../ui/ProgressBar'
import styles from './QuestionCard.module.css'

/**
 * Displays the current multiplication question
 *
 * @param {Object} props
 * @param {number} props.table - The table number
 * @param {number} props.multiplier - The multiplier
 * @param {number} props.questionNumber - Current question (1-indexed)
 * @param {number} props.totalQuestions - Total questions
 */
export default function QuestionCard({ table, multiplier, questionNumber, totalQuestions }) {
  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <p className={styles.progressLabel}>Pregunta {questionNumber}/{totalQuestions}</p>
        <ProgressBar current={questionNumber} total={totalQuestions} />
      </div>
      <h1 className={styles.question}>{table} × {multiplier} = ?</h1>
    </div>
  )
}
