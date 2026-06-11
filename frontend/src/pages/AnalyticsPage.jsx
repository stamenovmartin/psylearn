import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client.js'
import Loader from '../components/Loader.jsx'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'
import AnalyticsDashboard from '../components/AnalyticsDashboard.jsx'
import { useT } from '../i18n.jsx'

export default function AnalyticsPage() {
  const t = useT()
  const [summary, setSummary] = useState(null)
  const [distributions, setDistributions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [summaryData, distData] = await Promise.all([
        api.getAnalyticsSummary(),
        api.getAnalyticsDistributions(),
      ])
      setSummary(summaryData)
      setDistributions(distData)
    } catch (err) {
      setError(
        (err && err.message) ||
          'Something went wrong while loading the analytics.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="container page">
      <header className="stack">
        <span className="eyebrow">{t('Aggregate analytics', 'Збирна аналитика')}</span>
        <h1>{t('Community insights', 'Увиди од заедницата')}</h1>
        <p className="lead muted">
          {t(
            'These are anonymous, aggregate results from everyone who completed the survey. They are pooled together so no individual response can be seen, and the figures include synthetic seed data to help the patterns come to life. Use them to explore how different study habits compare — not to judge yourself against anyone else.',
            'Ова се анонимни, збирни резултати од сите што го пополниле прашалникот. Се групирани заедно за да не може да се види поединечен одговор, а бројките вклучуваат синтетички почетни податоци за да се видат обрасците. Користи ги за да истражиш како се споредуваат различни навики — не за да се оценуваш себеси наспроти други.',
          )}
        </p>
      </header>

      <div className="section-gap">
        {loading && <Loader label={t('Loading analytics…', 'Се вчитува аналитиката…')} />}

        {!loading && error && (
          <div className="alert alert-error stack">
            <span>{error}</span>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={load}
            >
              {t('Try again', 'Обиди се повторно')}
            </button>
          </div>
        )}

        {!loading && !error && summary && summary.total_surveys === 0 && (
          <div className="empty-state stack center">
            <p className="lead">{t('No data yet — be the first to take the survey.', 'Сè уште нема податоци — биди прв што ќе го реши прашалникот.')}</p>
            <Link className="btn btn-primary" to="/survey">
              {t('Take the survey', 'Реши го прашалникот')}
            </Link>
          </div>
        )}

        {!loading && !error && summary && summary.total_surveys > 0 && (
          <div className="stack section-gap">
            <AnalyticsDashboard
              summary={summary}
              distributions={distributions}
            />
            <div className="card" style={{ borderLeft: '4px solid var(--ochre)' }}>
              <p className="eyebrow" style={{ marginBottom: '6px' }}>{t('How this data is made', 'Како се прават овие податоци')}</p>
              <h3 style={{ marginTop: 0 }}>{t('What are these analytics based on?', 'На што се базира оваа аналитика?')}</h3>
              <ul className="rec-list">
                <li className="rec-item">
                  <span className="rec-bullet" aria-hidden="true">&mdash;</span>
                  {t('These charts aggregate every completed survey', 'Овие графикони ги собираат сите пополнети анкети')} ({summary.total_surveys}).
                </li>
                <li className="rec-item">
                  <span className="rec-bullet" aria-hidden="true">&mdash;</span>
                  {t(
                    "To show patterns from day one, the database is seeded with ~180 synthetic demo profiles (generated the same way the model's training data is); real submissions are added on top.",
                    'За да се видат обрасци од прв ден, базата е наполнета со ~180 синтетички демо профили (генерирани како податоците за тренирање на моделот); реалните одговори се додаваат врз нив.',
                  )}
                </li>
                <li className="rec-item">
                  <span className="rec-bullet" aria-hidden="true">&mdash;</span>
                  {t('The ML model is trained on synthetic data — see the', 'ML моделот е трениран на синтетички податоци — види ја')}{' '}
                  <Link to="/model">{t('Model insights', 'Анализа на моделот')}</Link> {t('page for accuracy and feature importance.', 'страницата за точност и важност на карактеристиките.')}
                </li>
                <li className="rec-item">
                  <span className="rec-bullet" aria-hidden="true">&mdash;</span>
                  {t('For a comparison against real people, your results include a benchmark vs a public dataset of 19,719 real respondents (Big Five).', 'За споредба со реални луѓе, твоите резултати вклучуваат споредба со јавна база од 19.719 реални испитаници (Big Five).')}
                </li>
              </ul>
            </div>
            <DisclaimerBanner compact />
          </div>
        )}
      </div>
    </div>
  )
}
