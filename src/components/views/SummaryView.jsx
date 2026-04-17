import { useMemo } from 'react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { scoringService } from '../../services/scoringService'
import { recommendationService } from '../../services/recommendationService'
import { useHistoryStore } from '../../store/historyStore'
import { useUserStore } from '../../store/userStore'
import styles from './SummaryView.module.css'

/**
 * Post-game summary screen
 *
 * @param {Object} props
 * @param {import('../../types/game').GameSession} props.session - Completed game session
 * @param {() => void} props.onPlayAgain - Callback to start a new game
 * @param {() => void} props.onViewProgress - Callback to view progress tab
 */
export default function SummaryView({ session, onPlayAgain, onViewProgress }) {
  const user = useUserStore((state) => state.user)
  const getSessionsForUser = useHistoryStore((state) => state.getSessionsForUser)

  // Calculate statistics
  const accuracy = scoringService.calculateAccuracy(session.rounds)
  const avgTime = scoringService.calculateAverageTime(session.rounds)
  const avgTimeSeconds = (avgTime / 1000).toFixed(1)
  const correctCount = session.rounds.filter(r => r.isCorrect).length

  // Get recommended table
  const recommendedTable = useMemo(() => {
    if (!user) return null
    const allSessions = getSessionsForUser(user.id)
    return recommendationService.calculateRecommendedTable(allSessions)
  }, [user, getSessionsForUser])

  // Celebrations
  const isHighScore = session.totalScore >= 800
  const isFast = avgTime < 3000
  const isPerfect = correctCount === 10

  const tableName = session.table ? `Tabla del ${session.table}` : 'Modo Mixto'

  return (
    <div className={styles.container}>
      <Card title="¡Juego Terminado!">
        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.tableName}>{tableName}</h3>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Puntaje Total</span>
              <span className={styles.statValue}>{session.totalScore}/1000</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Precisión</span>
              <span className={styles.statValue}>{accuracy}%</span>
              <span className={styles.statDetail}>{correctCount}/10 correctas</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Tiempo Promedio</span>
              <span className={styles.statValue}>{avgTimeSeconds}s</span>
            </div>

            {recommendedTable && (
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Tabla Recomendada</span>
                <span className={styles.statValue}>Tabla del {recommendedTable}</span>
              </div>
            )}
          </div>

          {/* Celebrations */}
          <div className={styles.badges}>
            {isHighScore && (
              <Badge variant="success">¡Excelente Trabajo!</Badge>
            )}
            {isFast && (
              <Badge variant="info">¡Muy Rápido!</Badge>
            )}
            {isPerfect && (
              <Badge variant="success">¡Perfecto!</Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className={styles.actions}>
            <Button onClick={onPlayAgain} size="lg">
              Jugar de Nuevo
            </Button>
            <Button onClick={onViewProgress} variant="secondary" size="lg">
              Ver Progreso
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
