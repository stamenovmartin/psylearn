// Shared streak helpers (Learn daily streak + Trainer streak + Wellness streak),
// stored locally. Components dispatch/listen to STREAK_EVENT so the navbar updates.
const LEARN_KEY = 'psylearn_learn'
const TRAINER_KEY = 'psylearn_trainer_streak'
const WELLNESS_KEY = 'psylearn_wellness_streak'
export const STREAK_EVENT = 'psylearn:streak'

function dstr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function today() {
  return dstr(new Date())
}
function yesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return dstr(d)
}
function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function notifyStreak() {
  try {
    window.dispatchEvent(new Event(STREAK_EVENT))
  } catch {
    /* ignore */
  }
}

// Generic daily streak bump (today/yesterday logic). Returns the new streak.
function bumpDaily(key) {
  const v = read(key) || { streak: 0, lastDate: null }
  const t = today()
  let streak = v.streak || 0
  if (v.lastDate !== t) {
    streak = v.lastDate === yesterday() ? streak + 1 : 1
  } else if (streak === 0) {
    streak = 1
  }
  const next = { streak, lastDate: t }
  try {
    localStorage.setItem(key, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  notifyStreak()
  return streak
}

export function getLearnStreak() {
  const v = read(LEARN_KEY)
  return (v && v.streak) || 0
}
export function getTrainerStreak() {
  const v = read(TRAINER_KEY)
  return (v && v.streak) || 0
}
export function getWellnessStreak() {
  const v = read(WELLNESS_KEY)
  return (v && v.streak) || 0
}

export function bumpTrainerStreak() {
  return bumpDaily(TRAINER_KEY)
}
export function bumpWellnessStreak() {
  return bumpDaily(WELLNESS_KEY)
}
