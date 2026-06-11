// A rotating "Did you know?" strip of real learning-science facts. Bilingual.
import { useEffect, useState } from 'react'
import { useLang } from '../i18n.jsx'

const FACTS = [
  ['Spreading study over several days (the "spacing effect") beats cramming — it’s one of the most reliable findings in memory research.', 'Распоредувањето на учењето низ повеќе денови („ефект на распоред“) победува над кампувањето — еден од најсигурните наоди во истражувањето на меморијата.'],
  ['Testing yourself (active recall) builds memory more than rereading — psychologists call it the "testing effect".', 'Самотестирањето (активно присетување) гради меморија повеќе од препрочитување — психолозите го нарекуваат „ефект на тестирање“.'],
  ['Sleep consolidates memory: studying then sleeping helps you keep more than an all-nighter ever could.', 'Сонот ја зацврстува меморијата: учење па спиење помага да задржиш повеќе отколку будна ноќ.'],
  ['The "forgetting curve" shows we forget fastest right after learning — a quick review the same day flattens it.', '„Кривата на заборавање“ покажува дека заборавуваме најбрзо веднаш по учењето — кратко повторување истиот ден ја израмнува.'],
  ['Teaching someone else (the "protégé effect") deepens your own understanding.', 'Предавањето на некој друг („ефект на протеже“) го продлабочува твоето разбирање.'],
  ['The method of loci — a "memory palace" — was used by ancient Greek and Roman orators to recall long speeches.', 'Методот на локации — „палата на меморијата“ — го користеле античките грчки и римски говорници за долги говори.'],
  ['Curiosity (intrinsic motivation) predicts deeper, longer-lasting learning than rewards alone.', 'Љубопитноста (внатрешна мотивација) предвидува подлабоко и потрајно учење отколку само наградите.'],
  ['Short breaks, like the Pomodoro technique, help you sustain attention across long sessions.', 'Кратки паузи, како Pomodoro техниката, помагаат да го задржиш вниманието низ долги сесии.'],
  ['Interleaving — mixing related topics — often beats studying one topic in a long block.', 'Преплетување — мешање поврзани теми — често е подобро од учење една тема во долг блок.'],
  ['A little stress can sharpen focus, but high stress narrows attention and hurts recall.', 'Малку стрес може да го изостри фокусот, но високиот стрес го стеснува вниманието и ѝ штети на меморијата.'],
  ['Asking "why" and connecting ideas (elaboration) builds stronger memories than rote repetition.', 'Прашувањето „зошто“ и поврзувањето идеи (разработка) гради посилни сеќавања од механичко повторување.'],
]

export default function DidYouKnow() {
  const { lang, t } = useLang()
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % FACTS.length), 7000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="dyk">
      <span className="dyk-badge">{t('Did you know?', 'Дали знаеше?')}</span>
      <p className="dyk-text" key={`${lang}-${i}`}>{lang === 'mk' ? FACTS[i][1] : FACTS[i][0]}</p>
      <button
        type="button"
        className="dyk-next"
        onClick={() => setI((v) => (v + 1) % FACTS.length)}
        aria-label={t('Next fact', 'Следен факт')}
      >
        →
      </button>
    </div>
  )
}
