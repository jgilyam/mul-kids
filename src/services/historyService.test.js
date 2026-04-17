import { describe, it, expect } from 'vitest'
import { historyService } from './historyService'

describe('historyService', () => {
  describe('cleanupOldSessions', () => {
    it('should remove sessions older than 7 days', () => {
      const now = Date.now()
      const sessions = [
        { completedAt: now - (8 * 24 * 60 * 60 * 1000) }, // 8 días
        { completedAt: now - (5 * 24 * 60 * 60 * 1000) }, // 5 días
        { completedAt: now }
      ]
      const cleaned = historyService.cleanupOldSessions(sessions)
      expect(cleaned).toHaveLength(2)
    })

    it('should keep sessions within 7 days', () => {
      const now = Date.now()
      const sessions = [
        { completedAt: now - (6 * 24 * 60 * 60 * 1000) }
      ]
      const cleaned = historyService.cleanupOldSessions(sessions)
      expect(cleaned).toHaveLength(1)
    })

    it('should remove abandoned sessions (null completedAt)', () => {
      const sessions = [
        { completedAt: null },
        { completedAt: Date.now() }
      ]
      const cleaned = historyService.cleanupOldSessions(sessions)
      expect(cleaned).toHaveLength(1)
      expect(cleaned[0].completedAt).not.toBeNull()
    })

    it('should return empty array when all expired', () => {
      const now = Date.now()
      const sessions = [
        { completedAt: now - (10 * 24 * 60 * 60 * 1000) }
      ]
      const cleaned = historyService.cleanupOldSessions(sessions)
      expect(cleaned).toHaveLength(0)
    })

    it('should not mutate original array', () => {
      const sessions = [{ completedAt: Date.now() }]
      const original = [...sessions]
      historyService.cleanupOldSessions(sessions)
      expect(sessions).toEqual(original)
    })
  })

  describe('calculateWeeklyProgress', () => {
    it('should calculate total sessions, avgScore, activeDays', () => {
      const now = Date.now()
      const sessions = [
        { completedAt: now, totalScore: 800, rounds: [] },
        { completedAt: now, totalScore: 900, rounds: [] },
        { completedAt: now - (2 * 24 * 60 * 60 * 1000), totalScore: 700, rounds: [] }
      ]
      const progress = historyService.calculateWeeklyProgress(sessions)
      expect(progress.totalSessions).toBe(3)
      expect(progress.avgScore).toBe(800) // (800+900+700)/3
      expect(progress.activeDays).toBe(2) // 2 días únicos
      expect(progress.totalDays).toBe(7)
    })

    it('should return zero stats for empty sessions', () => {
      const progress = historyService.calculateWeeklyProgress([])
      expect(progress.totalSessions).toBe(0)
      expect(progress.avgScore).toBe(0)
      expect(progress.activeDays).toBe(0)
    })
  })

  describe('groupSessionsByDate', () => {
    it('should group sessions by YYYY-MM-DD', () => {
      const date1 = new Date('2026-04-07T12:00:00').getTime()
      const date2 = new Date('2026-04-05T12:00:00').getTime()
      const sessions = [
        { completedAt: date1 },
        { completedAt: date1 },
        { completedAt: date2 }
      ]
      const grouped = historyService.groupSessionsByDate(sessions)
      expect(grouped.size).toBe(2)
      // Verificar que tiene exactamente 2 grupos
      const groups = Array.from(grouped.values())
      expect(groups.some(g => g.length === 2)).toBe(true)
      expect(groups.some(g => g.length === 1)).toBe(true)
    })
  })

  describe('calculateTableBreakdown', () => {
    it('should aggregate performance per table 1-10', () => {
      const sessions = [{
        rounds: [
          { table: 5, isCorrect: true, timeToAnswer: 2000 },
          { table: 5, isCorrect: false, timeToAnswer: 3000 },
          { table: 7, isCorrect: true, timeToAnswer: 4000 }
        ]
      }]
      const breakdown = historyService.calculateTableBreakdown(sessions)
      const table5 = breakdown.find(b => b.table === 5)
      expect(table5.attempts).toBe(2)
      expect(table5.correct).toBe(1)
      expect(table5.accuracy).toBe(50)
      expect(table5.avgTime).toBe(2500)
    })

    it('should include all 10 tables even if not practiced', () => {
      const breakdown = historyService.calculateTableBreakdown([])
      expect(breakdown).toHaveLength(10)
      breakdown.forEach(b => {
        expect(b.attempts).toBe(0)
      })
    })
  })
})
