import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUser } from './useUser'
import { useUserStore } from '../store/userStore'

describe('useUser', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserStore.setState({ user: null, isRegistered: false })
  })

  it('should return user state', () => {
    const { result } = renderHook(() => useUser())
    expect(result.current.user).toBeNull()
    expect(result.current.isRegistered).toBe(false)
  })

  it('should register new user', async () => {
    const { result } = renderHook(() => useUser())
    await act(async () => {
      await result.current.register('María')
    })
    expect(result.current.user).not.toBeNull()
    expect(result.current.user.name).toBe('María')
  })

  it('should return validation error for invalid name', async () => {
    const { result } = renderHook(() => useUser())
    await act(async () => {
      await result.current.register('J')
    })
    expect(result.current.validationError).toBeTruthy()
  })

  it('should clear user', () => {
    const { result } = renderHook(() => useUser())
    act(() => {
      result.current.clearUser()
    })
    expect(result.current.user).toBeNull()
  })
})
