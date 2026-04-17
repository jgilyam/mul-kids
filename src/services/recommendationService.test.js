import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { recommendationService } from './recommendationService'

describe('recommendationService', () => {
  let randomSpy

  beforeEach(() => {
    randomSpy = vi.spyOn(Math, 'random')
  })

  afterEach(() => {
    randomSpy.mockRestore()
  })

  describe('calculateRecommendedTable', () => {
    it('should return random table when no sessions exist', () => {
      randomSpy.mockReturnValue(0.5)
      const table = recommendationService.calculateRecommendedTable([])
      expect(table).toBeGreaterThanOrEqual(1)
      expect(table).toBeLessThanOrEqual(10)
    })

    it('should return table with lowest performance score', () => {
      // Crear sesiones para TODAS las tablas para que ninguna tenga score 0
      const rounds = []
      for (let table = 1; table <= 10; table++) {
        if (table === 7) {
          // Tabla 7: peor performance (0% accuracy)
          rounds.push({ table: 7, isCorrect: false, timeToAnswer: 8000 })
          rounds.push({ table: 7, isCorrect: false, timeToAnswer: 9000 })
        } else if (table === 5) {
          // Tabla 5: mejor performance (100% accuracy)
          rounds.push({ table: 5, isCorrect: true, timeToAnswer: 2000 })
          rounds.push({ table: 5, isCorrect: true, timeToAnswer: 2000 })
        } else {
          // Otras tablas: performance media
          rounds.push({ table, isCorrect: true, timeToAnswer: 5000 })
        }
      }
      const sessions = [{ rounds }]
      const recommended = recommendationService.calculateRecommendedTable(sessions)
      expect(recommended).toBe(7) // peor performance (0% accuracy)
    })

    it('should break ties by lower table number', () => {
      // Crear sesiones para TODAS las tablas con mismo performance
      const rounds = []
      for (let table = 1; table <= 10; table++) {
        rounds.push({ table, isCorrect: true, timeToAnswer: 5000 })
      }
      const sessions = [{ rounds }]
      const recommended = recommendationService.calculateRecommendedTable(sessions)
      // Todas tienen mismo score, debe retornar la primera (tabla 1)
      expect(recommended).toBe(1)
    })

    it('should return unpracticed table (score 0) first', () => {
      const sessions = [{
        rounds: [
          { table: 5, isCorrect: true, timeToAnswer: 2000 }
        ]
      }]
      const recommended = recommendationService.calculateRecommendedTable(sessions)
      expect(recommended).not.toBe(5) // cualquier otra tabla no practicada
    })
  })

  describe('calculatePerformanceScore', () => {
    it('should weight accuracy at 60% and speed at 40%', () => {
      const accuracy = 0.8 // 80%
      const avgTimeMs = 5000 // 5000 milisegundos = 5 segundos
      const score = recommendationService.calculatePerformanceScore(accuracy, avgTimeMs)
      // avgTimeMs / 1000 = 5 segundos
      // speedScore = 1 / 5 = 0.2
      const expected = (0.8 * 0.6) + (0.2 * 0.4)
      expect(score).toBeCloseTo(expected, 2)
    })

    it('should return higher score for better accuracy', () => {
      const score1 = recommendationService.calculatePerformanceScore(0.9, 5000)
      const score2 = recommendationService.calculatePerformanceScore(0.5, 5000)
      expect(score1).toBeGreaterThan(score2)
    })

    it('should return higher score for faster responses', () => {
      const score1 = recommendationService.calculatePerformanceScore(0.8, 2000)
      const score2 = recommendationService.calculatePerformanceScore(0.8, 10000)
      expect(score1).toBeGreaterThan(score2)
    })
  })

  describe('getTableStats', () => {
    it('should extract stats for specific table', () => {
      const sessions = [{
        rounds: [
          { table: 5, isCorrect: true, timeToAnswer: 2000 },
          { table: 5, isCorrect: false, timeToAnswer: 4000 },
          { table: 7, isCorrect: true, timeToAnswer: 3000 }
        ]
      }]
      const stats = recommendationService.getTableStats(sessions, 5)
      expect(stats.attempts).toBe(2)
      expect(stats.correct).toBe(1)
      expect(stats.avgTime).toBe(3000)
    })

    it('should return zero stats for unpracticed table', () => {
      const stats = recommendationService.getTableStats([], 5)
      expect(stats.attempts).toBe(0)
      expect(stats.correct).toBe(0)
      expect(stats.avgTime).toBe(0)
    })
  })

  describe('getAllPerformanceScores', () => {
    it('should return score for each table 1-10', () => {
      const sessions = [{
        rounds: [
          { table: 5, isCorrect: true, timeToAnswer: 2000 }
        ]
      }]
      const scores = recommendationService.getAllPerformanceScores(sessions)
      expect(Object.keys(scores)).toHaveLength(10)
      expect(scores[5]).toBeGreaterThan(0)
      expect(scores[7]).toBe(0) // no practicada
    })
  })
})
