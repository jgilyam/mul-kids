import { describe, it, expect, beforeEach } from 'vitest'
import { generateFingerprint } from './fingerprint'

describe('fingerprint', () => {
  beforeEach(() => {
    // Mock navigator and screen globals
    globalThis.navigator = {
      userAgent: 'Mozilla/5.0...',
      language: 'es-MX'
    }
    globalThis.screen = {
      width: 1920,
      height: 1080
    }
  })

  it('should generate deterministic fingerprint for same browser', () => {
    const fp1 = generateFingerprint()
    const fp2 = generateFingerprint()
    expect(fp1).toBe(fp2)
  })

  it('should include userAgent, language, and screen dimensions', () => {
    const fp = generateFingerprint()
    expect(fp).toContain('Mozilla')
    expect(fp).toContain('es-MX')
    expect(fp).toContain('1920')
  })
})
