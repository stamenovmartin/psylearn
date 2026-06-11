// Reaction Time — wait for green, then tap as fast as you can. Measures simple
// reaction time over several trials (a real measure used in psychology). Bilingual.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'

const N = 5

export default function ReactionGamePage() {
  const { t } = useLang()
  const [state, setState] = useState('idle') // idle | wait | go | tooSoon | done
  const [times, setTimes] = useState([])
  const timer = useRef(null)
  const goAt = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  function armNext() {
    setState('wait')
    const delay = 1200 + Math.random() * 3000
    timer.current = setTimeout(() => {
      goAt.current = performance.now()
      setState('go')
    }, delay)
  }

  function begin() {
    setTimes([])
    armNext()
  }

  function handleClick() {
    if (state === 'idle' || state === 'done') {
      begin()
      return
    }
    if (state === 'wait') {
      clearTimeout(timer.current)
      setState('tooSoon')
      return
    }
    if (state === 'go') {
      const rt = Math.round(performance.now() - goAt.current)
      const next = [...times, rt]
      setTimes(next)
      if (next.length >= N) setState('done')
      else armNext()
      return
    }
    if (state === 'tooSoon') {
      armNext()
    }
  }

  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0
  const best = times.length ? Math.min(...times) : 0

  const bg =
    state === 'go' ? '#2f9e6f' : state === 'wait' ? '#c0563f' : state === 'tooSoon' ? '#d99a3c' : 'var(--surface-2)'
  const fg = state === 'go' || state === 'wait' ? '#fff' : 'var(--ink)'

  const message = {
    idle: t('Tap to begin', 'Допри за почеток'),
    wait: t('Wait for green…', 'Чекај зелено…'),
    go: t('TAP!', 'ДОПРИ!'),
    tooSoon: t('Too soon — tap to retry', 'Прерано — допри за повторно'),
    done: t('Done! Tap to play again', 'Готово! Допри за повторно'),
  }[state]

  return (
    <div className="container page">
      <div className="quiz-wrap">
        <header style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <p className="eyebrow">{t('Cognitive test', 'Когнитивен тест')}</p>
          <h1>{t('Reaction Time', 'Време на реакција')}</h1>
          <p className="muted">{t('Wait for the green, then tap as fast as you can. Five tries.', 'Чекај да стане зелено, па допри што е можно побрзо. Пет обиди.')}</p>
        </header>

        <button type="button" className="reaction-area" style={{ background: bg, color: fg }} onClick={handleClick}>
          <span className="reaction-msg">{message}</span>
          {state === 'done' && (
            <span className="reaction-sub">{t('Average', 'Просек')}: {avg} ms · {t('Best', 'Најдобро')}: {best} ms</span>
          )}
          {(state === 'go' || state === 'wait') && (
            <span className="reaction-sub">{times.length} / {N}</span>
          )}
        </button>

        {times.length > 0 && state !== 'go' && state !== 'wait' && (
          <div className="card section-gap">
            <h3 style={{ marginTop: 0 }}>{t('Your times', 'Твои времиња')}</h3>
            <div className="row" style={{ gap: '8px' }}>
              {times.map((tm, k) => (
                <span className="badge" key={k}>{tm} ms</span>
              ))}
            </div>
            {state === 'done' && (
              <p className="muted" style={{ marginTop: '12px' }}>
                {t(
                  'Typical simple reaction time is around 200–300 ms. Tiredness and stress slow it down — another reason sleep and breaks matter.',
                  'Вообичаено време на реакција е околу 200–300 ms. Замор и стрес го забавуваат — уште една причина зошто сонот и паузите се важни.',
                )}
              </p>
            )}
          </div>
        )}

        <div className="row section-gap">
          <Link to="/play" className="btn btn-secondary">{t('Back to Play', 'Назад кон Игра')}</Link>
        </div>
        <div className="section-gap"><DisclaimerBanner compact /></div>
      </div>
    </div>
  )
}
