import { describe, it, expect } from 'vitest'
import { gameService } from './gameService'

describe('gameService', () => {
  describe('generateQuestions', () => {
    it('should generate exactly N questions', () => {
      const questions = gameService.generateQuestions(5, 10)
      expect(questions).toHaveLength(10)
    })

    it('should generate questions for specified table', () => {
      const questions = gameService.generateQuestions(7, 10)
      questions.forEach(q => {
        expect(q.table).toBe(7)
      })
    })

    it('should have unique multipliers (no repeats)', () => {
      const questions = gameService.generateQuestions(3, 10)
      const multipliers = questions.map(q => q.multiplier)
      const uniqueMultipliers = new Set(multipliers)
      expect(uniqueMultipliers.size).toBe(10)
    })

    it('should have multipliers in range 1-10', () => {
      const questions = gameService.generateQuestions(5, 10)
      questions.forEach(q => {
        expect(q.multiplier).toBeGreaterThanOrEqual(1)
        expect(q.multiplier).toBeLessThanOrEqual(10)
      })
    })

    it('should calculate correct answers', () => {
      const questions = gameService.generateQuestions(7, 10)
      questions.forEach(q => {
        expect(q.correctAnswer).toBe(q.table * q.multiplier)
      })
    })

    it('should handle mixed mode (null table)', () => {
      const questions = gameService.generateQuestions(null, 10)
      expect(questions).toHaveLength(10)
      const tables = questions.map(q => q.table)
      const uniqueTables = new Set(tables)
      expect(uniqueTables.size).toBeGreaterThan(1) // múltiples tablas
    })

    it('should generate unique IDs for each question', () => {
      const questions = gameService.generateQuestions(5, 10)
      const ids = questions.map(q => q.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(10)
    })
  })

  describe('validateAnswer', () => {
    it('should return true for correct answers', () => {
      expect(gameService.validateAnswer(56, 56)).toBe(true)
    })

    it('should return false for incorrect answers', () => {
      expect(gameService.validateAnswer(54, 56)).toBe(false)
    })
  })

  describe('createRound', () => {
    it('should create Round object with all fields', () => {
      const question = { id: 'q1', table: 7, multiplier: 8, correctAnswer: 56 }
      const round = gameService.createRound(question, 56, 1800, 100)
      expect(round).toEqual({
        questionId: 'q1',
        table: 7,
        multiplier: 8,
        correctAnswer: 56,
        userAnswer: 56,
        timeToAnswer: 1800,
        isCorrect: true,
        score: 100
      })
    })
  })
})
