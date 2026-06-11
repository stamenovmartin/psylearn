import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client.js'
import {
  SECTION_COLORS,
  SENTIMENT_COLORS,
  saveResult,
  saveAnswers,
  loadAnswers,
  clearAnswers,
} from '../utils.js'
import Loader from '../components/Loader.jsx'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'
import { QUESTION_ART, OPTION_ART } from '../questionArt.jsx'
import { useLang } from '../i18n.jsx'
import { MK } from '../mkContent.js'

const TOTAL = 40

// Flatten sections into a single ordered list with section context + number.
function flatten(sections) {
  const flat = []
  sections.forEach((s) => {
    s.questions.forEach((q) => {
      flat.push({ ...q, sectionId: s.id, sectionTitle: s.title, number: flat.length + 1 })
    })
  })
  return flat
}

export default function SurveyPage() {
  const navigate = useNavigate()

  const { lang, t } = useLang()
  const mk = lang === 'mk'

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [answers, setAnswers] = useState(() => loadAnswers() || {})
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState('next')
  const [resumed, setResumed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const positioned = useRef(false)
  const advanceTimer = useRef(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setLoadError('')
      try {
        setData(await api.getQuestions())
      } catch (err) {
        setLoadError(err.message || 'Could not load the questionnaire.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Autosave answers (resume support).
  useEffect(() => {
    if (Object.keys(answers).length) saveAnswers(answers)
  }, [answers])

  const sections = data?.sections || []
  const likertLabels = data?.likert_labels || {}
  const flat = flatten(sections)
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount >= TOTAL
  const remaining = TOTAL - answeredCount

  // Jump to the first unanswered question on first load.
  useEffect(() => {
    if (!data || positioned.current) return
    positioned.current = true
    const idx = flat.findIndex((q) => answers[q.id] === undefined)
    setCurrent(idx >= 0 ? idx : 0)
    const n = Object.keys(answers).length
    setResumed(n > 0 && n < TOTAL)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  function goTo(idx, direction) {
    const clamped = Math.max(0, Math.min(TOTAL - 1, idx))
    setDir(direction)
    setCurrent(clamped)
  }

  function selectAnswer(id, value, index) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    if (index < TOTAL - 1) {
      advanceTimer.current = setTimeout(() => goTo(index + 1, 'next'), 280)
    }
  }

  function fillSample() {
    const filled = {}
    for (let i = 1; i <= TOTAL; i += 1) filled[`q${i}`] = Math.floor(Math.random() * 5) + 1
    setAnswers(filled)
  }

  function startOver() {
    clearAnswers()
    setAnswers({})
    setResumed(false)
    goTo(0, 'prev')
  }

  async function handleSubmit() {
    if (!allAnswered || submitting) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const result = await api.predict(answers)
      saveResult(result)
      clearAnswers()
      navigate('/results')
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong while building your profile.')
      setSubmitting(false)
    }
  }

  // Keyboard: 1–5 to answer, arrows to navigate.
  useEffect(() => {
    function onKey(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const q = flat[current]
      if (!q) return
      const n = Number(e.key)
      if (n >= 1) {
        if (q.type === 'choice' && q.options && n <= q.options.length) {
          e.preventDefault()
          selectAnswer(q.id, q.options[n - 1].value, current)
          return
        }
        if (q.type !== 'choice' && n <= 5) {
          e.preventDefault()
          selectAnswer(q.id, n, current)
          return
        }
      }
      if (e.key === 'ArrowRight') {
        goTo(current + 1, 'next')
      } else if (e.key === 'ArrowLeft') {
        goTo(current - 1, 'prev')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, answers, data])

  if (loading) {
    return (
      <div className="container page">
        <Loader label="Loading questions…" />
      </div>
    )
  }
  if (loadError) {
    return (
      <div className="container page">
        <div className="alert alert-error stack" role="alert">
          <span>{loadError}</span>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      </div>
    )
  }

  const q = flat[current] || flat[0]
  const accent = SECTION_COLORS[q.sectionId]
  const progressPct = (answeredCount / TOTAL) * 100

  const locQ = (qq) => (mk && MK.questions[qq.id] ? MK.questions[qq.id].text : qq.text)
  const locSec = (qq) => (mk && MK.sections[qq.sectionId] ? MK.sections[qq.sectionId].title : qq.sectionTitle)
  const locOpt = (qq, opt) =>
    mk && MK.questions[qq.id] && MK.questions[qq.id].options[String(opt.value)]
      ? MK.questions[qq.id].options[String(opt.value)]
      : opt.label
  const locLik = (n) => (mk && MK.likert ? MK.likert[n] : likertLabels[n] || likertLabels[String(n)])

  return (
    <div className="container page">
      <div className="quiz-wrap">
        <header style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
          <p className="eyebrow">{t('Interactive questionnaire', 'Интерактивен прашалник')}</p>
          <h1 style={{ marginBottom: '0.3em' }}>{t('Discover how you learn', 'Откриј како учиш')}</h1>
          <p className="muted" style={{ margin: 0 }}>
            {allAnswered
              ? t('All answered — review any question, then see your profile.', 'Сè е одговорено — прегледај било кое прашање, па види го профилот.')
              : answeredCount === 0
                ? t('Tap an answer (or press 1–5). It only takes a few minutes.', 'Допри одговор (или притисни 1–5). Трае само неколку минути.')
                : t(`Keep going — ${remaining} to go!`, `Само напред — уште ${remaining}!`)}
          </p>
        </header>

        {resumed && (
          <div className="alert alert-info spread" style={{ marginBottom: '1rem' }}>
            <span>{t('We restored your saved progress on this device.', 'Го вративме твојот зачуван напредок на овој уред.')}</span>
            <button type="button" className="btn btn-ghost" onClick={startOver}>
              {t('Start over', 'Почни одново')}
            </button>
          </div>
        )}

        {/* progress */}
        <div className="quiz-progress-meta">
          <span className="qp-pos">{t('Question', 'Прашање')} {current + 1} {t('of', 'од')} {TOTAL}</span>
          <span className="qp-sec" style={{ color: accent }}>{locSec(q)}</span>
        </div>
        <div className="progress-track" style={{ marginBottom: '22px' }}>
          <div className="progress-fill" style={{ width: `${progressPct}%`, background: accent }} />
        </div>

        {/* question card */}
        <div className={`quiz-card in-${dir}`} key={current}>
          <div
            className="quiz-art draw"
            style={{ color: accent, background: `${accent}14`, borderColor: `${accent}33` }}
          >
            {QUESTION_ART[q.id]}
          </div>
          <span className="quiz-chip" style={{ color: accent, background: `${accent}14` }}>
            {locSec(q)}
          </span>
          <p className="quiz-question">{locQ(q)}</p>
          {q.type === 'choice' && q.options ? (
            <div className="choice-options">
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt.value
                return (
                  <button
                    type="button"
                    key={opt.value}
                    className={`choice-option${selected ? ' selected' : ''}`}
                    style={{ '--opt': accent }}
                    onClick={() => selectAnswer(q.id, opt.value, current)}
                    aria-pressed={selected}
                  >
                    <span className="choice-art draw">{OPTION_ART[opt.art]}</span>
                    <span className="choice-label">{locOpt(q, opt)}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="quiz-options">
              {[1, 2, 3, 4, 5].map((n) => {
                const selected = answers[q.id] === n
                const color = SENTIMENT_COLORS[n - 1]
                return (
                  <button
                    type="button"
                    key={n}
                    className={`quiz-option${selected ? ' selected' : ''}`}
                    style={{ '--opt': color }}
                    onClick={() => selectAnswer(q.id, n, current)}
                    aria-pressed={selected}
                  >
                    <span className="quiz-badge">{n}</span>
                    <span className="quiz-olabel">{locLik(n)}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* navigation */}
        <div className="quiz-nav">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => goTo(current - 1, 'prev')}
            disabled={current === 0}
          >
            ← {t('Back', 'Назад')}
          </button>
          <div className="quiz-dots">
            {flat.map((item, i) => {
              const done = answers[item.id] !== undefined
              return (
                <button
                  type="button"
                  key={item.id}
                  className={`quiz-dot${i === current ? ' current' : ''}`}
                  style={done ? { background: SECTION_COLORS[item.sectionId], borderColor: SECTION_COLORS[item.sectionId] } : undefined}
                  onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                  aria-label={`Go to question ${i + 1}${done ? ' (answered)' : ''}`}
                />
              )
            })}
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => goTo(current + 1, 'next')}
            disabled={current === TOTAL - 1}
          >
            {t('Next', 'Следно')} →
          </button>
        </div>

        {submitError && (
          <div className="alert alert-error" style={{ marginTop: '20px' }} role="alert">
            {submitError}
          </div>
        )}

        {/* action bar */}
        <div className="card center stack section-gap">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            disabled={!allAnswered || submitting}
            onClick={handleSubmit}
          >
            {submitting
              ? t('Analyzing…', 'Анализирам…')
              : allAnswered
                ? t('See my profile', 'Види го мојот профил')
                : t(`Answer all ${TOTAL} to continue`, `Одговори ги сите ${TOTAL} за да продолжиш`)}
          </button>
          <div className="row" style={{ justifyContent: 'center', gap: '8px' }}>
            <button type="button" className="btn btn-ghost" onClick={fillSample} disabled={submitting}>
              {t('Fill sample answers', 'Пополни примерни одговори')}
            </button>
            {answeredCount > 0 && (
              <button type="button" className="btn btn-ghost" onClick={startOver} disabled={submitting}>
                {t('Start over', 'Почни одново')}
              </button>
            )}
          </div>
        </div>

        <div className="section-gap">
          <DisclaimerBanner compact />
        </div>
      </div>
    </div>
  )
}
