import { useWeeklyProgress } from '../../hooks/useWeeklyProgress'
import Card from '../ui/Card'
import WeeklyProgressChart from '../charts/WeeklyProgressChart'
import TablePerformanceChart from '../charts/TablePerformanceChart'
import styles from './ProgressView.module.css'

/**
 * Progress view: weekly summary, charts for daily progress and table performance.
 */
export default function ProgressView() {
  const { totalSessions, avgScore, activeDays, totalDays, dailyBreakdown, tableBreakdown } = useWeeklyProgress()

  return (
    <div className={styles.container}>
      <Card title="Progreso Semanal">
        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Sesiones</span>
            <span className={styles.statValue}>{totalSessions}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Promedio</span>
            <span className={styles.statValue}>{avgScore}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Días Activos</span>
            <span className={styles.statValue}>
              {activeDays}/{totalDays}
            </span>
          </div>
        </div>
      </Card>

      <Card title="Actividad Diaria">
        <WeeklyProgressChart data={dailyBreakdown} />
      </Card>

      <Card title="Precisión por Tabla">
        <TablePerformanceChart data={tableBreakdown} />
      </Card>
    </div>
  )
}
