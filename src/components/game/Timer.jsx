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
  const onTickRef = useRef(onTick)
  onTickRef.current = onTick

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now()
      setElapsed(0)
      intervalRef.current = setInterval(() => {
        const newElapsed = Date.now() - startTimeRef.current
        setElapsed(newElapsed)
        if (onTickRef.current) {
          onTickRef.current(newElapsed)
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
  }, [isRunning])

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getElapsed: () => {
      if (!startTimeRef.current) return 0
      return Date.now() - startTimeRef.current
    },
    reset: () => {
      startTimeRef.current = Date.now()
      setElapsed(0)
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
