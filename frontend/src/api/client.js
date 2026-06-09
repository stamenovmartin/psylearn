// Centralized API client for the PsyLearn Profiler backend.
// The base URL is configurable via VITE_API_URL (see .env.example).

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

/**
 * Small fetch wrapper with consistent JSON handling and error messages.
 */
async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch (networkError) {
    throw new Error(
      `Cannot reach the API at ${BASE_URL}. Is the backend running? (${networkError.message})`,
    )
  }

  let data = null
  const text = await response.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    const detail =
      (data && (data.detail || data.message)) ||
      `Request failed with status ${response.status}`
    const message = Array.isArray(detail)
      ? detail.map((d) => d.msg || JSON.stringify(d)).join('; ')
      : detail
    throw new Error(message)
  }

  return data
}

export const api = {
  baseUrl: BASE_URL,
  getHealth: () => request('/health'),
  getQuestions: () => request('/questions'),
  predict: (answers) =>
    request('/predict', { method: 'POST', body: JSON.stringify({ answers }) }),
  getAnalyticsSummary: () => request('/analytics/summary'),
  getAnalyticsDistributions: () => request('/analytics/distributions'),
  getCorrelations: () => request('/analytics/correlations'),
  getModelInsights: () => request('/model/insights'),
  getWorldBenchmark: () => request('/benchmark/world'),
  sendFeedback: (payload) =>
    request('/feedback', { method: 'POST', body: JSON.stringify(payload) }),
  getLabels: () => request('/meta/labels'),
}

export default api
