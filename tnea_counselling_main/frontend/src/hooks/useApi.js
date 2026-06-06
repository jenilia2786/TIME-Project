/**
 * useApi.js — Reusable hook for wrapping async API calls with loading/error state.
 *
 * Usage:
 *   const { data, loading, error, execute } = useApi(fetchDirectory)
 *   execute({ search: 'Anna', page: 1 })   // triggers the call
 *   execute({ search: 'PSG', page: 1 })    // re-triggers, replaces previous result
 *
 * The hook handles:
 *   - loading spinner state
 *   - error normalization (message string)
 *   - stale result cleanup on re-execute
 *   - optional onSuccess callback
 *
 * Callers never need to write try/catch/finally boilerplate.
 */

import { useState, useCallback } from 'react'

/**
 * @template T
 * @param {(...args: any[]) => Promise<T>} apiFn  - Any async service function
 * @param {object} [options]
 * @param {function} [options.onSuccess]  - Called with data when the call succeeds
 * @param {function} [options.onError]    - Called with error when the call fails
 * @returns {{ data: T|null, loading: boolean, error: string|null, execute: function }}
 */
export default function useApi(apiFn, options = {}) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiFn(...args)
      setData(result)
      options.onSuccess?.(result)
      return result
    } catch (err) {
      const message = err?.message || 'Something went wrong. Please try again.'
      setError(message)
      options.onError?.(err)
      return null
    } finally {
      setLoading(false)
    }
  }, [apiFn]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, execute }
}
