import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { userService } from '../services/userService.js'
import { generateFingerprint } from '../utils/fingerprint.js'

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isRegistered: false,

      /**
       * @param {string} name
       * @returns {Promise<void>}
       */
      register: async (name) => {
        // Validar nombre
        const validation = userService.validateName(name)
        if (!validation.valid) {
          throw new Error(validation.error)
        }

        // Generar fingerprint y userId
        const fingerprint = generateFingerprint()
        const userId = await userService.generateUserId(name, fingerprint)

        // Crear usuario
        const user = userService.createUser(name, userId)

        set({ user, isRegistered: true })
      },

      clearUser: () => {
        set({ user: null, isRegistered: false })
      }
    }),
    {
      name: 'mat-kids-current-user'
    }
  )
)
