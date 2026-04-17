import { useMemo } from 'react'
import { useHistoryStore } from '../store/historyStore'
import { useUserStore } from '../store/userStore'
import { historyService } from '../services/historyService'
import { formatDate, getLast7Days } from '../utils/dateHelpers'

/**
 * Hook for aggregated weekly progress data.
 *
 * @returns {{
 *   totalSessions: number,
 *   avgScore: number,
 *   activeDays: number,
 *   totalDays: number,
 *   dailyBreakdown: { date: string, sessions: number, avgScore: number }[],
 *   tableBreakdown: { table: number, accuracy: number, avgTime: number, attempts: number, correct: number }[]
 * }}
 */
export function useWeeklyProgress() {
  const sessions = useHistoryStore((state) => state.sessions)
  const user = useUserStore((state) => state.user)

  // Filter sessions for current user
  const userSessions = useMemo(() => {
    if (!user) return []
    return sessions.filter((s) => s.userId === user.id)
  }, [sessions, user])

  // Calculate weekly progress
  const weeklyProgress = useMemo(() => {
    return historyService.calculateWeeklyProgress(userSessions)
  }, [userSessions])

  // Daily breakdown for last 7 days
  const dailyBreakdown = useMemo(() => {
    const last7Days = getLast7Days()
    const sessionsByDate = historyService.groupSessionsByDate(userSessions)

    return last7Days.map((date) => {
      const daySessions = sessionsByDate.get(date) || []
      const totalScore = daySessions.reduce((sum, s) => sum + s.totalScore, 0)
      const avgScore = daySessions.length > 0 ? Math.round(totalScore / daySessions.length) : 0

      return {
        date,
        sessions: daySessions.length,
        avgScore
      }
    })
  }, [userSessions])

  // Table breakdown (1-10)
  const tableBreakdown = useMemo(() => {
    return historyService.calculateTableBreakdown(userSessions)
  }, [userSessions])

  return {
    totalSessions: weeklyProgress.totalSessions,
    avgScore: weeklyProgress.avgScore,
    activeDays: weeklyProgress.activeDays,
    totalDays: 7,
    dailyBreakdown,
    tableBreakdown
  }
}
