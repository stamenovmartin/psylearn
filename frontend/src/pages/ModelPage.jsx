// Model Insights — a transparency page that visualizes the actual trained model:
// per-target metrics, feature importances, confusion matrices and the
// correlation structure of the sub-scores. Demonstrates the ML behind the app.
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client.js'
import Loader from '../components/Loader.jsx'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'
import { predictionTitle, valueLabel, scoreLabel, formatScore } from '../utils.js'
import { useT } from '../i18n.jsx'

function corrColor(v) {
  if (v >= 0) return `rgba(30, 58, 95, ${Math.min(1, v).toFixed(2)})`
  return `rgba(168, 85, 63, ${Math.min(1, -v).toFixed(2)})`
}

function cmCell(value, rowTotal) {
  const intensity = rowTotal ? value / rowTotal : 0
  return `rgba(30, 58, 95, ${(0.08 + intensity * 0.85).toFixed(2)})`
}

export default function ModelPage() {
  const tr = useT()
  const [insights, setInsights] = useState(null)
  const [corr, setCorr] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [target, setTarget] = useState('motivation_type')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [ins, cr] = await Promise.all([
        api.getModelInsights(),
        api.getCorrelations().catch(() => null),
      ])
      setInsights(ins)
      setCorr(cr)
    } catch (err) {
      setError(err.message || 'Could not load model insights.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const meanAcc = useMemo(() => {
    if (!insights) return 0
    const accs = insights.targets.map((t) => insights.metrics[t].accuracy)
    return accs.reduce((a, b) => a + b, 0) / accs.length
  }, [insights])

  if (loading) {
    return (
      <div className="container page">
        <Loader label={tr('Loading model insights…', 'Се вчитува анализата на моделот…')} />
      </div>
    )
  }
  if (error) {
    return (
      <div className="container page">
        <div className="alert alert-error stack" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn-primary" onClick={load}>
            {tr('Try again', 'Обиди се повторно')}
          </button>
        </div>
      </div>
    )
  }

  const m = insights.metrics[target]
  const importances = insights.feature_importances?.[target] || {}
  const sortedImp = Object.entries(importances).sort((a, b) => b[1] - a[1])
  const maxImp = sortedImp.length ? sortedImp[0][1] : 1
  const cmLabels = m.labels || insights.classes[target]
  const cm = m.confusion_matrix || []
  const rowTotals = cm.map((row) => row.reduce((a, b) => a + b, 0))

  return (
    <div className="container page">
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="eyebrow">{tr('Under the hood', 'Зад кулисите')}</p>
        <h1 style={{ maxWidth: '20ch' }}>{tr('Model insights', 'Анализа на моделот')}</h1>
        <p className="lead" style={{ maxWidth: '62ch' }}>
          {tr(
            `What the machine-learning model actually learned. Six RandomForest classifiers (one per target) trained on ${insights.n_samples?.toLocaleString()} synthetic respondents, with transparent rule-based labels.`,
            `Што всушност научил моделот. Шест RandomForest класификатори (по еден за секој таргет) тренирани на ${insights.n_samples?.toLocaleString()} синтетички испитаници, со транспарентни етикети базирани на правила.`,
          )}
        </p>
      </header>

      {/* Overview */}
      <div className="grid grid-4">
        <div className="card stat">
          <div className="stat-value">{(meanAcc * 100).toFixed(1)}%</div>
          <div className="stat-label">{tr('Mean accuracy', 'Просечна точност')}</div>
        </div>
        <div className="card stat">
          <div className="stat-value">{insights.n_samples?.toLocaleString()}</div>
          <div className="stat-label">{tr('Training samples', 'Примероци за тренирање')}</div>
        </div>
        <div className="card stat">
          <div className="stat-value">{insights.n_estimators}</div>
          <div className="stat-label">{tr('Trees per forest', 'Дрва по шума')}</div>
        </div>
        <div className="card stat">
          <div className="stat-value">{insights.features?.length}</div>
          <div className="stat-label">{tr('Input features', 'Влезни карактеристики')}</div>
        </div>
      </div>

      {/* Per-target metrics */}
      <section className="section-gap">
        <div className="section-eyebrow">
          <span className="sec-no">01</span>
          <h2>{tr('Accuracy by target', 'Точност по таргет')}</h2>
        </div>
        <div className="grid grid-3">
          {insights.targets.map((t) => {
            const mt = insights.metrics[t]
            const active = t === target
            return (
              <button
                type="button"
                key={t}
                className={`card card-hover technique-option${active ? ' selected' : ''}`}
                onClick={() => setTarget(t)}
              >
                <div className="result-target">{predictionTitle(t)}</div>
                <div className="stat-value" style={{ fontSize: '1.7rem' }}>
                  {(mt.accuracy * 100).toFixed(1)}%
                </div>
                <p className="muted" style={{ margin: '6px 0 0', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                  F1 {mt.f1_macro.toFixed(2)} · P {mt.precision_macro.toFixed(2)} · R{' '}
                  {mt.recall_macro.toFixed(2)}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* Feature importances + confusion matrix for selected target */}
      <section className="section-gap">
        <div className="section-eyebrow">
          <span className="sec-no">02</span>
          <h2>“{predictionTitle(target)}”</h2>
        </div>
        <div className="grid grid-2">
          <div className="card">
            <h3 style={{ marginTop: 0 }}>{tr('Feature importance', 'Важност на карактеристиките')}</h3>
            <p className="muted" style={{ marginBottom: '16px' }}>
              {tr('Which sub-scores the model relies on most for this prediction.', 'На кои под-скорови моделот најмногу се потпира за ова предвидување.')}
            </p>
            <div className="stack" style={{ gap: '12px' }}>
              {sortedImp.slice(0, 10).map(([feat, imp]) => (
                <div className="cmp-row" key={feat}>
                  <span className="cmp-label">{scoreLabel(feat)}</span>
                  <div className="meter">
                    <div className="meter-fill" style={{ width: `${(imp / maxImp) * 100}%`, background: 'var(--ochre)' }} />
                  </div>
                  <span className="cmp-val">{imp.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>{tr('Confusion matrix', 'Матрица на конфузија')}</h3>
            <p className="muted" style={{ marginBottom: '16px' }}>
              {tr('Rows = true class, columns = predicted (test set). Strong diagonal = good model.', 'Редови = вистинска класа, колони = предвидена (тест сет). Силна дијагонала = добар модел.')}
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table className="cm-table">
                <thead>
                  <tr>
                    <th />
                    {cmLabels.map((l) => (
                      <th key={l} title={valueLabel(target, l)}>
                        {valueLabel(target, l).slice(0, 8)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cm.map((row, i) => (
                    <tr key={i}>
                      <th title={valueLabel(target, cmLabels[i])}>
                        {valueLabel(target, cmLabels[i]).slice(0, 10)}
                      </th>
                      {row.map((val, j) => (
                        <td
                          key={j}
                          style={{
                            background: cmCell(val, rowTotals[i]),
                            color: val / (rowTotals[i] || 1) > 0.5 ? '#f1e9d4' : 'var(--ink)',
                          }}
                          title={`${val}`}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Correlation heatmap */}
      {corr && corr.matrix?.length > 0 && (
        <section className="section-gap">
          <div className="section-eyebrow">
            <span className="sec-no">03</span>
            <h2>{tr('How the sub-scores relate', 'Како се поврзани под-скоровите')}</h2>
          </div>
          <div className="card">
            <p className="muted" style={{ marginBottom: '16px' }}>
              {tr(`Pearson correlations between the 16 sub-scores across ${corr.n} surveys.`, `Пирсонови корелации меѓу 16-те под-скорови низ ${corr.n} анкети.`)}{' '}
              <span style={{ color: 'var(--navy)', fontWeight: 600 }}>{tr('Navy', 'Сино')}</span> = {tr('positive', 'позитивна')},
              <span style={{ color: 'var(--clay)', fontWeight: 600 }}> {tr('clay', 'црвена')}</span> = {tr('negative', 'негативна')}.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table className="heatmap">
                <thead>
                  <tr>
                    <th />
                    {corr.labels.map((_, j) => (
                      <th key={j} title={corr.labels[j]}>{j + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {corr.matrix.map((row, i) => (
                    <tr key={i}>
                      <th title={corr.labels[i]}>
                        <span className="hm-idx">{i + 1}.</span> {corr.labels[i]}
                      </th>
                      {row.map((v, j) => (
                        <td
                          key={j}
                          style={{ background: corrColor(v), color: Math.abs(v) > 0.55 ? '#f1e9d4' : 'var(--muted)' }}
                          title={`${corr.labels[i]} × ${corr.labels[j]} = ${v}`}
                        >
                          {Math.round(v * 100)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <div className="section-gap">
        <DisclaimerBanner text={tr(insights.data_note, 'Моделите се тренирани на СИНТЕТИЧКИ податоци со етикети базирани на правила. Ова е едукативен прототип базиран на концепти од психологија, не клинички или дијагностички инструмент.')} />
        <div className="row" style={{ marginTop: '20px' }}>
          <Link className="btn btn-primary" to="/survey">
            {tr('Take the survey', 'Реши го прашалникот')}
          </Link>
          <Link className="btn btn-secondary" to="/analytics">
            {tr('Community analytics', 'Аналитика на заедницата')}
          </Link>
        </div>
      </div>
    </div>
  )
}
