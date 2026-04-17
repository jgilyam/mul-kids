import { describe, it, expect } from 'vitest'
import { slugify } from './slug'

describe('slug', () => {
  describe('slugify', () => {
    it('should lowercase all characters', () => {
      expect(slugify('MARIA')).toBe('maria')
    })

    it('should remove accents (diacritics)', () => {
      expect(slugify('José María')).toBe('jose-maria')
      expect(slugify('Ángel')).toBe('angel')
    })

    it('should replace spaces with hyphens', () => {
      expect(slugify('Juan Pablo')).toBe('juan-pablo')
    })

    it('should remove non-alphanumeric characters except hyphens', () => {
      expect(slugify('María@#$%')).toBe('maria')
      expect(slugify('Test-Name!')).toBe('test-name')
    })

    it('should collapse multiple hyphens into one', () => {
      expect(slugify('Juan   Pablo')).toBe('juan-pablo')
    })

    it('should trim leading and trailing hyphens', () => {
      expect(slugify(' María ')).toBe('maria')
    })

    it('should handle empty strings', () => {
      expect(slugify('')).toBe('')
    })
  })
})
