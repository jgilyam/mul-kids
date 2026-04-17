import { slugify } from '../utils/slug.js'

export const userService = {
  /**
   * @param {string} name
   * @returns {{ valid: boolean, error: string | null }}
   */
  validateName(name) {
    if (!name || name.length < 2) {
      return { valid: false, error: 'El nombre debe tener al menos 2 caracteres' }
    }
    if (name.length > 20) {
      return { valid: false, error: 'El nombre debe tener máximo 20 caracteres' }
    }
    if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(name)) {
      return { valid: false, error: 'El nombre solo puede contener letras, espacios y guiones' }
    }
    return { valid: true, error: null }
  },

  /**
   * BR-01: User ID Generation
   * Genera un ID único y determinístico basado en nombre + fingerprint
   * @param {string} name
   * @param {string} fingerprint
   * @returns {Promise<string>} - formato: "{name-slug}-{hash8}"
   */
  async generateUserId(name, fingerprint) {
    const slug = slugify(name)
    const encoder = new TextEncoder()
    const data = encoder.encode(fingerprint)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    const hash8 = hashHex.substring(0, 8)
    return `${slug}-${hash8}`
  },

  /**
   * @param {string} name
   * @param {string} userId
   * @returns {import('../types/user.js').User}
   */
  createUser(name, userId) {
    return {
      id: userId,
      name,
      createdAt: Date.now()
    }
  }
}
