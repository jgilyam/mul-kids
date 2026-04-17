import { describe, it, expect, beforeEach } from 'vitest'
import { storageService } from './storageService'

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getSessions', () => {
    it('should return empty array when key does not exist', () => {
      expect(storageService.getSessions('user-123')).toEqual([])
    })

    it('should parse and return stored sessions', () => {
      const sessions = [{ id: '1', totalScore: 800 }]
      localStorage.setItem('mat-kids-sessions-user-123', JSON.stringify(sessions))
      expect(storageService.getSessions('user-123')).toEqual(sessions)
    })

    it('should return empty array for corrupted data', () => {
      localStorage.setItem('mat-kids-sessions-user-123', 'invalid-json')
      expect(storageService.getSessions('user-123')).toEqual([])
    })
  })

  describe('saveSessions', () => {
    it('should stringify and save sessions', () => {
      const sessions = [{ id: '1', totalScore: 800 }]
      storageService.saveSessions('user-123', sessions)
      const stored = localStorage.getItem('mat-kids-sessions-user-123')
      expect(JSON.parse(stored)).toEqual(sessions)
    })
  })

  describe('getStorageUsage', () => {
    it('should estimate localStorage usage', () => {
      localStorage.setItem('test-key', 'a'.repeat(1000))
      const usage = storageService.getStorageUsage()
      expect(usage.used).toBeGreaterThan(0)
      expect(usage.limit).toBe(5 * 1024 * 1024)
      expect(usage.percentage).toBeGreaterThan(0)
    })
  })

  describe('isAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(storageService.isAvailable()).toBe(true)
    })
  })
})
