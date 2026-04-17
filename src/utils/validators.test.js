import { describe, it, expect } from 'vitest'
import { isValidNumber, isInRange } from './validators'

describe('validators', () => {
  describe('isValidNumber', () => {
    it('should return true for valid integers', () => {
      expect(isValidNumber(5)).toBe(true)
      expect(isValidNumber(0)).toBe(true)
    })

    it('should return false for non-numbers', () => {
      expect(isValidNumber('5')).toBe(false)
      expect(isValidNumber(null)).toBe(false)
    })

    it('should return false for floats', () => {
      expect(isValidNumber(5.5)).toBe(false)
    })
  })

  describe('isInRange', () => {
    it('should return true for numbers in range', () => {
      expect(isInRange(5, 1, 10)).toBe(true)
    })

    it('should return true for boundaries', () => {
      expect(isInRange(1, 1, 10)).toBe(true)
      expect(isInRange(10, 1, 10)).toBe(true)
    })

    it('should return false for out of range', () => {
      expect(isInRange(0, 1, 10)).toBe(false)
      expect(isInRange(11, 1, 10)).toBe(false)
    })
  })
})
