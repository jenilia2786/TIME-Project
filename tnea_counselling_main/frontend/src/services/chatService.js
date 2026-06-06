/**
 * chatService.js — AI chat endpoint integration.
 *
 * Sends user messages to POST /chat and returns the AI response.
 * Reads student context (sessionId, community, computedCutoff) directly
 * from Zustand using .getState() — callers only need to pass the query text.
 *
 * INTEGRATION NOTE (Correction 4 from validation report):
 *   PersistentChat.jsx does NOT call this service — it navigates to /assistant
 *   with: navigate('/assistant', { state: { initialQuery: text } })
 *   Assistant.jsx must read location.state.initialQuery on mount and call
 *   sendChatMessage() to trigger the first AI turn automatically.
 */

import { apiPost } from './api.js'
import useStudentStore from '../store/useStudentStore.js'

/**
 * Send a message to the AI chat backend.
 *
 * @param {string} query    - The user's question or message
 * @param {object} [extras] - Optional overrides for category, cutoff, district, branch
 * @returns {Promise<{answer: string, sources: string[], strategy_alert: string}>}
 */
export async function sendChatMessage(query, extras = {}) {
  const { sessionId, student, computedCutoff } = useStudentStore.getState()

  const payload = {
    query: query.trim(),
    session_id: sessionId || 'default',
    category: student.community || 'OC',  // backend expects OC|BC|MBC|SC|SCA|ST
    cutoff: computedCutoff || 0,
    district: student.district || null,
    branch: null,
    ...extras,                             // caller can override any field
  }

  return apiPost('/chat', payload)
}

/**
 * Response shape returned by /chat:
 * {
 *   answer:         string    — AI-generated response text
 *   sources:        string[]  — list of source citations (may be empty)
 *   strategy_alert: string    — optional strategy tip based on cutoff (may be '')
 * }
 */
