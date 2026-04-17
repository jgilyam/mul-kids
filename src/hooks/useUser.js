import { useState } from 'react'
import { useUserStore } from '../store/userStore'
import { userService } from '../services/userService'

/**
 * Bridge between components and userStore with validation
 *
 * @returns {{
 *   user: import('../types').User | null,
 *   isRegistered: boolean,
 *   register: (name: string) => Promise<void>,
 *   clearUser: () => void,
 *   validationError: string | null
 * }}
 */
export function useUser() {
  const [validationError, setValidationError] = useState(null)

  const user = useUserStore((state) => state.user)
  const isRegistered = useUserStore((state) => state.isRegistered)
  const registerStore = useUserStore((state) => state.register)
  const clearUserStore = useUserStore((state) => state.clearUser)

  /**
   * Register new user with validation
   * @param {string} name
   */
  const register = async (name) => {
    console.log('[useUser] register called with name:', name)
    // Validate name first
    const validation = userService.validateName(name)
    console.log('[useUser] validation result:', validation)
    if (!validation.valid) {
      setValidationError(validation.error)
      return
    }

    // Clear any previous errors
    setValidationError(null)

    // Call store action
    console.log('[useUser] calling registerStore')
    try {
      await registerStore(name)
      console.log('[useUser] registerStore completed')
    } catch (error) {
      console.error('[useUser] registerStore failed:', error)
      throw error
    }
  }

  /**
   * Clear user data
   */
  const clearUser = () => {
    setValidationError(null)
    clearUserStore()
  }

  return {
    user,
    isRegistered,
    register,
    clearUser,
    validationError
  }
}
