import { useT } from '../i18n.jsx'

// Reusable disclaimer banner. `text` overrides the default message when needed.
export default function DisclaimerBanner({ text, compact = false }) {
  const t = useT()
  const message =
    text ||
    t(
      'This is an educational prototype for youth wellbeing, inspired by the HBSC study. It is not a clinical assessment, diagnosis or therapy tool.',
      'Ова е едукативен прототип за младинска добросостојба, инспириран од студијата HBSC. Не е клиничка проценка, дијагноза или алатка за терапија.',
    )
  return (
    <div className="disclaimer-banner" role="note" style={compact ? { fontSize: '0.82rem' } : undefined}>
      <span className="disc-label">{t('Note', 'Напомена')}</span>
      <span>
        <strong>{t('Educational use only. ', 'Само за едукативна употреба. ')}</strong>
        {message}
      </span>
    </div>
  )
}
