/**
 * recommendationService.js — College recommendations and cutoff calculation.
 *
 * REPLACES the previous mock-only implementation.
 *
 * Endpoints covered:
 *   POST /recommend        → College recommendations sorted by proximity to student cutoff
 *   POST /calculate-cutoff → Compute TNEA cutoff from marks + eligibility analysis
 *
 * TIER HANDLING (Correction 5 from validation report):
 *   /recommend       → exact values: "Safe" | "Moderate" | "Dream"
 *   /calculate-cutoff → prefixed values: "Safe (Tier-1 Elite)" | "Moderate (Tier-2 Mid)" | "Dream (Tier-3 Aspirational)"
 *   Always use startsWith() — NEVER use === on tier strings.
 *
 * All functions read sessionId, community, computedCutoff from Zustand
 * directly so callers do not need to pass them.
 */

import { apiPost } from './api.js'
import useStudentStore from '../store/useStudentStore.js'

/**
 * Recommendation item returned by /recommend.
 * @typedef {Object} Recommendation
 * @property {number}  college_code
 * @property {string}  college_name
 * @property {string}  branch_name
 * @property {string}  district
 * @property {string}  cutoff         - Formatted: "185.0 - 192.0" or "190.0"
 * @property {object}  history        - { "2021": number|null, ..., "2025": number|null }
 * @property {string}  reason         - Human-readable explanation
 * @property {string}  tier           - EXACTLY "Safe" | "Moderate" | "Dream"
 * @property {string}  label          - "High Probability" | "Good Match" | "Aspirational Reach"
 * @property {number}  proximity      - |student_cutoff - college_cutoff| — lower = better
 */

/**
 * Fetch college recommendations from the backend.
 * Reads student context from Zustand if not overridden.
 *
 * @param {object} [overrides] - Optional overrides: { cutoff, category, district, districts, branch, branches }
 * @returns {Promise<Recommendation[]>} - Sorted by proximity (closest match first), max 50
 */
export async function fetchRecommendations(overrides = {}) {
  const { sessionId, student, computedCutoff } = useStudentStore.getState()

  const payload = {
    session_id: sessionId || 'default',
    cutoff: computedCutoff || 0,
    category: student.community || 'OC',
    district: student.district || null,
    branch: null,
    districts: null,
    branches: null,
    ...overrides,
  }

  return apiPost('/recommend', payload)
}

/**
 * Helper: classify a tier string safely using startsWith (Correction 5).
 * Works for BOTH /recommend and /calculate-cutoff tier formats.
 *
 * @param {string} tier - e.g. "Safe" or "Safe (Tier-1 Elite)"
 * @returns {'safe'|'moderate'|'dream'|'unknown'}
 */
export function parseTier(tier = '') {
  if (tier.startsWith('Safe'))     return 'safe'
  if (tier.startsWith('Moderate')) return 'moderate'
  if (tier.startsWith('Dream'))    return 'dream'
  return 'unknown'
}

/**
 * Calculate TNEA cutoff from raw subject marks.
 *
 * Formula (backend): maths + (physics / 2) + (chemistry / 2) → clamped 0–200
 *
 * Response:
 * {
 *   cutoff:                 number   — Computed TNEA cutoff (0–200)
 *   eligibility_tier:       string   — "Safe (Tier-1 Elite)" | "Moderate (Tier-2 Mid)" | "Dream (Tier-3 Aspirational)"
 *   recommendation_summary: string   — Human-readable summary with markdown bold
 *   suggested_branches:     string[] — 4 suggested branch names
 * }
 *
 * NOTE: eligibility_tier uses the "Type (Description)" format — always parse with parseTier().
 *
 * @param {object} params
 * @param {number} params.maths
 * @param {number} params.physics
 * @param {number} params.chemistry
 * @param {string} [params.category]        - Defaults to student.community
 * @param {string} [params.district]        - Defaults to student.district
 * @param {string} [params.preferred_branch] - "all" if not specified
 */
export async function calculateCutoff(params = {}) {
  const { student } = useStudentStore.getState()

  const payload = {
    maths: parseFloat(params.maths) || 0,
    physics: parseFloat(params.physics) || 0,
    chemistry: parseFloat(params.chemistry) || 0,
    category: params.category || student.community || 'OC',
    district: params.district || student.district || 'all',
    preferred_branch: params.preferred_branch || 'all',
  }

  return apiPost('/calculate-cutoff', payload)
}
