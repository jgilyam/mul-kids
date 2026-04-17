import styles from './ProgressBar.module.css'

/**
 * Visual progress indicator
 *
 * @param {Object} props
 * @param {number} props.current - Current value
 * @param {number} props.total - Total value
 * @param {boolean} [props.showLabel=false] - Show current/total label
 */
export default function ProgressBar({ current, total, showLabel = false }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className={styles.container}>
      {showLabel && (
        <span className={styles.label}>
          {current}/{total}
        </span>
      )}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className={styles.fill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
