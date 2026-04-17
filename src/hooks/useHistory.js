import { useMemo } from 'react'
import { useHistoryStore } from '../store/historyStore'
import { formatDate } from '../utils/dateHelpers'

/**
 * Hook to access session history with filtering and cleanup utilities.
 *
 * @returns {{
 *   sessions: import('../types').GameSession[],
 *   todaySessions: import('../types').GameSession[],
 *   totalSessions: number,
 *   isLoading: boolean,
 *   cleanup: () => void
 * }}
 */
export function useHistory() {
  const sessions = useHistoryStore((state) => state.sessions)
  const cleanup = useHistoryStore((state) => state.cleanup)

  const todaySessions = useMemo(() => {
    const today = formatDate(Date.now())
    return sessions.filter((session) => {
      if (!session.completedAt) return false
      const sessionDate = formatDate(session.completedAt)
      return sessionDate === today
    })
  }, [sessions])

  return {
    sessions,
    todaySessions,
    totalSessions: sessions.length,
    isLoading: false,
    cleanup
  }
}
