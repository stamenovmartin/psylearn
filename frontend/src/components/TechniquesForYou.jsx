// Personalized techniques on the Results page, matched to the predicted profile.
import { Link } from 'react-router-dom'
import { TECHNIQUES } from '../techniques.js'
import { OPTION_ART } from '../questionArt.jsx'
import { valueLabel } from '../utils.js'
import { useLang } from '../i18n.jsx'
import { MK } from '../mkContent.js'

const ORDER = ['stress_risk', 'personality_profile', 'study_style', 'learning_orientation', 'motivation_type']

export default function TechniquesForYou({ predictions }) {
  const { lang, t } = useLang()
  const mk = lang === 'mk'
  if (!predictions) return null

  const matched = []
  ORDER.forEach((target) => {
    TECHNIQUES.forEach((tech) => {
      if (tech.target === target && tech.value === predictions[target]) matched.push(tech)
    })
  })
  const general = TECHNIQUES.filter((tech) => tech.target === 'general').slice(0, 2)
  const list = [...matched, ...general].slice(0, 9)
  if (list.length === 0) return null

  return (
    <div className="stack">
      <p className="muted" style={{ marginTop: '-8px' }}>
        {t('Hand-picked for your profile — calming methods, study moves and habits that suit how you learn. Browse the full toolbox in', 'Избрани за твојот профил — методи за смирување, потези за учење и навики што ти одговараат. Разгледај ја целата ризница во')}{' '}
        <Link to="/learn">{t('Learn', 'Учи')}</Link>.
      </p>
      <div className="grid grid-3">
        {list.map((tech) => {
          const M = mk ? MK.techniques[tech.id] || {} : {}
          const tag = tech.target === 'general' ? t('For everyone', 'За секого') : valueLabel(tech.target, tech.value)
          return (
            <div className="card tech-card" key={tech.id}>
              <div className="tech-head">
                <span className="tech-icon">{OPTION_ART[tech.icon] || OPTION_ART.bulb}</span>
                <div>
                  <span className="tech-tag">{tag}</span>
                  <h4 style={{ margin: '2px 0 0' }}>{M.title || tech.title}</h4>
                </div>
              </div>
              <ol className="tech-steps">
                {(M.steps || tech.steps).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
              <p className="muted" style={{ margin: '6px 0 0', fontSize: '0.84rem' }}>
                <strong>{t('Why:', 'Зошто:')}</strong> {M.why || tech.why}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
