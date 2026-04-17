import { useWeeklyProgress } from '../../hooks/useWeeklyProgress'
import Card from '../ui/Card'
import WeeklyProgressChart from '../charts/WeeklyProgressChart'
import TablePerformanceChart from '../charts/TablePerformanceChart'

/**
 * Progress view: weekly summary, charts for daily progress and table performance.
 */
export default function ProgressView() {
  const { totalSessions, avgScore, activeDays, totalDays, dailyBreakdown, tableBreakdown } = useWeeklyProgress()

  return (
    <div className="progress-view">
      <Card title="Progreso Semanal">
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-label">Sesiones</span>
            <span className="stat-value">{totalSessions}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Promedio</span>
            <span className="stat-value">{avgScore}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Días Activos</span>
            <span className="stat-value">
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
