// Reusable rules for Quasar inputs
export const required =
  (label = 'This field') =>
  (v) =>
    (v !== null && v !== undefined && String(v).trim() !== '') || `${label} is required`

export const emailRule = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v || '') || 'Enter a valid email'

export const phoneRule = (v) =>
  /^\+?[0-9\s-]{7,15}$/.test(v || '') || 'Enter a valid phone number (7-15 digits)'

export const minLength = (n) => (v) => (v || '').length >= n || `Minimum ${n} characters`

export const positiveNumber = (v) => Number(v) > 0 || 'Must be greater than 0'

export const positiveInt = (label) => (v) =>
  (Number.isInteger(Number(v)) && Number(v) > 0) || `${label} must be a positive number`
