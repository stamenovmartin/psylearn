// Memory Trainer — an interactive drill to practice the memory techniques the
// profiler recommends. Study a list of words using a chosen technique, then
// recall as many as you can. Scores (best per technique) are kept locally.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadResult, memoryMethodTitle } from '../utils.js'
import { bumpTrainerStreak, getTrainerStreak } from '../streaks.js'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'
import { useLang } from '../i18n.jsx'

const WORD_BANK = [
  'anchor', 'lantern', 'meadow', 'compass', 'velvet', 'harbor', 'pebble', 'cinnamon',
  'glacier', 'thunder', 'ribbon', 'orchard', 'marble', 'feather', 'cavern', 'willow',
  'beacon', 'saffron', 'canyon', 'lantern', 'maple', 'quartz', 'breeze', 'ember',
  'pelican', 'violet', 'tunnel', 'almond', 'comet', 'harvest', 'mirror', 'jungle',
  'pottery', 'sparrow', 'crystal', 'meadow', 'bonfire', 'acorn', 'dolphin', 'planet',
]

const TECHNIQUES = [
  { key: 'method_of_loci', tip: 'Imagine walking through your home. Place each word in a specific room or spot. To recall, take the same walk again.', tipMk: 'Замисли дека одиш низ твојот дом. Смести го секој збор во одредена соба или место. За присетување, повтори ја истата прошетка.' },
  { key: 'association_method', tip: 'Link each word to the next with a vivid, even silly, mental image connecting them.', tipMk: 'Поврзи го секој збор со следниот преку жива, дури и смешна ментална слика.' },
  { key: 'story_method', tip: 'Weave all the words into one continuous story, keeping them in order.', tipMk: 'Сплети ги сите зборови во една непрекината приказна, по редослед.' },
  { key: 'first_letter_method', tip: 'Take the first letter of each word and form a phrase or acronym you can remember.', tipMk: 'Земи ја првата буква од секој збор и состави фраза или акроним.' },
  { key: 'repetition', tip: 'Repeat the list out loud in small chunks of 3–4 words, several times.', tipMk: 'Повторувај ја листата на глас во мали групи од 3–4 зборови, неколку пати.' },
  { key: 'teach_someone_else', tip: 'Pretend you are teaching the list — say each word and a reason it matters.', tipMk: 'Замисли дека ја предаваш листата — кажи го секој збор и причина зошто е важен.' },
]

const COUNTS = [
  { label: 'Easy', mk: 'Лесно', n: 8 },
  { label: 'Medium', mk: 'Средно', n: 12 },
  { label: 'Hard', mk: 'Тешко', n: 16 },
]

const BEST_KEY = 'psylearn_trainer_best'

function loadBest() {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY) || '{}')
  } catch {
    return {}
  }
}

function sample(n) {
  const pool = Array.from(new Set(WORD_BANK))
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, n)
}

