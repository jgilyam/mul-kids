export const createLocalStorageMock = () => {
  let store = {}

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} },
    key: (index) => {
      const keys = Object.keys(store)
      return keys[index] || null
    },
    get length() { return Object.keys(store).length },
    hasOwnProperty: (key) => Object.prototype.hasOwnProperty.call(store, key)
  }
}

// Ensure localStorage exists in globalThis AND global (for Node env)
if (typeof globalThis !== 'undefined') {
  globalThis.localStorage = createLocalStorageMock()
}
if (typeof global !== 'undefined' && !global.localStorage) {
  global.localStorage = createLocalStorageMock()
}
