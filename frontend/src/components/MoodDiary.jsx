// Mood diary — log today's mood (1-5) with optional note + tags, see your mood
// over time. Stored locally. Logging counts toward the wellness streak. Bilingual.
import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { SENTIMENT_COLORS } from '../utils.js'
import { bumpWellnessStreak } from '../streaks.js'
import { useLang } from '../i18n.jsx'

const MOOD_KEY = 'psylearn_mood'
const MOODS = [
  { v: 1, en: 'Rough', mk: 'Лошо' },
  { v: 2, en: 'Low', mk: 'Слабо' },
  { v: 3, en: 'Okay', mk: 'Во ред' },
  { v: 4, en: 'Good', mk: 'Добро' },
  { v: 5, en: 'Great', mk: 'Одлично' },
]
const TAGS = [
  { en: 'Calm', mk: 'Смирен' },
  { en: 'Happy', mk: 'Среќен' },
  { en: 'Motivated', mk: 'Мотивиран' },
  { en: 'Focused', mk: 'Фокусиран' },
  { en: 'Tired', mk: 'Уморен' },
  { en: 'Stressed', mk: 'Под стрес' },
  { en: 'Anxious', mk: 'Анксиозен' },
  { en: 'Lonely', mk: 'Осамен' },
]

function dstr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function loadEntries() {
  try {
    const raw = localStorage.getItem(MOOD_KEY)
    const p = raw ? JSON.parse(raw) : []
    return Array.isArray(p) ? p : []
  } catch {
    return []
  }
}

export default function MoodDiary() {
  const { lang, t } = useLang()
  const moodName = (v) => {
    const m = MOODS.find((x) => x.v === v)
    return m ? (lang === 'mk' ? m.mk : m.en) : v
  }
  const tagName = (en) => {
    const tg = TAGS.find((x) => x.en === en)
    return tg ? (lang === 'mk' ? tg.mk : tg.en) : en
  }

  const [entries, setEntries] = useState(loadEntries)
  const today = dstr(new Date())
  const todays = entries.find((e) => e.date === today)

  const [mood, setMood] = useState(todays ? todays.mood : null)
  const [note, setNote] = useState(todays ? todays.note || '' : '')
  const [tags, setTags] = useState(todays ? todays.tags || [] : [])
  const [saved, setSaved] = useState(false)

  function toggleTag(tg) {
    setTags((prev) => (prev.includes(tg) ? prev.filter((x) => x !== tg) : [...prev, tg]))
  }

  function save() {
    if (!mood) return
    const entry = { date: today, mood, note: note.trim(), tags }
    const next = [...entries.filter((e) => e.date !== today), entry].sort((a, b) => (a.date < b.date ? -1 : 1))
    setEntries(next)
    try {
      localStorage.setItem(MOOD_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
    bumpWellnessStreak()
    setSaved(true)
  }

  const chartData = entries.slice(-14).map((e) => ({ name: e.date.slice(5).replace('-', '/'), mood: e.mood }))
  const recent = [...entries].reverse().slice(0, 5)

  return (
    <div className="stack" style={{ gap: '18px' }}>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>{t('How are you feeling today?', 'Како се чувствуваш денес?')}</h3>
        <div className="mood-scale">
          {MOODS.map((m) => {
            const c = SENTIMENT_COLORS[m.v - 1]
            const on = mood === m.v
            return (
              <button
                type="button"
                key={m.v}
                className="mood-btn"
                style={on ? { background: c, borderColor: c, color: '#fff' } : { '--opt': c }}
                onClick={() => { setMood(m.v); setSaved(false) }}
              >
                <span className="mood-num">{m.v}</span>
                <span className="mood-lbl" style={on ? { color: 'rgba(255,255,255,0.9)' } : undefined}>
                  {moodName(m.v)}
                </span>
              </button>
            )
          })}
        </div>

        <p className="eyebrow" style={{ margin: '18px 0 8px' }}>{t('Tags (optional)', 'Ознаки (по избор)')}</p>
        <div className="row" style={{ gap: '8px' }}>
          {TAGS.map((tg) => (
            <button
              type="button"
              key={tg.en}
              className={`tag-chip${tags.includes(tg.en) ? ' on' : ''}`}
              onClick={() => { toggleTag(tg.en); setSaved(false) }}
            >
              {tagName(tg.en)}
            </button>
          ))}
        </div>

        <textarea
          className="trainer-input"
          style={{ marginTop: '14px' }}
          rows={2}
          placeholder={t('A line about your day (optional)…', 'Реченица за твојот ден (по избор)…')}
          value={note}
          onChange={(e) => { setNote(e.target.value); setSaved(false) }}
        />

        <div className="row" style={{ marginTop: '14px' }}>
          <button type="button" className="btn btn-primary" onClick={save} disabled={!mood}>
            {todays ? t('Update today', 'Ажурирај денес') : t('Save today', 'Зачувај денес')}
          </button>
          {saved && <span className="learned-tag">✓ {t('Saved — see you tomorrow!', 'Зачувано — се гледаме утре!')}</span>}
        </div>
      </div>

      {chartData.length > 1 && (
        <div className="chart-card">
          <div className="chart-title">{t('Your mood over time', 'Твоето расположение низ времето')}</div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 12, bottom: 4, left: -18 }}>
                <defs>
                  <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3a9e8c" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#3a9e8c" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="mood" stroke="#3a9e8c" strokeWidth={2} fill="url(#moodFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {recent.length > 0 && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>{t('Recent entries', 'Скорешни записи')}</h3>
          <div className="stack" style={{ gap: '10px' }}>
            {recent.map((e) => {
              const c = SENTIMENT_COLORS[e.mood - 1]
              return (
                <div className="spread" key={e.date} style={{ borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
                  <div className="row" style={{ gap: '10px' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: c, display: 'inline-block' }} />
                    <strong>{moodName(e.mood)}</strong>
                    <span className="muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{e.date}</span>
                    {e.tags?.length > 0 && (
                      <span className="muted" style={{ fontSize: '0.82rem' }}>· {e.tags.map(tagName).join(', ')}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
