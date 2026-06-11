// Perception — classic visual illusions (ambiguous figures & misjudgements) that
// show how the mind interprets, not just records. Ties to the course topic
// "perception of self and behaviour". Bilingual (EN/MK), interactive reveals.
import { useState } from 'react'
import { useLang } from '../i18n.jsx'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'

const INK = 'var(--ink)'

function IllusionCard({ title, question, explain, hasReveal, render }) {
  const { t } = useLang()
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p className="muted" style={{ marginBottom: '14px' }}>{question}</p>
      <div className="illusion-stage">{render(revealed)}</div>
      {hasReveal && (
        <button type="button" className="btn btn-secondary" style={{ marginTop: '14px' }} onClick={() => setRevealed((v) => !v)}>
          {revealed ? t('Hide answer', 'Сокриј одговор') : t('Reveal the truth', 'Откриј ја вистината')}
        </button>
      )}
      <p className="muted" style={{ marginTop: '14px', fontSize: '0.9rem' }}>{explain}</p>
    </div>
  )
}

// Ebbinghaus surrounder positions.
function ring(cx, cy, r, n, rad) {
  return Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2
    return { x: cx + Math.cos(a) * rad, y: cy + Math.sin(a) * rad, r }
  })
}

export default function PerceptionPage() {
  const { t } = useLang()

  return (
    <div className="container page">
      <header style={{ marginBottom: '1.25rem' }}>
        <p className="eyebrow">{t('Psychology · perception', 'Психологија · перцепција')}</p>
        <h1 style={{ maxWidth: '22ch' }}>{t('Your mind interprets — it doesn’t just record', 'Твојот ум интерпретира — не само што снима')}</h1>
        <p className="lead" style={{ maxWidth: '62ch' }}>
          {t(
            'Perception is not a recording — it is an active interpretation your brain constructs. These classic illusions make that visible. The same principle shapes how we read ourselves and others, which is worth remembering on a hard day.',
            'Перцепцијата не е снимка — таа е активна интерпретација што ја гради мозокот. Овие класични илузии го прават тоа видливо. Истиот принцип влијае на тоа како се читаме себеси и другите, што вреди да се памети во тежок ден.',
          )}
        </p>
      </header>

      <div className="grid grid-2">
        {/* Müller-Lyer */}
        <IllusionCard
          title={t('Which line is longer?', 'Која линија е подолга?')}
          question={t('The two horizontal lines — top or bottom?', 'Двете хоризонтални линии — горната или долната?')}
          hasReveal
          explain={t(
            'They are exactly the same length (the Müller-Lyer illusion). The arrow fins trick your sense of size.',
            'Се со потполно иста должина (Милер-Лајерова илузија). „Стрелките“ на краевите го залажуваат чувството за големина.',
          )}
          render={(rev) => (
            <svg viewBox="0 0 260 130" className="illusion-svg" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round">
              <line x1="70" y1="45" x2="190" y2="45" />
              <line x1="70" y1="45" x2="85" y2="33" /><line x1="70" y1="45" x2="85" y2="57" />
              <line x1="190" y1="45" x2="175" y2="33" /><line x1="190" y1="45" x2="175" y2="57" />
              <line x1="70" y1="90" x2="190" y2="90" />
              <line x1="70" y1="90" x2="55" y2="78" /><line x1="70" y1="90" x2="55" y2="102" />
              <line x1="190" y1="90" x2="205" y2="78" /><line x1="190" y1="90" x2="205" y2="102" />
              {rev && (
                <>
                  <line x1="70" y1="28" x2="70" y2="107" stroke="var(--ok)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="190" y1="28" x2="190" y2="107" stroke="var(--ok)" strokeWidth="1.5" strokeDasharray="4 4" />
                </>
              )}
            </svg>
          )}
        />

        {/* Ebbinghaus */}
        <IllusionCard
          title={t('Which orange circle is bigger?', 'Кој портокалов круг е поголем?')}
          question={t('Compare the two centre circles.', 'Спореди ги двата централни круга.')}
          hasReveal
          explain={t(
            'Both centre circles are identical (the Ebbinghaus illusion). We judge size by comparison with neighbours.',
            'Двата централни круга се идентични (Ебингхаусова илузија). Големината ја процениуваме во споредба со соседите.',
          )}
          render={(rev) => (
            <svg viewBox="0 0 260 150" className="illusion-svg">
              {ring(70, 75, 22, 6, 46).map((c, k) => (
                <circle key={k} cx={c.x} cy={c.y} r={c.r} fill="#cdd6e2" />
              ))}
              {ring(190, 75, 7, 8, 30).map((c, k) => (
                <circle key={k} cx={c.x} cy={c.y} r={c.r} fill="#cdd6e2" />
              ))}
              <circle cx="70" cy="75" r="16" fill={rev ? 'var(--ok)' : '#d98b4a'} />
              <circle cx="190" cy="75" r="16" fill={rev ? 'var(--ok)' : '#d98b4a'} />
            </svg>
          )}
        />

        {/* Necker cube (ambiguous) */}
        <IllusionCard
          title={t('Which face is at the front?', 'Која страна е напред?')}
          question={t('Keep looking — the front face flips. An ambiguous figure.', 'Гледај подолго — предната страна се превртува. Двосмислена фигура.')}
          explain={t(
            'The Necker cube is ambiguous: both readings are valid, so your brain switches between them. Nothing about the drawing changed — only your interpretation.',
            'Некеровата коцка е двосмислена: и двете толкувања се точни, па мозокот се префрла меѓу нив. Цртежот не се менува — само твоето толкување.',
          )}
          render={() => (
            <svg viewBox="0 0 200 160" className="illusion-svg" stroke={INK} strokeWidth="2" fill="none">
              <rect x="40" y="50" width="80" height="80" />
              <rect x="80" y="30" width="80" height="80" />
              <line x1="40" y1="50" x2="80" y2="30" />
              <line x1="120" y1="50" x2="160" y2="30" />
              <line x1="40" y1="130" x2="80" y2="110" />
              <line x1="120" y1="130" x2="160" y2="110" />
            </svg>
          )}
        />

        {/* Kanizsa triangle (illusory contour) */}
        <IllusionCard
          title={t('Do you see a triangle?', 'Гледаш ли триаголник?')}
          question={t('There is a bright triangle in the middle…', 'Има светол триаголник во средината…')}
          explain={t(
            'No triangle is actually drawn (the Kanizsa triangle). Your brain fills in edges that are not there — it loves to complete patterns.',
            'Всушност нема нацртан триаголник (Канижин триаголник). Мозокот „довршува“ рабови што не постојат — сака да комплетира обрасци.',
          )}
          render={() => (
            <svg viewBox="0 0 200 180" className="illusion-svg">
              <circle cx="100" cy="42" r="26" fill={INK} />
              <circle cx="48" cy="138" r="26" fill={INK} />
              <circle cx="152" cy="138" r="26" fill={INK} />
              <polygon points="100,42 48,138 152,138" fill="var(--surface)" />
              <polygon points="100,58 62,128 138,128" fill="none" stroke={INK} strokeWidth="2" opacity="0" />
            </svg>
          )}
        />
      </div>

      <div className="section-gap">
        <DisclaimerBanner
          text={t(
            'A playful look at perception — just for curiosity and learning.',
            'Разигран поглед на перцепцијата — само за љубопитност и учење.',
          )}
        />
      </div>
    </div>
  )
}
