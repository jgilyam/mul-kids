import { describe, it, expect } from 'vitest'
import { formatDate, isWithinLastNDays, getLast7Days } from './dateHelpers'

describe('dateHelpers', () => {
  describe('formatDate', () => {
    it('should format timestamp to YYYY-MM-DD', () => {
      const date = new Date('2026-04-07T15:30:00Z').getTime()
      expect(formatDate(date)).toBe('2026-04-07')
    })
  })

  describe('isWithinLastNDays', () => {
    it('should return true for date within range', () => {
      const now = Date.now()
      const threeDaysAgo = now - (3 * 24 * 60 * 60 * 1000)
      expect(isWithinLastNDays(threeDaysAgo, 7)).toBe(true)
    })

    it('should return false for date outside range', () => {
      const now = Date.now()
      const tenDaysAgo = now - (10 * 24 * 60 * 60 * 1000)
      expect(isWithinLastNDays(tenDaysAgo, 7)).toBe(false)
    })

    it('should return true for exact boundary', () => {
      const now = Date.now()
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000)
      expect(isWithinLastNDays(sevenDaysAgo, 7)).toBe(true)
    })
  })

  describe('getLast7Days', () => {
    it('should return array of 7 date strings', () => {
      const days = getLast7Days()
      expect(days).toHaveLength(7)
      expect(days[0]).toMatch(/\d{4}-\d{2}-\d{2}/)
    })

    it('should include today as first element', () => {
      const days = getLast7Days()
      const today = formatDate(Date.now())
      expect(days[0]).toBe(today)
    })
  })
})
