/**
 * api.js — Centralized HTTP client for TNEA backend
 *
 * In development: Vite proxy rewrites /recommend, /chat, /directory, etc.
 *                 directly to http://localhost:8000 so BASE_URL can be ''
 * In production:  FastAPI serves the frontend at '/' and handles all API
 *                 routes, so same-origin requests work with BASE_URL = ''
 *
 * Never import a URL directly in page or store files.
 * Always use apiGet / apiPost from this module.
 */

const BASE_URL = import.meta.env.VITE_API_URL || ''

/**
 * Normalize error responses into a consistent shape:
 * { ok: false, status, message }
 */
async function handleResponse(res) {
  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const errBody = await res.json()
      message = errBody?.detail || errBody?.message || message
    } catch (_) {
      // ignore JSON parse failure on error body
    }
    const err = new Error(message)
    err.status = res.status
    throw err
  }
  return res.json()
}

/**
 * GET request with optional query params object.
 *
 * @param {string} path   - e.g. '/metadata' or '/directory'
 * @param {object} params - key/value pairs appended as query string
 *                          Arrays are handled: { districts: ['Chennai','Salem'] }
 *                          → ?districts=Chennai&districts=Salem
 * @returns {Promise<any>}
 */
export async function apiGet(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin)

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      value.forEach((v) => { if (v !== undefined && v !== null && v !== '') url.searchParams.append(key, v) })
    } else {
      url.searchParams.set(key, value)
    }
  })

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  return handleResponse(res)
}

/**
 * POST request with JSON body.
 *
 * @param {string} path       - e.g. '/recommend' or '/chat'
 * @param {object} body       - serialized as JSON
 * @param {object} queryParams - optional query string params (for endpoints
 *                               that take session_id as a query param)
 * @returns {Promise<any>}
 */
export async function apiPost(path, body = {}, queryParams = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin)

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    url.searchParams.set(key, value)
  })

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })
  return handleResponse(res)
}
