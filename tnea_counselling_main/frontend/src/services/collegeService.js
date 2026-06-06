/**
 * collegeService.js — All college-directory API calls.
 *
 * Endpoints covered:
 *   GET /directory       → Paginated college list with search + filters
 *   GET /metadata        → All districts + branches for dropdown population
 *   GET /college/{code}  → Full college profile: hostel, transport, courses, cutoffs
 *   GET /college/search  → Quick text search (name / district / branch)
 *   GET /tfc             → TFC facilitation center list
 *
 * Response shapes are documented in the blueprint.
 * This module also caches /metadata at the module level so it is fetched
 * only once per app session.
 */

import { apiGet } from './api.js'

/** Module-level metadata cache — districts and branches don't change at runtime */
let _metadataCache = null

/**
 * Fetch paginated college directory.
 *
 * Response:
 * {
 *   total:    number,
 *   page:     number,
 *   limit:    number,
 *   pages:    number,
 *   colleges: Array<{
 *     code:     string,        // 4-digit zero-padded
 *     name:     string,
 *     district: string,
 *     branches: Array<{ name: string, min: number, max: number }>
 *   }>
 * }
 *
 * @param {object} params
 * @param {string}   [params.search]    - Free text search (name / district / code)
 * @param {string[]} [params.districts] - Filter by one or more districts
 * @param {string[]} [params.branches]  - Filter by one or more branch names
 * @param {number}   [params.page]      - Page number (1-indexed, default 1)
 * @param {number}   [params.limit]     - Items per page (default 50)
 */
export async function fetchDirectory(params = {}) {
  return apiGet('/directory', {
    search: params.search || undefined,
    districts: params.districts || undefined,
    branches: params.branches || undefined,
    institution_type: params.institution_type || undefined,
    page: params.page || 1,
    limit: params.limit || 50,
  })
}

/**
 * Fetch all unique districts and branches for dropdown filters.
 * Result is cached in memory after the first call.
 *
 * Response: { districts: string[], branches: string[] }
 */
export async function fetchMetadata() {
  if (_metadataCache) return _metadataCache
  _metadataCache = await apiGet('/metadata')
  return _metadataCache
}

/** Clear the metadata cache (useful after data updates) */
export function clearMetadataCache() {
  _metadataCache = null
}

/**
 * Fetch full college profile by code.
 * Backend zero-pads the code to 4 digits automatically.
 *
 * Response: full College object including contact, hostel, transport, courses, cutoffs
 *
 * @param {string|number} code - College code
 */
export async function fetchCollegeProfile(code) {
  return apiGet(`/college/${code}`)
}

export async function fetchCollegeInsights(code) {
  return apiGet(`/college/${code}/insights`)
}

/**
 * Quick search colleges by name, district, or branch.
 *
 * Response: Array<{ college_code, college_name, district, autonomous_status, website }>
 *
 * @param {object} params
 * @param {string} [params.name]     - College name fragment
 * @param {string} [params.district] - District filter
 * @param {string} [params.branch]   - Branch name or code
 */
export async function searchColleges(params = {}) {
  return apiGet('/college/search', {
    name: params.name || undefined,
    district: params.district || undefined,
    branch: params.branch || undefined,
  })
}

/**
 * Fetch all TFC (Tamil Nadu Facilitation Centre) locations.
 * Response: Array of TFCCenter objects
 */
export async function fetchTfcCenters() {
  return apiGet('/tfc')
}
