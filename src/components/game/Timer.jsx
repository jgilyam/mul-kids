import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import styles from './Timer.module.css'

/**
 * Visual chronometer that counts up during gameplay
 * Exposes getElapsed() and reset() methods via ref
 *
 * @param {Object} props
 * @param {boolean} props.isRunning - Whether timer is actively counting
 * @param {(elapsed: number) => void} [props.onTick] - Optional callback on each tick
 */
const Timer = forwardRef(function Timer({ isRunning, onTick }, ref) {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsed
      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const newElapsed = now - startTimeRef.current
        setElapsed(newElapsed)
        if (onTick) {
          onTick(newElapsed)
        }
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, onTick, elapsed])

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getElapsed: () => elapsed,
    reset: () => {
      setElapsed(0)
      startTimeRef.current = null
    }
  }))

  const seconds = (elapsed / 1000).toFixed(1)

  // Determine color based on elapsed time
  let colorClass = styles.green
  const elapsedSeconds = elapsed / 1000
  if (elapsedSeconds > 5) {
    colorClass = styles.red
  } else if (elapsedSeconds > 2) {
    colorClass = styles.yellow
  }

  return (
    <div
      className={`${styles.timer} ${colorClass}`}
      aria-live="polite"
      aria-label="Tiempo transcurrido"
    >
      {seconds}s
    </div>
  )
})

export default Timer
