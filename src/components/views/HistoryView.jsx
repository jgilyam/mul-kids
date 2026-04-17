import { useMemo } from 'react'
import { useHistory } from '../../hooks/useHistory'
import { useUserStore } from '../../store/userStore'
import { historyService } from '../../services/historyService'
import { formatDate } from '../../utils/dateHelpers'
import Card from '../ui/Card'

/**
 * History view: list of all sessions from last 7 days grouped by date.
 */
export default function HistoryView() {
  const { sessions } = useHistory()
  const user = useUserStore((state) => state.user)

  const userSessions = useMemo(() => {
    if (!user) return []
    return sessions.filter((s) => s.userId === user.id)
  }, [sessions, user])

  const sessionsByDate = useMemo(() => {
    return historyService.groupSessionsByDate(userSessions)
  }, [userSessions])

  const sortedDates = useMemo(() => {
    return Array.from(sessionsByDate.keys()).sort().reverse()
  }, [sessionsByDate])

  if (userSessions.length === 0) {
    return (
      <div className="history-view">
        <Card title="Historial">
          <p>No hay sesiones registradas en los últimos 7 días.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="history-view">
      <Card title="Historial de Sesiones">
        {sortedDates.map((date) => {
          const daySessions = sessionsByDate.get(date)
          return (
            <div key={date} className="date-group">
              <h3>{formatDate(new Date(date).getTime())}</h3>
              <div className="session-list">
                {daySessions.map((session) => (
                  <div key={session.id} className="session-card">
                    <div className="session-info">
                      <span className="session-table">
                        {session.table ? `Tabla ${session.table}` : 'Modo Mixto'}
                      </span>
                      <span className="session-score">{session.totalScore}</span>
                    </div>
                    <div className="session-time">
                      {new Date(session.completedAt).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}
