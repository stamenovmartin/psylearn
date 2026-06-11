// "How you compare to the world" — benchmarks the user's scores against a REAL,
// public-domain dataset (Open-Source Psychometrics Big Five, ~19,719 people).
import { useEffect, useState } from 'react'
import api from '../api/client.js'
import { worldPercentile } from '../utils.js'
import { useLang } from '../i18n.jsx'

const MK_LABELS = {
  social_energy_score: { label: 'Социјална енергија', trait: 'Екстраверзија' },
  organization_score: { label: 'Организација', trait: 'Совесност' },
  stress_score: { label: 'Чувствителност на стрес', trait: 'Невротицизам' },
  intrinsic_motivation_score: { label: 'Љубопитност', trait: 'Отвореност' },
}

export default function WorldCompare({ scores }) {
  const { lang, t } = useLang()
  const mk = lang === 'mk'
  const [bench, setBench] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    api.getWorldBenchmark().then((b) => { if (active) setBench(b) }).catch(() => { if (active) setFailed(true) })
    return () => { active = false }
  }, [])

  if (failed || !bench || !bench.mapping?.length) return null

  return (
    <div className="card" style={{ borderLeft: '4px solid var(--ochre)' }}>
      <p className="eyebrow" style={{ marginBottom: '6px' }}>{t('Real-world benchmark', 'Споредба со реалниот свет')}</p>
      <h3 style={{ marginTop: 0 }}>{t('How you compare to the world', 'Како се споредуваш со светот')}</h3>
      <p className="muted" style={{ marginBottom: '18px' }}>
        {mk ? (
          <>Твоите резултати споредени со <strong>{bench.n_respondents?.toLocaleString()}</strong> реални луѓе од јавна Big Five база. Лентата е твојот перцентил; ознаката е светскиот просек.</>
        ) : (
          <>Your scores next to <strong>{bench.n_respondents?.toLocaleString()}</strong> real people from a public Big Five dataset. The bar is your percentile; the marker is the global average.</>
        )}
      </p>

      <div className="cmp-legend" style={{ marginBottom: '16px' }}>
        <span><span className="swatch" style={{ background: 'var(--navy)' }} /> {t('Your percentile', 'Твој перцентил')}</span>
        <span><span className="swatch" style={{ background: 'var(--clay)', width: '3px' }} /> {t('World average', 'Светски просек')}</span>
      </div>

      <div className="stack" style={{ gap: '16px' }}>
        {bench.mapping.map((m) => {
          const score = scores?.[m.score_key]
          if (score === undefined) return null
          const pct = worldPercentile(score, m.trait_mean, m.trait_sd)
          const loc = mk ? MK_LABELS[m.score_key] : null
          return (
            <div className="cmp-row" key={m.score_key}>
              <span className="cmp-label">
                {loc ? loc.label : m.label} <span className="muted">· {loc ? loc.trait : m.trait}</span>
              </span>
              <div className="meter">
                <div className="meter-fill" style={{ width: `${pct}%` }} />
                <span className="meter-mark" style={{ left: '50%' }} />
              </div>
              <span className="cmp-val">{pct}%</span>
            </div>
          )
        })}
      </div>

      <p className="muted" style={{ marginTop: '18px', fontSize: '0.78rem' }}>
        {mk ? 'Споредено со реални испитаници од ' : 'Benchmarked against real respondents from the '}
        <a href={bench.source_url} target="_blank" rel="noreferrer">{bench.source}</a>{' '}
        ({bench.license}).{' '}
        {mk
          ? 'Big Five цртите се приближно совпаѓање за овие под-скорови — забавна референца, не клиничка мерка.'
          : 'Big Five traits are an approximate match for these learning sub-scores — a fun reference, not a clinical measure.'}
      </p>
    </div>
  )
}
