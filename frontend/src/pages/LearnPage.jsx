// Learn — a connected knowledge base with DAILY learning: a concept of the day,
// a learning streak, progress tracking, plus the full concept + technique library.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LEARN_CONCEPTS } from '../learnContent.js'
import { TECHNIQUES } from '../techniques.js'
import { OPTION_ART, PREDICTION_ART } from '../questionArt.jsx'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'
import { notifyStreak } from '../streaks.js'
import { useLang } from '../i18n.jsx'
import { MK } from '../mkContent.js'

const CATEGORY_COLORS = {
  Motivation: '#1e3a5f',
  'Learning goals': '#4a7a6f',
  'Study style': '#b8863b',
  Memory: '#a8553f',
  'Personality & emotions': '#5d7089',
  'Self & metacognition': '#7a4b63',
}

const TARGET_GROUPS = {
  stress_risk: 'For stress & calm',
  personality_profile: 'For your personality',
  study_style: 'For your study style',
  learning_orientation: 'For goals & mindset',
  motivation_type: 'For motivation',
  general: 'Works for everyone',
}

const LEARN_KEY = 'psylearn_learn'

function colorFor(category) {
  return CATEGORY_COLORS[category] || '#1e3a5f'
}
function dstr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function todayStr() {
  return dstr(new Date())
}
function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return dstr(d)
}
function loadLearn() {
  try {
    const raw = localStorage.getItem(LEARN_KEY)
    const p = raw ? JSON.parse(raw) : null
    if (p && typeof p === 'object') return { streak: 0, lastLearnedDate: null, learnedIds: [], ...p }
  } catch {
    /* ignore */
  }
  return { streak: 0, lastLearnedDate: null, learnedIds: [] }
}

function ConceptCard({ concept, learned, onMark }) {
  const [open, setOpen] = useState(false)
  const { lang, t } = useLang()
  const accent = colorFor(concept.category)
  const L = lang === 'mk' ? MK.learn[concept.id] || {} : {}
  const cTitle = L.title || concept.title
  const cCategory = L.category || concept.category
  const cSummary = L.summary || concept.summary
  const cKeyPoints = L.keyPoints || concept.keyPoints
  const cTechniques = L.techniques || concept.techniques
  const cExample = L.example || concept.example
  const cRelevance = L.relevance || concept.relevance
  return (
    <div className="card learn-card">
      <div className="learn-head">
        <span
          className="concept-icon draw"
          style={{ color: accent, background: `${accent}14`, borderColor: `${accent}33` }}
        >
          {OPTION_ART[concept.icon] || OPTION_ART.bulb}
        </span>
        <div>
          <span className="result-target" style={{ color: accent }}>{cCategory}</span>
          <h3 style={{ margin: '4px 0 0' }}>{cTitle}</h3>
        </div>
      </div>
      <p className="muted" style={{ marginBottom: '12px' }}>{cSummary}</p>

      {open && (
        <div className="learn-detail">
          {cKeyPoints?.length > 0 && (
            <>
              <p className="eyebrow">{t('Key ideas', 'Клучни идеи')}</p>
              <ul className="rec-list">
                {cKeyPoints.map((k, i) => (
                  <li className="rec-item" key={i}>
                    <span className="rec-bullet" aria-hidden="true">&mdash;</span>
                    {k}
                  </li>
                ))}
              </ul>
            </>
          )}
          {cTechniques?.length > 0 && (
            <>
              <p className="eyebrow" style={{ marginTop: '14px' }}>{t('How to use it', 'Како да го користиш')}</p>
              <ul className="rec-list">
                {cTechniques.map((t, i) => (
                  <li className="rec-item" key={i}>
                    <span className="rec-bullet" aria-hidden="true" style={{ color: accent }}>→</span>
                    {t}
                  </li>
                ))}
              </ul>
            </>
          )}
          {cExample && (
            <div className="learn-example" style={{ borderColor: `${accent}55` }}>
              <span className="eyebrow" style={{ color: accent }}>{t('Example', 'Пример')}</span>
              <p style={{ margin: '4px 0 0' }}>{cExample}</p>
            </div>
          )}
          {cRelevance && (
            <p className="muted" style={{ marginTop: '12px', fontSize: '0.9rem' }}>
              <strong>{t('Why it matters:', 'Зошто е важно:')}</strong> {cRelevance}
            </p>
          )}
        </div>
      )}

      <div className="spread" style={{ marginTop: 'auto', paddingTop: '8px' }}>
        <button type="button" className="btn btn-ghost" style={{ paddingLeft: 0 }} onClick={() => setOpen((v) => !v)}>
          {open ? `${t('Show less', 'Покажи помалку')} ↑` : `${t('Read more', 'Прочитај повеќе')} ↓`}
        </button>
        {learned ? (
          <span className="learned-tag">✓ {t('Learned', 'Научено')}</span>
        ) : (
          <button type="button" className="btn btn-ghost btn-learned" onClick={() => onMark(concept.id)}>
            {t('Mark as learned', 'Означи како научено')}
          </button>
        )}
      </div>
    </div>
  )
}

