// Daily wellness challenges — three rotating wellbeing tasks each day, inspired
// by HBSC themes. Completing them counts toward the wellness streak. Bilingual.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { OPTION_ART } from '../questionArt.jsx'
import { bumpWellnessStreak } from '../streaks.js'
import { useLang } from '../i18n.jsx'

const CH_KEY = 'psylearn_challenges'

const POOL = [
  { id: 'move', en: 'Move your body for 10 minutes', mk: 'Движи се 10 минути', icon: 'pulse' },
  { id: 'outside', en: 'Step outside for some fresh air', mk: 'Излези на свеж воздух', icon: 'leaf' },
  { id: 'water', en: 'Drink a glass of water', mk: 'Испиј чаша вода', icon: 'wave' },
  { id: 'connect', en: 'Message a friend or family member', mk: 'Напиши на пријател или член на семејството', icon: 'group' },
  { id: 'unplug', en: 'Put your phone away for 30 minutes', mk: 'Остави го телефонот 30 минути', icon: 'grid' },
  { id: 'breathe', en: 'Do 4 rounds of box breathing', mk: 'Направи 4 круга „кутиско“ дишење', icon: 'balance' },
  { id: 'gratitude', en: 'Write down one thing you are grateful for', mk: 'Запиши една работа за која си благодарен', icon: 'note' },
  { id: 'tidy', en: 'Tidy your study space for 5 minutes', mk: 'Расчисти го просторот за учење 5 минути', icon: 'folder' },
  { id: 'sleep', en: 'Plan to go to bed 30 minutes earlier', mk: 'Планирај да легнеш 30 минути порано', icon: 'alarm' },
  { id: 'flow', en: 'Spend 5 minutes drawing in Flow', mk: 'Цртај 5 минути во Flow', icon: 'pencil', to: '/flow' },
  { id: 'learn', en: "Read today's concept in Learn", mk: 'Прочитај го денешниот концепт во Учи', icon: 'book', to: '/learn' },
  { id: 'stretch', en: 'Stretch for 5 minutes', mk: 'Истегни се 5 минути', icon: 'compass' },
  { id: 'kind', en: 'Say something kind to someone', mk: 'Кажи нешто љубезно некому', icon: 'pair' },
  { id: 'screenfree', en: 'Take a screen-free break', mk: 'Земи пауза без екран', icon: 'solo' },
]

function dstr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function loadDone() {
  try {
    const raw = localStorage.getItem(CH_KEY)
    const p = raw ? JSON.parse(raw) : {}
    return p && typeof p === 'object' ? p : {}
  } catch {
    return {}
  }
}

export default function DailyChallenges() {
  const { lang, t } = useLang()
  const today = dstr(new Date())
  const [done, setDone] = useState(loadDone)

  const dayIndex = Math.floor(Date.now() / 86400000)
  const start = (dayIndex * 3) % POOL.length
  const todays = [POOL[start % POOL.length], POOL[(start + 1) % POOL.length], POOL[(start + 2) % POOL.length]]
  const doneToday = new Set(done[today] || [])

  function toggle(id) {
    setDone((prev) => {
      const set = new Set(prev[today] || [])
      if (set.has(id)) set.delete(id)
      else set.add(id)
      const next = { ...prev, [today]: Array.from(set) }
      try {
        localStorage.setItem(CH_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      if (set.size > 0) bumpWellnessStreak()
      return next
    })
  }

  const completed = todays.filter((c) => doneToday.has(c.id)).length

  return (
    <div className="card">
      <div className="spread">
        <h3 style={{ margin: 0 }}>{t("Today's wellness challenges", 'Денешни предизвици за добросостојба')}</h3>
        <span className="badge">{completed}/{todays.length} {t('done', 'завршени')}</span>
      </div>
      <p className="muted" style={{ margin: '6px 0 14px' }}>
        {t('Three small steps for a healthier day. Check them off as you go.', 'Три мали чекори за поздрав ден. Чекирај ги како што напредуваш.')}
      </p>
      <div className="stack" style={{ gap: '10px' }}>
        {todays.map((c) => {
          const isDone = doneToday.has(c.id)
          return (
            <div className={`challenge${isDone ? ' done' : ''}`} key={c.id}>
              <button type="button" className="ch-check" onClick={() => toggle(c.id)} aria-label={isDone ? 'done' : 'mark'}>
                {isDone ? '✓' : ''}
              </button>
              <span className="ch-icon">{OPTION_ART[c.icon] || OPTION_ART.bulb}</span>
              <span className="ch-text">{lang === 'mk' ? c.mk : c.en}</span>
              {c.to && (
                <Link to={c.to} className="btn btn-ghost" style={{ marginLeft: 'auto', padding: '4px 10px' }}>
                  {t('Open', 'Отвори')}
                </Link>
              )}
            </div>
          )
        })}
      </div>
      {completed === todays.length && (
        <p className="learned-tag" style={{ marginTop: '14px' }}>
          ✓ {t('All done today — lovely work. New challenges tomorrow!', 'Сè завршено денес — браво. Нови предизвици утре!')}
        </p>
      )}
    </div>
  )
}
