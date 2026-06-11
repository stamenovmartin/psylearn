// Shared display helpers, labels and colors used across the whole frontend.
// Centralizing these guarantees every page/chart renders the same names & colors.
import { getLang } from './i18n.jsx'
import { MK } from './mkContent.js'

const isMk = () => getLang() === 'mk'

// --- generic formatting ---------------------------------------------------- //
export function prettyLabel(key = '') {
  return String(key)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function formatScore(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '–'
  return Number(n).toFixed(2)
}

// Standard normal CDF (Abramowitz–Stegun erf approximation) — used to turn a
// score into a percentile against real-world norms.
export function normalCdf(z) {
  const sign = z < 0 ? -1 : 1
  const x = Math.abs(z) / Math.SQRT2
  const t = 1 / (1 + 0.3275911 * x)
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-x * x))
  return 0.5 * (1 + sign * y)
}

export function worldPercentile(score, mean, sd) {
  if (!sd) return 50
  return Math.round(normalCdf((Number(score) - Number(mean)) / Number(sd)) * 100)
}

// --- friendly names for the 16 sub-scores ---------------------------------- //
export const SCORE_LABELS = {
  intrinsic_motivation_score: 'Intrinsic motivation',
  extrinsic_motivation_score: 'Extrinsic motivation',
  pressure_motivation_score: 'Pressure motivation',
  learning_goal_score: 'Learning goal',
  performance_goal_score: 'Performance goal',
  avoidance_goal_score: 'Avoidance goal',
  deep_learning_score: 'Deep learning',
  surface_learning_score: 'Surface learning',
  last_minute_score: 'Last-minute studying',
  memory_visual_score: 'Visual / spatial memory',
  memory_association_score: 'Association memory',
  memory_repetition_score: 'Repetition memory',
  social_energy_score: 'Social energy',
  introversion_score: 'Introversion',
  stress_score: 'Stress',
  organization_score: 'Organization',
}

export function scoreLabel(key) {
  if (isMk() && MK.scoreLabels && MK.scoreLabels[key]) return MK.scoreLabels[key]
  return SCORE_LABELS[key] || prettyLabel(key.replace(/_score$/, ''))
}

// Language-aware title for a prediction target (e.g. "Stress risk").
export function predictionTitle(target) {
  if (isMk() && MK.predictionTitles && MK.predictionTitles[target]) return MK.predictionTitles[target]
  return PREDICTION_TITLES[target] || prettyLabel(target)
}

// Language-aware title for a memory method.
export function memoryMethodTitle(method) {
  if (isMk() && MK.memoryTitles && MK.memoryTitles[method]) return MK.memoryTitles[method]
  return MEMORY_METHOD_TITLES[method] || prettyLabel(method)
}

// Language-aware explanation for a predicted value (falls back to backend text).
export function explanationText(target, value, fallback) {
  if (isMk() && MK.explanations && MK.explanations[target] && MK.explanations[target][value]) {
    return MK.explanations[target][value]
  }
  return fallback
}

// Language-aware recommendation text (matched to the backend's English string).
export function recommendationText(en) {
  if (isMk() && MK.recs && MK.recs[en]) return MK.recs[en]
  return en
}

// --- the 6 prediction targets --------------------------------------------- //
export const PREDICTION_TITLES = {
  motivation_type: 'Motivation type',
  learning_orientation: 'Learning orientation',
  study_style: 'Study style',
  recommended_memory_method: 'Recommended memory method',
  personality_profile: 'Personality profile',
  stress_risk: 'Stress risk',
}

export const PREDICTION_ICONS = {
  motivation_type: '🔥',
  learning_orientation: '🎯',
  study_style: '📚',
  recommended_memory_method: '🧠',
  personality_profile: '🧩',
  stress_risk: '🌡️',
}

// Display order for the result cards.
export const PREDICTION_ORDER = [
  'motivation_type',
  'learning_orientation',
  'study_style',
  'recommended_memory_method',
  'personality_profile',
  'stress_risk',
]

export const MEMORY_METHOD_TITLES = {
  method_of_loci: 'Method of Loci (Memory Palace)',
  association_method: 'Association Method',
  story_method: 'Story Method',
  first_letter_method: 'First-Letter Method',
  repetition: 'Spaced Repetition',
  teach_someone_else: 'Teach Someone Else',
}

