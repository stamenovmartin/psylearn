import { Link } from 'react-router-dom'
import { useT } from '../i18n.jsx'

export default function Footer() {
  const t = useT()
  return (
    <footer className="footer">
      <div className="container">
        <span>© {new Date().getFullYear()} PsyLearn · {t('Educational prototype', 'Едукативен прототип')}</span>
        <span>
          {t('Youth wellbeing, inspired by HBSC', 'Младинска добросостојба, инспирирана од HBSC')} ·{' '}
          <Link to="/about">{t('About', 'За нас')}</Link>
        </span>
      </div>
    </footer>
  )
}
