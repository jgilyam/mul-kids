import '@testing-library/jest-dom'
import './mocks/localStorage.js'
import * as React from 'react'

// Make React available globally for JSX transform in tests
globalThis.React = React