export default function TrainerPage() {
  const { lang, t: tr } = useLang()
  const recommended = loadResult()?.predictions?.recommended_memory_method
  const [technique, setTechnique] = useState(recommended || 'method_of_loci')
  const [count, setCount] = useState(8)
  const [phase, setPhase] = useState('setup') // setup | study | recall | result
  const [items, setItems] = useState([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [recall, setRecall] = useState('')
  const [best, setBest] = useState(loadBest)
  const [streak, setStreak] = useState(getTrainerStreak)

  const techObj = TECHNIQUES.find((x) => x.key === technique)
  const tip = (lang === 'mk' ? techObj?.tipMk : techObj?.tip) || ''

  // Study-phase countdown.
  useEffect(() => {
    if (phase !== 'study') return undefined
    if (timeLeft <= 0) {
      setPhase('recall')
      return undefined
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, timeLeft])

  function start() {
    setItems(sample(count))
    setRecall('')
    setTimeLeft(count * 4)
    setPhase('study')
  }

  function finishStudy() {
    setTimeLeft(0)
    setPhase('recall')
  }

  // Score the recall.
  const recalledSet = new Set(
    recall
      .split(/[\n,]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  )
  const correct = items.filter((w) => recalledSet.has(w))
  const missed = items.filter((w) => !recalledSet.has(w))
  const scorePct = items.length ? Math.round((correct.length / items.length) * 100) : 0

  function submitRecall() {
    setPhase('result')
    setStreak(bumpTrainerStreak())
    setBest((prev) => {
      const nextBest = { ...prev }
      if (!nextBest[technique] || scorePct > nextBest[technique]) {
        nextBest[technique] = scorePct
        try {
          localStorage.setItem(BEST_KEY, JSON.stringify(nextBest))
        } catch {
          /* ignore */
        }
      }
      return nextBest
    })
  }

  function reset() {
    setPhase('setup')
    setItems([])
    setRecall('')
  }

  return (
    <div className="container page">
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="eyebrow">{tr('Practice lab', 'Лабораторија за вежбање')}</p>
        <h1 style={{ maxWidth: '20ch' }}>{tr('Memory Trainer', 'Тренер за меморија')}</h1>
        <p className="lead" style={{ maxWidth: '60ch' }}>
          {tr(
            'Turn theory into practice. Pick a memory technique, study a short list of words, then recall as many as you can. Train the method your profile recommends — or any other.',
            'Претвори ја теоријата во пракса. Избери меморсиска техника, проучи кратка листа зборови, па присети се на што повеќе. Вежбај го методот што го препорачува твојот профил — или било кој друг.',
          )}
        </p>
        <span className="pill" title={tr('Train at least once a day to grow your streak', 'Вежбај барем еднаш на ден за да расте низата')} style={{ color: 'var(--ochre-deep)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3.2 2-4 0 1.2.7 2 1.6 2C13 9 12 6 12 3z" />
          </svg>
          {streak}{tr('-day training streak', '-дневна низа на тренинг')}
        </span>
      </header>

      {/* SETUP */}
      {phase === 'setup' && (
        <div className="stack" style={{ gap: '28px' }}>
          <section>
            <div className="section-eyebrow">
              <span className="sec-no">01</span>
              <h2>{tr('Choose a technique', 'Избери техника')}</h2>
            </div>
            <div className="grid grid-3">
              {TECHNIQUES.map((t) => {
                const isSel = t.key === technique
                const isRec = t.key === recommended
                return (
                  <button
                    type="button"
                    key={t.key}
                    className={`card card-hover technique-option${isSel ? ' selected' : ''}`}
                    onClick={() => setTechnique(t.key)}
                  >
                    <div className="spread">
                      <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{memoryMethodTitle(t.key)}</h3>
                      {isRec && <span className="badge badge-accent">{tr('For you', 'За тебе')}</span>}
                    </div>
                    <p className="muted" style={{ margin: '8px 0 0', fontSize: '0.88rem' }}>{lang === 'mk' ? t.tipMk : t.tip}</p>
                    {best[t.key] != null && (
                      <p className="muted" style={{ margin: '8px 0 0', fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
                        {tr('Best', 'Најдобро')}: {best[t.key]}%
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <div className="section-eyebrow">
              <span className="sec-no">02</span>
              <h2>{tr('Choose a difficulty', 'Избери тежина')}</h2>
            </div>
            <div className="row">
              {COUNTS.map((c) => (
                <button
                  type="button"
                  key={c.n}
                  className={`btn ${count === c.n ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCount(c.n)}
                >
                  {lang === 'mk' ? c.mk : c.label} · {c.n} {tr('words', 'зборови')}
                </button>
              ))}
            </div>
          </section>

          <div>
            <button type="button" className="btn btn-primary btn-lg" onClick={start}>
              {tr('Start training', 'Започни тренинг')}
            </button>
          </div>
          <DisclaimerBanner compact />
        </div>
      )}

      {/* STUDY */}
      {phase === 'study' && (
        <div className="stack" style={{ gap: '20px' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--ochre)' }}>
            <div className="spread">
              <div>
                <p className="eyebrow" style={{ margin: 0 }}>{memoryMethodTitle(technique)}</p>
                <p style={{ margin: '6px 0 0' }}>{tip}</p>
              </div>
              <div className="trainer-timer">{timeLeft}s</div>
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>{tr('Memorize these', 'Запомни ги овие')} {items.length} {tr('words', 'зборови')}</h3>
            <div className="trainer-words">
              {items.map((w, i) => (
                <span className="word-chip" key={i}>
                  <span className="word-idx">{i + 1}</span>
                  {w}
                </span>
              ))}
            </div>
          </div>
          <div className="row">
            <button type="button" className="btn btn-primary" onClick={finishStudy}>
              {tr('I’m ready — hide & recall', 'Готов сум — сокриј и присети се')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={reset}>
              {tr('Cancel', 'Откажи')}
            </button>
          </div>
        </div>
      )}

      {/* RECALL */}
      {phase === 'recall' && (
        <div className="stack" style={{ gap: '20px' }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>{tr('Type every word you remember', 'Напиши го секој збор што го паметиш')}</h3>
            <p className="muted">{tr('One per line (or separated by commas). Order doesn’t matter.', 'Еден по ред (или одвоени со запирки). Редоследот не е важен.')}</p>
            <textarea
              className="trainer-input"
              value={recall}
              onChange={(e) => setRecall(e.target.value)}
              rows={8}
              autoFocus
              placeholder="anchor&#10;lantern&#10;meadow…"
            />
            <div className="row" style={{ marginTop: '14px' }}>
              <button type="button" className="btn btn-primary" onClick={submitRecall}>
                {tr('Check my recall', 'Провери го присетувањето')}
              </button>
              <button type="button" className="btn btn-ghost" onClick={reset}>
                {tr('Cancel', 'Откажи')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESULT */}
      {phase === 'result' && (
        <div className="stack" style={{ gap: '20px' }}>
          <div className="summary-banner">
            <div className="report-meta">
              <span className="report-stamp">{memoryMethodTitle(technique)}</span>
              <span className="report-stamp">{tr('Best', 'Најдобро')}: {best[technique] ?? scorePct}%</span>
            </div>
            <h2 style={{ marginBottom: 0 }}>
              {tr('You recalled', 'Се присети на')} {correct.length} {tr('of', 'од')} {items.length} — {scorePct}%
            </h2>
          </div>

          <div className="grid grid-2">
            <div className="card">
              <h3 style={{ marginTop: 0 }}>{tr('Recalled correctly', 'Точно присетени')} ({correct.length})</h3>
              <div className="trainer-words">
                {correct.length ? (
                  correct.map((w, i) => (
                    <span className="word-chip ok" key={i}>{w}</span>
                  ))
                ) : (
                  <p className="muted">{tr('None this time — try a different technique.', 'Ниту еден овој пат — пробај друга техника.')}</p>
                )}
              </div>
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>{tr('Missed', 'Промашени')} ({missed.length})</h3>
              <div className="trainer-words">
                {missed.length ? (
                  missed.map((w, i) => (
                    <span className="word-chip miss" key={i}>{w}</span>
                  ))
                ) : (
                  <p className="muted">{tr('Perfect recall — outstanding!', 'Совршено присетување — одлично!')}</p>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <button type="button" className="btn btn-primary" onClick={start}>
              {tr('Try again', 'Обиди се повторно')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={reset}>
              {tr('Change technique', 'Смени техника')}
            </button>
            <Link className="btn btn-ghost" to="/results">
              {tr('Back to my profile', 'Назад кон мојот профил')}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
