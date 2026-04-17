import { describe, it, expect } from 'vitest'
import { userService } from './userService'

describe('userService', () => {
  describe('validateName', () => {
    it('should accept valid names', () => {
      expect(userService.validateName('María')).toEqual({ valid: true, error: null })
    })

    it('should reject names < 2 characters', () => {
      const result = userService.validateName('J')
      expect(result.valid).toBe(false)
      expect(result.error).toMatch(/al menos 2/)
    })

    it('should reject names > 20 characters', () => {
      const result = userService.validateName('A'.repeat(21))
      expect(result.valid).toBe(false)
      expect(result.error).toMatch(/máximo 20/)
    })

    it('should reject names with numbers', () => {
      const result = userService.validateName('Juan123')
      expect(result.valid).toBe(false)
      expect(result.error).toMatch(/solo/)
    })

    it('should accept names with accents and spaces', () => {
      expect(userService.validateName('José María').valid).toBe(true)
    })
  })

  describe('generateUserId', () => {
    it('should generate deterministic ID for same input', async () => {
      const fp = 'Mozilla/5.0|es-MX|1920|1080'
      const id1 = await userService.generateUserId('María', fp)
      const id2 = await userService.generateUserId('María', fp)
      expect(id1).toBe(id2)
    })

    it('should include slugified name', async () => {
      const fp = 'test-fingerprint'
      const id = await userService.generateUserId('José María', fp)
      expect(id).toMatch(/^jose-maria-/)
    })

    it('should append 8-char hash', async () => {
      const fp = 'test-fingerprint'
      const id = await userService.generateUserId('María', fp)
      expect(id).toMatch(/^maria-[0-9a-f]{8}$/)
    })

    it('should be URL-safe', async () => {
      const fp = 'test'
      const id = await userService.generateUserId('José María', fp)
      expect(id).toMatch(/^[a-z0-9-]+$/)
    })
  })

  describe('createUser', () => {
    it('should create User object with all fields', () => {
      const user = userService.createUser('María', 'maria-a3f4e9b2')
      expect(user).toEqual({
        id: 'maria-a3f4e9b2',
        name: 'María',
        createdAt: expect.any(Number)
      })
    })
  })
})
