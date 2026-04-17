import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useUserStore } from './userStore'

// Mock fingerprint
vi.mock('../utils/fingerprint.js', () => ({
  generateFingerprint: () => 'test-fingerprint'
}))

describe('userStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserStore.setState({ user: null, isRegistered: false })
  })

  it('should initialize with null user', () => {
    const state = useUserStore.getState()
    expect(state.user).toBeNull()
    expect(state.isRegistered).toBe(false)
  })

  it('should register new user', async () => {
    await useUserStore.getState().register('María')
    const state = useUserStore.getState()
    expect(state.user).not.toBeNull()
    expect(state.user.name).toBe('María')
    expect(state.user.id).toMatch(/^maria-/)
    expect(state.isRegistered).toBe(true)
  })

  it('should persist user to localStorage', async () => {
    await useUserStore.getState().register('Juan')
    const stored = localStorage.getItem('mat-kids-current-user')
    expect(stored).toBeTruthy()
    const parsed = JSON.parse(stored)
    expect(parsed.state.user.name).toBe('Juan')
  })

  it('should clear user', async () => {
    await useUserStore.getState().register('María')
    useUserStore.getState().clearUser()
    const state = useUserStore.getState()
    expect(state.user).toBeNull()
    expect(state.isRegistered).toBe(false)
  })

  it('should reject invalid names', async () => {
    await expect(useUserStore.getState().register('J')).rejects.toThrow()
  })
})
