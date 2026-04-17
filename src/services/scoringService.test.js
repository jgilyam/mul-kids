import { describe, it, expect } from 'vitest'
import { scoringService } from './scoringService'

describe('scoringService', () => {
  describe('calculateScore', () => {
    it('should return 0 for incorrect answers regardless of time', () => {
      expect(scoringService.calculateScore(false, 1000)).toBe(0)
      expect(scoringService.calculateScore(false, 10000)).toBe(0)
    })

    it('should return 100 for correct answers <= 2000ms', () => {
      expect(scoringService.calculateScore(true, 1000)).toBe(100)
      expect(scoringService.calculateScore(true, 2000)).toBe(100)
    })

    it('should return 80 for correct answers 2001-5000ms', () => {
      expect(scoringService.calculateScore(true, 2001)).toBe(80)
      expect(scoringService.calculateScore(true, 3500)).toBe(80)
      expect(scoringService.calculateScore(true, 5000)).toBe(80)
    })

    it('should return 60 for correct answers 5001-10000ms', () => {
      expect(scoringService.calculateScore(true, 7000)).toBe(60)
      expect(scoringService.calculateScore(true, 10000)).toBe(60)
    })

    it('should return 40 for correct answers 10001-15000ms', () => {
      expect(scoringService.calculateScore(true, 12000)).toBe(40)
      expect(scoringService.calculateScore(true, 15000)).toBe(40)
    })

    it('should return 20 for correct answers > 15000ms', () => {
      expect(scoringService.calculateScore(true, 18000)).toBe(20)
      expect(scoringService.calculateScore(true, 30000)).toBe(20)
    })
  })

  describe('calculateTotalScore', () => {
    it('should sum all round scores', () => {
      const rounds = [
        { score: 100 },
        { score: 80 },
        { score: 60 }
      ]
      expect(scoringService.calculateTotalScore(rounds)).toBe(240)
    })

    it('should return 0 for empty rounds', () => {
      expect(scoringService.calculateTotalScore([])).toBe(0)
    })
  })

  describe('calculateAccuracy', () => {
    it('should return percentage of correct answers', () => {
      const rounds = [
        { isCorrect: true },
        { isCorrect: true },
        { isCorrect: false },
        { isCorrect: true }
      ]
      expect(scoringService.calculateAccuracy(rounds)).toBe(75)
    })

    it('should return 0 for empty rounds', () => {
      expect(scoringService.calculateAccuracy([])).toBe(0)
    })

    it('should return 100 for all correct', () => {
      const rounds = [{ isCorrect: true }, { isCorrect: true }]
      expect(scoringService.calculateAccuracy(rounds)).toBe(100)
    })

    it('should return 0 for all incorrect', () => {
      const rounds = [{ isCorrect: false }, { isCorrect: false }]
      expect(scoringService.calculateAccuracy(rounds)).toBe(0)
    })
  })

  describe('calculateAverageTime', () => {
    it('should calculate average timeToAnswer', () => {
      const rounds = [
        { timeToAnswer: 2000 },
        { timeToAnswer: 4000 },
        { timeToAnswer: 6000 }
      ]
      expect(scoringService.calculateAverageTime(rounds)).toBe(4000)
    })

    it('should return 0 for empty rounds', () => {
      expect(scoringService.calculateAverageTime([])).toBe(0)
    })
  })

  describe('getScoreTier', () => {
    it('should return "perfect" for <= 2000ms', () => {
      expect(scoringService.getScoreTier(1500)).toBe('perfect')
    })

    it('should return "great" for 2001-5000ms', () => {
      expect(scoringService.getScoreTier(3500)).toBe('great')
    })

    it('should return "good" for 5001-10000ms', () => {
      expect(scoringService.getScoreTier(7000)).toBe('good')
    })

    it('should return "ok" for 10001-15000ms', () => {
      expect(scoringService.getScoreTier(12000)).toBe('ok')
    })

    it('should return "slow" for > 15000ms', () => {
      expect(scoringService.getScoreTier(18000)).toBe('slow')
    })
  })
})