const VALUE_LABELS = {
  motivation_type: {
    intrinsic: 'Intrinsic',
    extrinsic: 'Extrinsic',
    mixed: 'Mixed',
    pressure_based: 'Pressure-based',
  },
  learning_orientation: {
    learning_goal_oriented: 'Learning-goal oriented',
    performance_goal_oriented: 'Performance-goal oriented',
    avoidance_oriented: 'Avoidance oriented',
    mixed_orientation: 'Mixed orientation',
  },
  study_style: {
    deep_learner: 'Deep learner',
    surface_learner: 'Surface learner',
    last_minute_learner: 'Last-minute learner',
    mixed_learner: 'Mixed learner',
  },
  recommended_memory_method: MEMORY_METHOD_TITLES,
  personality_profile: {
    introvert: 'Introvert',
    ambivert: 'Ambivert',
    extrovert: 'Extrovert',
  },
  stress_risk: { low: 'Low', moderate: 'Moderate', high: 'High' },
}

// Friendly label for a predicted value within a target.
export function valueLabel(target, value) {
  if (isMk() && MK.valueLabels && MK.valueLabels[target] && MK.valueLabels[target][value]) {
    return MK.valueLabels[target][value]
  }
  return (VALUE_LABELS[target] && VALUE_LABELS[target][value]) || prettyLabel(value)
}

// --- colors ---------------------------------------------------------------- //
// Scholarly, muted palette used by all charts (navy + warm secondaries).
export const CHART_COLORS = [
  '#1e3a5f', // navy
  '#b8863b', // ochre
  '#4a7a6f', // muted teal
  '#a8553f', // clay
  '#5d7089', // slate
  '#7e8c5a', // sage
  '#7a4b63', // plum
  '#c0a16b', // warm taupe
]

export const SECTION_COLORS = {
  A: '#1e3a5f', // navy
  B: '#4a7a6f', // teal
  C: '#b8863b', // ochre
  D: '#a8553f', // clay
  E: '#5d7089', // slate
  F: '#7a4b63', // plum (scenarios)
}

export const STRESS_COLORS = {
  low: '#5f7d52', // sage
  moderate: '#b8863b', // ochre
  high: '#a8453a', // clay-red
}

// Accent color per prediction target (used on Results cards).
export const TARGET_COLORS = {
  motivation_type: '#1e3a5f',
  learning_orientation: '#4a7a6f',
  study_style: '#b8863b',
  recommended_memory_method: '#7a4b63',
  personality_profile: '#5d7089',
  stress_risk: '#a8553f',
}

// Sentiment colors for the interactive Likert scale (1 disagree → 5 agree).
export const SENTIMENT_COLORS = ['#a8553f', '#c0884f', '#9a8f78', '#5d8a72', '#4a7a6f']

export const STRESS_LEVEL_VALUE = { low: 1, moderate: 2, high: 3 }

// --- result persistence (sessionStorage, anonymous) ------------------------ //
const RESULT_KEY = 'psylearn_result'

export function saveResult(result) {
  try {
    sessionStorage.setItem(RESULT_KEY, JSON.stringify(result))
  } catch {
    /* ignore storage errors */
  }
}

export function loadResult() {
  try {
    const raw = sessionStorage.getItem(RESULT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearResult() {
  try {
    sessionStorage.removeItem(RESULT_KEY)
  } catch {
    /* ignore */
  }
}

// --- survey answer autosave (localStorage, anonymous, resume support) ------- //
const ANSWERS_KEY = 'psylearn_answers'

export function saveAnswers(answers) {
  try {
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers))
  } catch {
    /* ignore */
  }
}

export function loadAnswers() {
  try {
    const raw = localStorage.getItem(ANSWERS_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function clearAnswers() {
  try {
    localStorage.removeItem(ANSWERS_KEY)
  } catch {
    /* ignore */
  }
}

// --- local result history (localStorage, anonymous) ------------------------ //
const HISTORY_KEY = 'psylearn_history'
const HISTORY_MAX = 10

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function pushHistory(entry) {
  try {
    const history = loadHistory()
    history.unshift(entry)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_MAX)))
  } catch {
    /* ignore */
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch {
    /* ignore */
  }
}