function TechniqueCard({ tech }) {
  const { lang, t } = useLang()
  const M = lang === 'mk' ? MK.techniques[tech.id] || {} : {}
  const steps = M.steps || tech.steps
  return (
    <div className="card tech-card">
      <div className="tech-head">
        <span className="tech-icon draw">{OPTION_ART[tech.icon] || OPTION_ART.bulb}</span>
        <h4 style={{ margin: 0 }}>{M.title || tech.title}</h4>
      </div>
      <ol className="tech-steps">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      <p className="muted" style={{ margin: '6px 0 0', fontSize: '0.86rem' }}>
        <strong>{t('Why:', 'Зошто:')}</strong> {M.why || tech.why}
      </p>
    </div>
  )
}

const GROUP_MK = {
  stress_risk: 'За стрес и смирување',
  personality_profile: 'За твојата личност',
  study_style: 'За твојот стил на учење',
  learning_orientation: 'За цели и начин на размислување',
  motivation_type: 'За мотивација',
  general: 'Корисно за секого',
}
const CATEGORY_MK = {
  Motivation: 'Мотивација',
  'Learning goals': 'Цели на учењето',
  'Study style': 'Стил на учење',
  Memory: 'Меморија',
  'Personality & emotions': 'Личност и емоции',
  'Self & metacognition': 'Себе и метакогниција',
}

