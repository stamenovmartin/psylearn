// A personalized, checkable weekly study plan generated from the profile.
// Checked tasks are remembered locally (no account needed).
import { useEffect, useState } from 'react'
import { buildStudyPlan } from '../studyPlan.js'
import { useLang } from '../i18n.jsx'

const CHECK_KEY = 'psylearn_plan_checks'

function loadChecks() {
  try {
    const raw = localStorage.getItem(CHECK_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export default function StudyPlan({ predictions, scores }) {
  const { lang, t } = useLang()
  const plan = buildStudyPlan(predictions, scores, lang)
  const [checks, setChecks] = useState(loadChecks)

  useEffect(() => {
    try {
      localStorage.setItem(CHECK_KEY, JSON.stringify(checks))
    } catch {
      /* ignore */
    }
  }, [checks])

  function toggle(key) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const totalTasks = plan.week.reduce((n, d) => n + d.tasks.length, 0)
  const doneTasks = plan.week.reduce(
    (n, d, di) => n + d.tasks.filter((_, ti) => checks[`${di}-${ti}`]).length,
    0,
  )

  return (
    <div className="stack">
      <div className="card">
        <div className="spread">
          <h3 style={{ margin: 0 }}>{t('Guiding principles', 'Водечки принципи')}</h3>
          <span className="badge">{plan.sessionLength.split(' ')[0]} {t('blocks', 'блокови')}</span>
        </div>
        <ul className="rec-list" style={{ marginTop: '12px' }}>
          {plan.principles.map((p, i) => (
            <li className="rec-item" key={i}>
              <span className="rec-bullet" aria-hidden="true">&mdash;</span>
              {p}
            </li>
          ))}
        </ul>
        <p className="muted" style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>
          {t('Recommended session rhythm:', 'Препорачан ритам на сесии:')} <strong>{plan.sessionLength}</strong>.
        </p>
      </div>

      <div className="spread">
        <p className="eyebrow" style={{ margin: 0 }}>{t('Your week', 'Твојата недела')} · {doneTasks}/{totalTasks} {t('done', 'завршени')}</p>
        <div className="progress" style={{ maxWidth: 220 }}>
          <div className="meter">
            <div
              className="meter-fill"
              style={{ width: `${totalTasks ? (doneTasks / totalTasks) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-auto">
        {plan.week.map((d, di) => (
          <div className="card plan-day" key={d.day}>
            <span className="plan-daylabel">{d.day}</span>
            <h4>{d.title}</h4>
            <div className="plan-tasks">
              {d.tasks.map((t, ti) => {
                const key = `${di}-${ti}`
                const done = !!checks[key]
                return (
                  <label className={`plan-task${done ? ' done' : ''}`} key={ti}>
                    <input type="checkbox" checked={done} onChange={() => toggle(key)} />
                    <span className="plan-task-text">{t}</span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
