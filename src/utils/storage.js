// Safe localStorage helpers.
// All reads are wrapped in try/catch so corrupted or unavailable storage
// never breaks the application.

import { useEffect, useState } from 'react'

const PREFIX = 'ssa.'

const isArray = (v) => Array.isArray(v)

/**
 * Read a value from localStorage and validate it.
 */
export function loadValue(key, fallback, validator) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    const parsed = JSON.parse(raw)
    if (typeof validator === 'function' && !validator(parsed)) return fallback
    return parsed
  } catch (err) {
    console.warn('Could not read saved data for key "' + key + '".', err)
    return fallback
  }
}

/**
 * Write a value to localStorage without throwing.
 */
export function saveValue(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch (err) {
    console.warn('Could not save data for key "' + key + '".', err)
    return false
  }
}

/**
 * React state hook that persists an array in localStorage.
 * Malformed or missing data falls back to the supplied default.
 */
export function usePersistentArray(key, fallback = []) {
  const [state, setState] = useState(() => loadValue(key, fallback, isArray))

  useEffect(() => {
    saveValue(key, state)
  }, [key, state])

  return [state, setState]
}
