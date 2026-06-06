/**
 * choiceService.js — Full CRUD for the student's shortlist / choice list.
 *
 * CRITICAL PATTERN (validated against backend main.py lines 1213–1269):
 *   POST /choice/add     → session_id is a QUERY PARAM; college_data is the JSON BODY
 *   POST /choice/remove  → session_id is a QUERY PARAM; college_data is the JSON BODY
 *   POST /choice/clear   → session_id is a QUERY PARAM; no body
 *   POST /choice/reorder → session_id, direction, index are ALL QUERY PARAMS; no body
 *   POST /choice/notes   → session_id, index, notes are ALL QUERY PARAMS; no body
 *   GET  /choice/{id}    → session_id is a PATH PARAM
 *
 * All functions read sessionId directly from Zustand (.getState()) so callers
 * do not need to pass it manually.
 */

import { apiGet, apiPost } from './api.js'
import useStudentStore from '../store/useStudentStore.js'

/** @returns {string} The current session ID from Zustand */
function getSessionId() {
  return useStudentStore.getState().sessionId || 'default'
}

/**
 * College data shape accepted by /choice/add and /choice/remove.
 * @typedef {Object} CollegeData
 * @property {string|number} code     - College code (e.g. "1234")
 * @property {string}        branch   - Branch name (e.g. "Computer Science and Engineering")
 * @property {string}        [name]   - College name (stored but not used for dedup)
 * @property {string}        [district]
 * @property {string}        [cutoff] - Formatted string e.g. "185.0 - 192.0"
 * @property {string}        [tier]   - "Safe" | "Moderate" | "Dream"
 * @property {string}        [notes]  - Auto-added as "" if missing by backend
 */

/**
 * Fetch the student's current shortlist from the backend.
 * @returns {Promise<CollegeData[]>}
 */
export async function getChoices() {
  const sessionId = getSessionId()
  return apiGet(`/choice/${sessionId}`)
}

/**
 * Add a college to the student's shortlist.
 * Duplicate detection is handled server-side (same code + branch = skip).
 * @param {CollegeData} collegeData
 * @returns {Promise<{status: string, count: number}>}
 */
export async function addChoice(collegeData) {
  const sessionId = getSessionId()
  // session_id → query param | collegeData → JSON body
  return apiPost('/choice/add', collegeData, { session_id: sessionId })
}

/**
 * Remove a college from the student's shortlist.
 * Backend matches by (code + branch) — only these two fields are required.
 * @param {CollegeData} collegeData - Must include `code` and `branch`
 * @returns {Promise<{status: string, count: number}>}
 */
export async function removeChoice(collegeData) {
  const sessionId = getSessionId()
  // session_id → query param | {code, branch} → JSON body
  return apiPost('/choice/remove', { code: collegeData.code, branch: collegeData.branch }, { session_id: sessionId })
}

/**
 * Clear all choices for the current session.
 * @returns {Promise<{status: string, count: number}>}
 */
export async function clearChoices() {
  const sessionId = getSessionId()
  return apiPost('/choice/clear', {}, { session_id: sessionId })
}

/**
 * Move a choice item up or down in the ordered list.
 * @param {'up'|'down'} direction
 * @param {number}      index     - Zero-based index of the item to move
 * @returns {Promise<{status: string, choices: CollegeData[]}>}
 */
export async function reorderChoice(direction, index) {
  const sessionId = getSessionId()
  // All three params are query params; no request body
  return apiPost('/choice/reorder', {}, { session_id: sessionId, direction, index })
}

/**
 * Update the notes string on a specific shortlist entry.
 * Called on input blur (after user finishes typing).
 * @param {number} index  - Zero-based index of the item in the list
 * @param {string} notes  - New notes text
 * @returns {Promise<{status: string, choices: CollegeData[]}>}
 */
export async function updateChoiceNotes(index, notes) {
  const sessionId = getSessionId()
  // All three params are query params; no request body
  return apiPost('/choice/notes', {}, { session_id: sessionId, index, notes: encodeURIComponent(notes) })
}
