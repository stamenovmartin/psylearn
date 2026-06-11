// Results page — a "Learning Profile Report".
// Shows the profile, recommended memory method (with fit breakdown), study
// recommendations, the user's scores compared to the community, charts, and a
// local history of previous attempts. Includes a print/download-to-PDF action.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import api from '../api/client.js'
import {
  loadResult,
  saveResult,
  loadHistory,
  pushHistory,
  valueLabel,
  scoreLabel,
  formatScore,
  PREDICTION_ORDER,
  memoryMethodTitle,
  recommendationText,
} from '../utils.js'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'
import ResultCard from '../components/ResultCard.jsx'
import MemoryRecommendationCard from '../components/MemoryRecommendationCard.jsx'
import StudyPlan from '../components/StudyPlan.jsx'
import WorldCompare from '../components/WorldCompare.jsx'
import TechniquesForYou from '../components/TechniquesForYou.jsx'
import { useT } from '../i18n.jsx'
import {
  ScoreChart,
  MotivationChart,
  LearningChart,
  MemoryChart,
  StressGauge,
  DistributionPie,
} from '../charts/index.js'

function SectionEyebrow({ no, title }) {
  return (
    <div className="section-eyebrow">
      <span className="sec-no">{no}</span>
      <h2>{title}</h2>
    </div>
  )
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export default function ResultsPage() {
  const t = useT()
  const [result, setResult] = useState(() => loadResult())
  const [community, setCommunity] = useState(null)
  const [history, setHistory] = useState([])
  const savedRef = useRef(false)

  // Save the current result to local history once, then load the list.
  useEffect(() => {
    if (result && !savedRef.current) {
      savedRef.current = true
      const hist = loadHistory()
      const sig = JSON.stringify(result.predictions)
      const lastSig = hist[0] ? JSON.stringify(hist[0].result?.predictions) : null
      if (sig !== lastSig) {
        pushHistory({ at: new Date().toISOString(), result })
      }
    }
    setHistory(loadHistory())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Best-effort community data for comparisons (never blocks the page).
  useEffect(() => {
    let active = true
    api
      .getAnalyticsDistributions()
      .then((d) => {
        if (active) setCommunity(d)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  if (!result) {
    return (
      <div className="container page">
        <div className="card empty-state center">
          <h2>{t('No results yet')}</h2>
          <p className="muted">{t('Take the short survey to discover your personal learning profile.', 'Реши го краткиот прашалник за да го откриеш твојот личен профил на учење.')}</p>
          <Link className="btn btn-primary" to="/survey">
            {t('Take the survey')}
          </Link>
        </div>
      </div>
    )
  }

  const { scores, predictions, explanations, recommendations, memory_signals } = result
  const averages = community?.average_scores || null
  const motivationDist =
    community?.total_surveys > 0 ? community?.distributions?.motivation_type : null

  function loadFromHistory(entry) {
    saveResult(entry.result)
    setResult(entry.result)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container page">
      {/* Masthead */}
      <section className="summary-banner report-head">
        <div className="report-meta">
          <span className="report-stamp">PsyLearn · {t('Learning Profile Report', 'Извештај за профил на учење')}</span>
          <span className="report-stamp">{t('Generated', 'Генерирано')} {formatDate(new Date().toISOString())}</span>
        </div>
        <h2>{t('Your Learning Profile')}</h2>
        <p className="lead">
          {t(
            'A snapshot of how you tend to learn, study and stay motivated. Use it as a starting point for better study habits — not as a fixed label.',
            'Кратка слика за тоа како учиш, се подготвуваш и остануваш мотивиран. Користи ја како почетна точка за подобри навики — не како фиксна етикета.',
          )}
        </p>
        <div className="summary-chips">
          <span className="chip">{valueLabel('motivation_type', predictions.motivation_type)}</span>
          <span className="chip">{valueLabel('study_style', predictions.study_style)}</span>
          <span className="chip">
            {valueLabel('personality_profile', predictions.personality_profile)}
          </span>
          <span className="chip">{t('Stress', 'Стрес')}: {valueLabel('stress_risk', predictions.stress_risk)}</span>
        </div>
      </section>

      {/* Toolbar */}
      <div className="toolbar no-print" style={{ marginTop: '20px' }}>
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>
          {t('Download report (PDF)')}
        </button>
        <Link className="btn btn-secondary" to="/survey">
          {t('Retake survey')}
        </Link>
        <Link className="btn btn-ghost" to="/analytics">
          {t('View community analytics')}
        </Link>
      </div>

      {/* Real-world benchmark */}
      <div className="section-gap">
        <WorldCompare scores={scores} />
      </div>

      {/* 01 — Profile */}
      <section className="section-gap">
        <SectionEyebrow no="01" title={t('Profile at a glance')} />
        <div className="grid grid-3">
          {PREDICTION_ORDER.map((target, i) => (
            <ResultCard
              key={target}
              index={i + 1}
              target={target}
              value={predictions[target]}
              explanation={explanations[target]}
            />
          ))}
        </div>
      </section>

      {/* 02 — Recommended memory method + fit */}
      <section className="section-gap">
        <SectionEyebrow no="02" title={t('Your recommended memory method')} />
        <div className="grid grid-2">
          <MemoryRecommendationCard
            method={predictions.recommended_memory_method}
            explanation={explanations.recommended_memory_method}
          />
          <div className="card">
            <h3 style={{ marginTop: 0 }}>{t('How each technique fits you', 'Колку секоја техника ти одговара')}</h3>
            <p className="muted" style={{ marginBottom: '18px' }}>
              {t('Based on your answers (each rated out of 5). The highlighted one is your top match.', 'Според твоите одговори (секоја оценета до 5). Истакнатата е твоето најдобро совпаѓање.')}
            </p>
            {Object.entries(memory_signals || {}).map(([key, val]) => {
              const isPick = key === predictions.recommended_memory_method
              return (
                <div className={`fit-row${isPick ? ' is-pick' : ''}`} key={key}>
                  <span className="fit-label">{memoryMethodTitle(key)}</span>
                  <div className="meter">
                    <div
                      className="meter-fill"
                      style={{
                        width: `${(Number(val) / 5) * 100}%`,
                        background: isPick ? 'var(--ochre)' : 'var(--navy)',
                      }}
                    />
                  </div>
                  <span className="fit-val">{formatScore(val)}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="row" style={{ marginTop: '18px' }}>
          <Link className="btn btn-primary" to="/trainer">
            {t('Practice this technique in the Memory Trainer', 'Вежбај ја оваа техника во Тренерот за меморија')}
          </Link>
        </div>
      </section>

      {/* 03 — Recommendations */}
      <section className="section-gap">
        <SectionEyebrow no="03" title={t('Personalized recommendations')} />
        <div className="card">
          <ul className="rec-list">
            {(recommendations || []).map((tip, i) => (
              <li className="rec-item" key={i}>
                <span className="rec-bullet" aria-hidden="true">&mdash;</span>
                {recommendationText(tip)}
              </li>
            ))}
          </ul>
          {predictions.stress_risk === 'high' ? (
            <div style={{ marginTop: '16px' }}>
              <DisclaimerBanner text={t('If stress feels overwhelming, please reach out to someone you trust or a counselor. This app is not a mental-health service.', 'Ако стресот ти изгледа преголем, разговарај со некој од доверба или со советник. Оваа апликација не е служба за ментално здравје.')} />
            </div>
          ) : null}
        </div>
      </section>

      {/* 04 — Techniques for you */}
      <section className="section-gap">
        <SectionEyebrow no="04" title={t('Techniques for you')} />
        <TechniquesForYou predictions={predictions} />
      </section>

      {/* 05 — Study plan */}
      <section className="section-gap">
        <SectionEyebrow no="05" title={t('Your personalized study plan')} />
        <StudyPlan predictions={predictions} scores={scores} />
      </section>

      {/* 06 — Scores in detail */}
      <section className="section-gap">
        <SectionEyebrow no="06" title={t('Your scores in detail')} />
        <div className="grid grid-2">
          <div className="chart-card">
            <div className="chart-title">{t('Psychological profile', 'Психолошки профил')}</div>
            <ScoreChart scores={scores} />
          </div>
          <div className="chart-card">
            <div className="chart-title">{t('Motivation', 'Мотивација')}</div>
            <MotivationChart scores={scores} />
          </div>
          <div className="chart-card">
            <div className="chart-title">{t('Learning & study', 'Учење и студирање')}</div>
            <LearningChart scores={scores} />
          </div>
          <div className="chart-card">
            <div className="chart-title">{t('Memory strengths', 'Силни страни на меморијата')}</div>
            <MemoryChart signals={memory_signals} />
          </div>
          <div className="chart-card">
            <div className="chart-title">{t('Stress level', 'Ниво на стрес')}</div>
            <StressGauge score={scores.stress_score} level={predictions.stress_risk} />
          </div>
          {motivationDist ? (
            <div className="chart-card">
              <div className="chart-title">{t('How your motivation type compares', 'Како се споредува твојот тип на мотивација')}</div>
              <DistributionPie data={motivationDist} target="motivation_type" />
            </div>
          ) : null}
        </div>

        {/* Comparison vs community */}
        <div className="card" style={{ marginTop: '20px' }}>
          <h3 style={{ marginTop: 0 }}>{t('Sub-score breakdown', 'Преглед на под-скорови')}{averages ? t(' vs. community', ' наспроти заедницата') : ''}</h3>
          {averages && (
            <div className="cmp-legend" style={{ marginBottom: '16px' }}>
              <span>
                <span className="swatch" style={{ background: 'var(--navy)' }} />
                {t('Your score', 'Твој резултат')}
              </span>
              <span>
                <span className="swatch" style={{ background: 'var(--clay)', width: '3px' }} />
                {t('Community average', 'Просек на заедницата')}
              </span>
            </div>
          )}
          <div className="stack" style={{ gap: '14px' }}>
            {Object.entries(scores).map(([key, val]) => {
              const avg = averages ? averages[key] : null
              return (
                <div className="cmp-row" key={key}>
                  <span className="cmp-label">{scoreLabel(key)}</span>
                  <div className="meter">
                    <div className="meter-fill" style={{ width: `${(Number(val) / 5) * 100}%` }} />
                    {avg != null ? (
                      <span className="meter-mark" style={{ left: `${(Number(avg) / 5) * 100}%` }} />
                    ) : null}
                  </div>
                  <span className="cmp-val">{formatScore(val)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 05 — History */}
      {history.length > 1 && (
        <section className="section-gap no-print">
          <SectionEyebrow no="07" title={t('Your recent attempts')} />
          <p className="muted" style={{ marginTop: '-8px' }}>
            {t('Stored only on this device. Click one to view that report again.', 'Се чува само на овој уред. Кликни на еден за повторно да го видиш извештајот.')}
          </p>
          <div className="stack">
            {history.map((entry, i) => (
              <button
                type="button"
                className="history-item"
                key={`${entry.at}-${i}`}
                onClick={() => loadFromHistory(entry)}
              >
                <span className="h-date">{formatDate(entry.at)}</span>
                <span className="h-chips">
                  <span className="h-chip">
                    {valueLabel('motivation_type', entry.result?.predictions?.motivation_type)}
                  </span>
                  <span className="h-chip">
                    {valueLabel('study_style', entry.result?.predictions?.study_style)}
                  </span>
                  <span className="h-chip">
                    {valueLabel('stress_risk', entry.result?.predictions?.stress_risk)} {t('stress', 'стрес')}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="section-gap">
        <DisclaimerBanner compact />
      </div>
    </div>
  )
}
