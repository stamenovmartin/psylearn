import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { getLearnStreak, getTrainerStreak, getWellnessStreak, STREAK_EVENT } from '../streaks.js'
import { useLang } from '../i18n.jsx'

const links = [
  { to: '/', en: 'Home', mk: 'Дома', end: true },
  { to: '/hbsc', en: 'HBSC data', mk: 'HBSC' },
  { to: '/survey', en: 'Check-in', mk: 'Проценка' },
  { to: '/wellness', en: 'Wellness', mk: 'Добро­состојба' },
  { to: '/learn', en: 'Learn', mk: 'Учи' },
  { to: '/play', en: 'Play', mk: 'Игра' },
  { to: '/about', en: 'About', mk: 'За нас' },
]

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const update = () =>
      setStreak(Math.max(getLearnStreak(), getTrainerStreak(), getWellnessStreak()))
    update()
    window.addEventListener(STREAK_EVENT, update)
    window.addEventListener('storage', update)
    window.addEventListener('focus', update)
    return () => {
      window.removeEventListener(STREAK_EVENT, update)
      window.removeEventListener('storage', update)
      window.removeEventListener('focus', update)
    }
  }, [])

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-badge" aria-hidden="true">&#936;</span>
          <span className="nav-logo-text">PsyLearn</span>
        </Link>
        <div className="nav-links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {t(l.en, l.mk)}
            </NavLink>
          ))}
          <Link to="/wellness" className="nav-streak" title={t('Your daily streak', 'Твоја дневна низа')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3.2 2-4 0 1.2.7 2 1.6 2C13 9 12 6 12 3z" />
            </svg>
            {streak}
          </Link>
          <div className="lang-toggle" role="group" aria-label="Language">
            <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
            <button type="button" className={lang === 'mk' ? 'on' : ''} onClick={() => setLang('mk')}>MK</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
