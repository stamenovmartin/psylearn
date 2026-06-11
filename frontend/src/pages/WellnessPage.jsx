// Wellness — a daily wellbeing hub: a wellness streak, daily challenges and a
// mood diary. Directly inspired by HBSC themes (mental health, sleep, activity,
// social connection, digital balance).
import { useEffect, useState } from 'react'
import { getWellnessStreak, STREAK_EVENT } from '../streaks.js'
import DailyChallenges from '../components/DailyChallenges.jsx'
import MoodDiary from '../components/MoodDiary.jsx'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'
import { useT } from '../i18n.jsx'

export default function WellnessPage() {
  const t = useT()
  const [streak, setStreak] = useState(getWellnessStreak())

  useEffect(() => {
    const update = () => setStreak(getWellnessStreak())
    window.addEventListener(STREAK_EVENT, update)
    return () => window.removeEventListener(STREAK_EVENT, update)
  }, [])

  return (
    <div className="container page">
      <header style={{ marginBottom: '1.25rem' }}>
        <p className="eyebrow">{t('Daily wellbeing', 'Дневна добросостојба')}</p>
        <h1 style={{ maxWidth: '20ch' }}>{t('Your wellness space', 'Твојот простор за добросостојба')}</h1>
        <p className="lead" style={{ maxWidth: '60ch' }}>
          {t(
            'Small daily habits add up. Track how you feel, take on three quick wellness challenges, and build a streak — inspired by what the HBSC study tells us helps young people thrive.',
            'Малите дневни навики се собираат. Следи како се чувствуваш, прифати три брзи предизвици за добросостојба и гради низа — инспирирано од она што HBSC студијата покажува дека им помага на младите.',
          )}
        </p>
        <span className="pill" title={t('Log your mood or finish a challenge each day', 'Запиши го расположението или заврши предизвик секој ден')} style={{ color: 'var(--ochre-deep)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3.2 2-4 0 1.2.7 2 1.6 2C13 9 12 6 12 3z" />
          </svg>
          {streak}{t('-day wellness streak', '-дневна низа на добросостојба')}
        </span>
      </header>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <DailyChallenges />
        <MoodDiary />
      </div>

      <div className="section-gap">
        <DisclaimerBanner text={t('A friendly habit tracker, not a medical tool. If you’re struggling, please talk to someone you trust or a professional.', 'Пријателски следач на навики, не медицинска алатка. Ако ти е тешко, разговарај со некој од доверба или со стручно лице.')} />
      </div>
    </div>
  )
}
