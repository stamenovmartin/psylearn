// HBSC dashboard — visualizes REAL youth-wellbeing data from the WHO HBSC
// 2021/2022 study, and maps each finding to how this platform responds.
// This is the data/research backbone for the PNUV "inspired by HBSC" brief.
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { HBSC_META, HBSC_HEADLINES, HBSC_GENDER, HBSC_DOMAINS } from '../hbscData.js'
import { OPTION_ART } from '../questionArt.jsx'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'
import { useLang } from '../i18n.jsx'
import { MK } from '../mkContent.js'

export default function HBSCPage() {
  const { lang, t } = useLang()
  const mk = lang === 'mk'
  const H = mk ? MK.hbsc || {} : {}
  const hl = (h) => (H.headlines && H.headlines[h.id]) || h
  const dom = (d) => (H.domains && H.domains[d.id]) || d
  const gen = (d) => (H.gender && H.gender[d.id]) || d.label
  const genderData = HBSC_GENDER.map((d) => ({ name: gen(d), Girls: d.girls, Boys: d.boys }))

  return (
    <div className="container page">
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="eyebrow">{t('Real youth data · WHO HBSC', 'Реални податоци за млади · WHO HBSC')}</p>
        <h1 style={{ maxWidth: '22ch' }}>{t('The wellbeing of young people, in real numbers', 'Добросостојбата на младите, во реални бројки')}</h1>
        <p className="lead" style={{ maxWidth: '64ch' }}>
          {t(
            'This platform is inspired by the HBSC study (Health Behaviour in School-aged Children) — a WHO cross-national survey of ~280,000 teens aged 11, 13 and 15. The figures below are real findings from the 2021/2022 survey, and each one shapes a part of this app.',
            'Оваа платформа е инспирирана од студијата HBSC (Health Behaviour in School-aged Children) — меѓународно WHO истражување на ~280.000 тинејџери на возраст од 11, 13 и 15 години. Бројките подолу се реални наоди од истражувањето 2021/2022, и секоја обликува дел од оваа апликација.',
          )}
        </p>
      </header>

      {/* Study meta */}
      <div className="grid grid-4">
        <div className="card stat">
          <div className="stat-value">{(HBSC_META.respondents / 1000).toFixed(0)}k</div>
          <div className="stat-label">{t('Adolescents surveyed', 'Анкетирани адолесценти')}</div>
        </div>
        <div className="card stat">
          <div className="stat-value">{HBSC_META.countries}</div>
          <div className="stat-label">{t('Countries & regions', 'Земји и региони')}</div>
        </div>
        <div className="card stat">
          <div className="stat-value">{HBSC_META.ages}</div>
          <div className="stat-label">{t('Ages (years)', 'Возраст (години)')}</div>
        </div>
        <div className="card stat">
          <div className="stat-value">2021/22</div>
          <div className="stat-label">{t('Survey wave', 'Бран на истражување')}</div>
        </div>
      </div>

      {/* Headline findings */}
      <section className="section-gap">
        <div className="section-eyebrow">
          <span className="sec-no">01</span>
          <h2>{t('Key findings', 'Клучни наоди')}</h2>
        </div>
        <div className="grid grid-3">
          {HBSC_HEADLINES.map((h) => (
            <div className="card" key={h.id}>
              <div className="stat-value" style={{ color: 'var(--clay)' }}>{h.value}%</div>
              <div style={{ fontWeight: 600, marginTop: '4px' }}>{hl(h).label}</div>
              <p className="muted" style={{ margin: '6px 0 0', fontSize: '0.84rem' }}>{hl(h).note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gender gap chart */}
      <section className="section-gap">
        <div className="section-eyebrow">
          <span className="sec-no">02</span>
          <h2>{t('The gender gap', 'Родовиот јаз')}</h2>
        </div>
        <div className="chart-card">
          <p className="chart-sub">{t('Percent of adolescents, girls vs boys (HBSC 2021/2022).', 'Процент на адолесценти, девојчиња наспроти момчиња (HBSC 2021/2022).')}</p>
          <div className="chart-box-lg">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderData} layout="vertical" margin={{ top: 8, right: 20, bottom: 4, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 30]} tick={{ fontSize: 12 }} unit="%" />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${v}%`} cursor={{ fillOpacity: 0.08 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Girls" name={t('Girls', 'Девојчиња')} fill="#c9705a" radius={[0, 5, 5, 0]} />
                <Bar dataKey="Boys" name={t('Boys', 'Момчиња')} fill="#2f6bab" radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Domains + how we respond */}
      <section className="section-gap">
        <div className="section-eyebrow">
          <span className="sec-no">03</span>
          <h2>{t('From data to action', 'Од податоци до акција')}</h2>
        </div>
        <p className="muted" style={{ marginTop: '-8px', marginBottom: '4px' }}>
          {t('Each HBSC theme maps to a part of this platform that helps.', 'Секоја HBSC тема е поврзана со дел од оваа платформа што помага.')}
        </p>
        <div className="grid grid-2">
          {HBSC_DOMAINS.map((d) => (
            <div className="card" key={d.id}>
              <div className="learn-head">
                <span className="concept-icon draw" style={{ color: 'var(--navy)', background: 'var(--navy-tint)', borderColor: '#cdd6e2' }}>
                  {OPTION_ART[d.icon] || OPTION_ART.bulb}
                </span>
                <div>
                  <h3 style={{ margin: 0 }}>{dom(d).title}</h3>
                  <p className="muted" style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>{dom(d).stat}</p>
                </div>
              </div>
              <p style={{ marginTop: '12px' }}>{dom(d).response}</p>
              <div className="row">
                {d.links.map((l) => (
                  <Link key={l.to} to={l.to} className="btn btn-secondary">{l.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="section-gap">
        <div className="card" style={{ borderLeft: '4px solid var(--ochre)' }}>
          <p className="eyebrow" style={{ marginBottom: '6px' }}>{t('Data sources', 'Извори на податоци')}</p>
          <h3 style={{ marginTop: 0 }}>{t('All figures are real, published HBSC data', 'Сите бројки се реални, објавени HBSC податоци')}</h3>
          <p className="muted">{HBSC_META.study} — {HBSC_META.survey}.</p>
          <ul className="rec-list">
            {HBSC_META.sources.map((s) => (
              <li className="rec-item" key={s.url}>
                <span className="rec-bullet" aria-hidden="true">&mdash;</span>
                <a href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ marginTop: '16px' }}>
          <DisclaimerBanner text="HBSC figures are regional averages from real survey data. This app is an educational student project that raises awareness and offers wellbeing tools — not a medical service." />
        </div>
      </section>
    </div>
  )
}
