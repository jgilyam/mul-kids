import { useMemo } from 'react'
import { useHistoryStore } from '../store/historyStore'
import { useUserStore } from '../store/userStore'
import { recommendationService } from '../services/recommendationService'

/**
 * Hook for table recommendation based on performance.
 *
 * @returns {{
 *   recommendedTable: number,
 *   performanceScores: { [table: number]: number },
 *   weakestTable: number | null,
 *   strongestTable: number | null,
 *   hasEnoughData: boolean
 * }}
 */
export function useRecommendation() {
  const sessions = useHistoryStore((state) => state.sessions)
  const user = useUserStore((state) => state.user)

  // Filter sessions for current user
  const userSessions = useMemo(() => {
    if (!user) return []
    return sessions.filter((s) => s.userId === user.id)
  }, [sessions, user])

  // Calculate performance scores for all tables
  const performanceScores = useMemo(() => {
    return recommendationService.getAllPerformanceScores(userSessions)
  }, [userSessions])

  // Find weakest and strongest tables
  const { weakestTable, strongestTable } = useMemo(() => {
    const entries = Object.entries(performanceScores)
      .filter(([, score]) => score > 0) // Only consider practiced tables
      .sort(([, a], [, b]) => a - b)

    return {
      weakestTable: entries.length > 0 ? Number(entries[0][0]) : null,
      strongestTable: entries.length > 0 ? Number(entries[entries.length - 1][0]) : null
    }
  }, [performanceScores])

  // Get recommended table
  const recommendedTable = useMemo(() => {
    return recommendationService.calculateRecommendedTable(userSessions)
  }, [userSessions])

  return {
    recommendedTable,
    performanceScores,
    weakestTable,
    strongestTable,
    hasEnoughData: userSessions.length > 0
  }
}
