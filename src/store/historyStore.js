import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { historyService } from '../services/historyService.js'

export const useHistoryStore = create(
  persist(
    (set, get) => ({
      sessions: [],

      /**
       * @param {import('../types/game.js').GameSession} session
       */
      addSession: (session) => {
        const currentSessions = get().sessions
        const allSessions = [...currentSessions, session]
        // Cleanup automático: remover sesiones > 7 días
        const cleaned = historyService.cleanupOldSessions(allSessions)
        set({ sessions: cleaned })
      },

      /**
       * @param {string} userId
       */
      getSessionsForUser: (userId) => {
        const sessions = get().sessions
        return sessions.filter(s => s.userId === userId)
      },

      /**
       * @param {string} userId
       */
      getWeeklyProgress: (userId) => {
        const sessions = get().getSessionsForUser(userId)
        return historyService.calculateWeeklyProgress(sessions)
      },

      /**
       * @param {string} userId
       */
      getTableBreakdown: (userId) => {
        const sessions = get().getSessionsForUser(userId)
        return historyService.calculateTableBreakdown(sessions)
      },

      /**
       * Manual cleanup: remove sessions > 7 days
       */
      cleanup: () => {
        const sessions = get().sessions
        const cleaned = historyService.cleanupOldSessions(sessions)
        set({ sessions: cleaned })
      }
    }),
    {
      name: 'mat-kids-history'
    }
  )
)