export default function LearnPage() {
  const { lang, t } = useLang()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [learn, setLearn] = useState(loadLearn)

  const learnedSet = new Set(learn.learnedIds)
  const total = LEARN_CONCEPTS.length
  const learnedCount = learn.learnedIds.filter((id) => LEARN_CONCEPTS.some((c) => c.id === id)).length

  // Deterministic concept of the day.
  const dayIndex = Math.floor(Date.now() / 86400000) % total
  const conceptOfDay = LEARN_CONCEPTS[dayIndex]

  function markLearned(id) {
    setLearn((prev) => {
      const today = todayStr()
      const learnedIds = prev.learnedIds.includes(id) ? prev.learnedIds : [...prev.learnedIds, id]
      let streak = prev.streak || 0
      let lastLearnedDate = prev.lastLearnedDate
      if (lastLearnedDate !== today) {
        streak = lastLearnedDate === yesterdayStr() ? streak + 1 : 1
        lastLearnedDate = today
      } else if (streak === 0) {
        streak = 1
      }
      const next = { streak, lastLearnedDate, learnedIds }
      try {
        localStorage.setItem(LEARN_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      notifyStreak()
      return next
    })
  }

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(LEARN_CONCEPTS.map((c) => c.category)))],
    [],
  )
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LEARN_CONCEPTS.filter((c) => {
      if (category !== 'All' && c.category !== category) return false
      if (!q) return true
      return (
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        (c.keyPoints || []).join(' ').toLowerCase().includes(q)
      )
    })
  }, [query, category])

  const techByGroup = useMemo(() => {
    const groups = {}
    TECHNIQUES.forEach((t) => {
      ;(groups[t.target] = groups[t.target] || []).push(t)
    })
    return groups
  }, [])

  const dayDone = learnedSet.has(conceptOfDay.id)
  const dayAccent = colorFor(conceptOfDay.category)
  const dayL = lang === 'mk' ? MK.learn[conceptOfDay.id] || {} : {}
  const catLabel = (c) => (c === 'All' ? t('All', 'Сите') : lang === 'mk' ? CATEGORY_MK[c] || c : c)

  return (
    <div className="container page">
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="eyebrow">{t('Knowledge base', 'База на знаење')}</p>
        <h1 style={{ maxWidth: '20ch' }}>{t('Learn a little every day', 'Учи по малку секој ден')}</h1>
        <p className="lead" style={{ maxWidth: '62ch' }}>
          {t(
            'One concept a day beats cramming it all at once. Build a learning streak, then dip into the full library and technique toolbox whenever you like.',
            'Еден концепт на ден е подобро од сè одеднаш. Изгради низа на учење, па нурни во целата библиотека и алатки кога сакаш.',
          )}
        </p>
      </header>

      {/* Daily learning + streak */}
      <div className="daily-panel">
        <div className="streak-row">
          <div className="streak">
            <span className="streak-flame draw">{PREDICTION_ART.motivation_type}</span>
            <div>
              <div className="streak-num">{learn.streak}</div>
              <div className="streak-label">{t('day streak', 'дена низа')}</div>
            </div>
          </div>
          <div className="streak-progress">
            <div className="progress-meta">
              <span>{t('Concepts learned', 'Научени концепти')}</span>
              <span>{learnedCount} / {total}</span>
            </div>
            <div className="meter">
              <div className="meter-fill" style={{ width: `${(learnedCount / total) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="learn-detail" style={{ marginTop: '20px' }}>
          <p className="eyebrow" style={{ color: dayAccent }}>{t('Concept of the day', 'Концепт на денот')}</p>
          <div className="learn-head" style={{ marginTop: '6px' }}>
            <span
              className="concept-icon draw"
              style={{ color: dayAccent, background: `${dayAccent}14`, borderColor: `${dayAccent}33` }}
            >
              {OPTION_ART[conceptOfDay.icon] || OPTION_ART.bulb}
            </span>
            <div>
              <h3 style={{ margin: 0 }}>{dayL.title || conceptOfDay.title}</h3>
              <p className="muted" style={{ margin: '6px 0 0' }}>{dayL.summary || conceptOfDay.summary}</p>
            </div>
          </div>
          <div className="row" style={{ marginTop: '14px' }}>
            {dayDone ? (
              <span className="learned-tag">✓ {t('Learned today — see you tomorrow!', 'Научено денес — се гледаме утре!')}</span>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => markLearned(conceptOfDay.id)}>
                {t('Mark as learned today', 'Означи како научено денес')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Concept library */}
      <section className="section-gap">
        <div className="section-eyebrow">
          <span className="sec-no">01</span>
          <h2>{t('Concept library', 'Библиотека на концепти')}</h2>
        </div>

        <div className="learn-controls">
          <div className="filter-chips">
            {categories.map((c) => (
              <button
                type="button"
                key={c}
                className={`chip-btn${category === c ? ' active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {catLabel(c)}
              </button>
            ))}
          </div>
          <input
            className="learn-search"
            type="search"
            placeholder={t('Search concepts…', 'Пребарај концепти…')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="muted center" style={{ padding: '24px' }}>{t('No concepts match your search.', 'Ниту еден концепт не одговара на пребарувањето.')}</p>
        ) : (
          <div className="grid grid-2" style={{ marginTop: '18px' }}>
            {filtered.map((c) => (
              <ConceptCard key={c.id} concept={c} learned={learnedSet.has(c.id)} onMark={markLearned} />
            ))}
          </div>
        )}
      </section>

      {/* Techniques */}
      <section className="section-gap">
        <div className="section-eyebrow">
          <span className="sec-no">02</span>
          <h2>{t('Study & coping techniques', 'Техники за учење и справување')}</h2>
        </div>
        <p className="muted" style={{ marginTop: '-8px', marginBottom: '8px' }}>
          {t(
            'A toolbox of methods. After the survey, your results highlight the ones that fit you best.',
            'Збир од методи. По прашалникот, твоите резултати ги истакнуваат оние што најмногу ти одговараат.',
          )}
        </p>
        {Object.keys(TARGET_GROUPS)
          .filter((g) => techByGroup[g])
          .map((g) => (
            <div key={g} style={{ marginTop: '24px' }}>
              <p className="eyebrow">{lang === 'mk' ? GROUP_MK[g] || TARGET_GROUPS[g] : TARGET_GROUPS[g]}</p>
              <div className="grid grid-3">
                {techByGroup[g].map((t) => (
                  <TechniqueCard key={t.id} tech={t} />
                ))}
              </div>
            </div>
          ))}
      </section>

      <div className="section-gap">
        <div className="row">
          <Link to="/survey" className="btn btn-primary">{t('Take the survey', 'Реши го прашалникот')}</Link>
          <Link to="/trainer" className="btn btn-secondary">{t('Practice in the Trainer', 'Вежбај во Тренерот')}</Link>
        </div>
        <div style={{ marginTop: '16px' }}>
          <DisclaimerBanner compact />
        </div>
      </div>
    </div>
  )
}
