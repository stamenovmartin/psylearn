// Stroop Test — a genuine cognitive-psychology task. A colour word is shown in a
// (often mismatched) ink colour; you must select the INK colour, not read the
// word. Measures accuracy and the Stroop interference effect (reaction-time cost
// when word and colour conflict). Bilingual.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'

const COLORS = [
  { key: 'red', hex: '#d4524e', en: 'Red', mk: 'Црвена' },
  { key: 'blue', hex: '#3a6ea5', en: 'Blue', mk: 'Сина' },
  { key: 'green', hex: '#3f9d7f', en: 'Green', mk: 'Зелена' },
  { key: 'amber', hex: '#d99a3c', en: 'Yellow', mk: 'Жолта' },
  { key: 'purple', hex: '#7a5ba6', en: 'Purple', mk: 'Виолетова' },
]
const N_TRIALS = 20
const rnd = (n) => Math.floor(Math.random() * n)

function makeTrials() {
  const trials = []
  for (let i = 0; i < N_TRIALS; i += 1) {
    const word = rnd(COLORS.length)
    const ink = Math.random() < 0.4 ? word : rnd(COLORS.length)
    trials.push({ word, ink, congruent: word === ink })
  }
  return trials
}

export default function StroopGamePage() {
  const { lang, t } = useLang()
  const name = (c) => (lang === 'mk' ? c.mk : c.en)

  const [phase, setPhase] = useState('intro') // intro | run | done
  const [trials, setTrials] = useState([])
  const [i, setI] = useState(0)
  const [results, setResults] = useState([])
  const [flash, setFlash] = useState(null) // 'ok' | 'no'
  const shownAt = useRef(0)

  useEffect(() => {
    if (phase === 'run') shownAt.current = performance.now()
  }, [phase, i])

  function start() {
    setTrials(makeTrials())
    setResults([])
    setI(0)
    setFlash(null)
    setPhase('run')
  }

  function answer(choiceKey) {
    if (flash) return
    const trial = trials[i]
    const rt = performance.now() - shownAt.current
    const correct = COLORS[trial.ink].key === choiceKey
    setResults((r) => [...r, { correct, rt, congruent: trial.congruent }])
    setFlash(correct ? 'ok' : 'no')
    setTimeout(() => {
      setFlash(null)
      if (i < N_TRIALS - 1) setI(i + 1)
      else setPhase('done')
    }, 280)
  }

  if (phase === 'intro') {
    return (
      <div className="container page">
        <div className="quiz-wrap">
          <header style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <p className="eyebrow">{t('Cognitive test', 'Когнитивен тест')}</p>
            <h1>{t('The Stroop Test', 'Струп тест')}</h1>
            <p className="lead">
              {t(
                'A classic attention task. A colour word will appear, but it is printed in a different ink colour. Tap the INK colour — not the word you read. Sounds easy; your brain disagrees.',
                'Класична задача за внимание. Ќе се појави збор за боја, но напишан со друга боја. Допри ја БОЈАТА на буквите — не зборот што го читаш. Звучи лесно; мозокот не се согласува.',
              )}
            </p>
          </header>
          <div className="card center stack">
            <p className="muted" style={{ margin: 0 }}>
              {t('20 rounds. Be fast and accurate — we measure both.', '20 рунди. Биди брз и точен — го мериме и двете.')}
            </p>
            <button type="button" className="btn btn-primary btn-lg" onClick={start}>{t('Start test', 'Започни тест')}</button>
          </div>
          <div className="section-gap"><DisclaimerBanner compact /></div>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    const correct = results.filter((r) => r.correct).length
    const acc = Math.round((correct / N_TRIALS) * 100)
    const cong = results.filter((r) => r.congruent && r.correct)
    const incong = results.filter((r) => !r.congruent && r.correct)
    const avg = (arr) => (arr.length ? Math.round(arr.reduce((s, x) => s + x.rt, 0) / arr.length) : 0)
    const avgAll = avg(results.filter((r) => r.correct))
    const interference = avg(incong) - avg(cong)
    return (
      <div className="container page">
        <div className="quiz-wrap">
          <div className="summary-banner">
            <h2>{t('Results', 'Резултати')}</h2>
            <p className="lead">{t('Accuracy', 'Точност')}: {acc}% · {t('Avg speed', 'Просечна брзина')}: {avgAll} ms</p>
          </div>
          <div className="grid grid-3 section-gap">
            <div className="card stat"><div className="stat-value">{acc}%</div><div className="stat-label">{t('Accuracy', 'Точност')}</div></div>
            <div className="card stat"><div className="stat-value">{avg(cong)}<span style={{ fontSize: '1rem' }}> ms</span></div><div className="stat-label">{t('Matching (easy)', 'Совпаднати (лесно)')}</div></div>
            <div className="card stat"><div className="stat-value">{avg(incong)}<span style={{ fontSize: '1rem' }}> ms</span></div><div className="stat-label">{t('Conflicting (hard)', 'Конфликтни (тешко)')}</div></div>
          </div>
          <div className="card section-gap">
            <h3 style={{ marginTop: 0 }}>{t('The Stroop effect', 'Струп ефектот')}</h3>
            <p className="muted">
              {interference > 0
                ? t(
                    `You were about ${interference} ms slower when the word and the colour clashed. That gap is the Stroop effect — reading is so automatic that it interferes with naming the colour.`,
                    `Беше околу ${interference} ms побавен кога зборот и бојата се судираа. Таа разлика е Струп ефектот — читањето е толку автоматско што пречи во именувањето на бојата.`,
                  )
                : t(
                    'Impressively steady — you kept reading from interfering with colour naming.',
                    'Импресивно стабилно — не дозволи читањето да пречи во именувањето на бојата.',
                  )}
            </p>
          </div>
          <div className="row section-gap">
            <button type="button" className="btn btn-primary" onClick={start}>{t('Play again', 'Играј повторно')}</button>
            <Link to="/play" className="btn btn-secondary">{t('Back to Play', 'Назад кон Игра')}</Link>
          </div>
        </div>
      </div>
    )
  }

  // run
  const trial = trials[i]
  return (
    <div className="container page">
      <div className="quiz-wrap">
        <div className="quiz-progress-meta">
          <span className="qp-pos">{i + 1} / {N_TRIALS}</span>
          <span className="qp-sec" style={{ color: 'var(--navy)' }}>{t('Tap the ink colour', 'Допри ја бојата на буквите')}</span>
        </div>
        <div className="progress-track" style={{ marginBottom: '24px' }}>
          <div className="progress-fill" style={{ width: `${(i / N_TRIALS) * 100}%` }} />
        </div>

        <div
          className="stroop-stage"
          style={{ borderColor: flash === 'ok' ? 'var(--ok)' : flash === 'no' ? 'var(--danger)' : 'var(--line)' }}
        >
          <span className="stroop-word" style={{ color: COLORS[trial.ink].hex }}>
            {name(COLORS[trial.word]).toUpperCase()}
          </span>
        </div>

        <div className="stroop-options">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c.key}
              className="stroop-btn"
              style={{ '--swatch': c.hex }}
              onClick={() => answer(c.key)}
            >
              <span className="stroop-swatch" />
              {name(c)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
