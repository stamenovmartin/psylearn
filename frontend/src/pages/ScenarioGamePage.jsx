// "What would you do?" — a choices-and-scenarios mini-game about everyday youth
// situations (stress, bullying, screen time, loneliness). Learning through play,
// inspired by HBSC themes. Bilingual (EN/MK).
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'

const SCENARIOS = [
  {
    id: 's1',
    prompt: { en: 'You have a big test tomorrow and suddenly feel panicky. What do you do?', mk: 'Утре имаш голем тест и одеднаш те фаќа паника. Што правиш?' },
    choices: [
      { en: 'Stay up all night cramming', mk: 'Учам цела ноќ без спиење', pts: 0,
        fb: { en: 'Cramming + no sleep usually hurts memory and focus the next day.', mk: 'Кампување без сон обично ѝ штети на меморијата и концентрацијата утредента.' } },
      { en: 'Study a bit, then sleep and breathe', mk: 'Учам малку, па спијам и дишам смирено', pts: 2,
        fb: { en: 'Great — sleep consolidates memory and calm breathing lowers panic.', mk: 'Одлично — сонот ја зацврстува меморијата, а смиреното дишење ја намалува паниката.' } },
      { en: 'Avoid it and hope for the best', mk: 'Го избегнувам и се надевам на најдоброто', pts: 0,
        fb: { en: 'Avoiding grows the dread. One tiny step now feels better than nothing.', mk: 'Избегнувањето го зголемува стравот. Еден мал чекор сега е подобар од ништо.' } },
    ],
  },
  {
    id: 's2',
    prompt: { en: 'You see a classmate being made fun of in a group chat. What do you do?', mk: 'Гледаш како исмеваат соученик во групен чат. Што правиш?' },
    choices: [
      { en: 'Stay silent so it isn’t my problem', mk: 'Молчам, не е мој проблем', pts: 0,
        fb: { en: 'Silence can feel safe, but support matters a lot to someone targeted.', mk: 'Молкот изгледа безбеден, но поддршката многу значи за тој што е мета.' } },
      { en: 'Message them kindly and tell a trusted adult', mk: 'Му пишувам љубезно и кажувам на возрасен од доверба', pts: 2,
        fb: { en: 'Kindness + telling someone you trust is exactly what helps most.', mk: 'Љубезност + кажување на некој од доверба е токму она што најмногу помага.' } },
      { en: 'Join in so I fit in', mk: 'Се приклучувам за да се вклопам', pts: 0,
        fb: { en: 'It might feel easier, but it deepens harm — and you’re better than that.', mk: 'Можеби изгледа полесно, но ја продлабочува штетата — а ти си подобар од тоа.' } },
    ],
  },
  {
    id: 's3',
    prompt: { en: 'It’s late and you’ve been scrolling for an hour. You feel restless. What now?', mk: 'Доцна е и веќе еден час скролаш. Се чувствуваш немирно. Што сега?' },
    choices: [
      { en: 'Keep scrolling, just five more minutes', mk: 'Продолжувам да скролам, само уште пет минути', pts: 0,
        fb: { en: 'Late screen time delays sleep and can lower next-day mood.', mk: 'Доцното време пред екран го одложува сонот и може да го влоши расположението утре.' } },
      { en: 'Put the phone in another room and wind down', mk: 'Го оставам телефонот во друга соба и се смирувам', pts: 2,
        fb: { en: 'Nice — a screen-free wind-down helps you fall asleep faster.', mk: 'Браво — смирување без екран помага побрзо да заспиеш.' } },
      { en: 'Open yet another app', mk: 'Отворам уште една апликација', pts: 0,
        fb: { en: 'More stimulation makes it harder to switch off. Try a calmer ritual.', mk: 'Повеќе стимулација отежнува смирување. Пробај помирен ритуал.' } },
    ],
  },
  {
    id: 's4',
    prompt: { en: 'You’ve felt lonely lately. A free afternoon comes up. What do you choose?', mk: 'Во последно време се чувствуваш осамено. Имаш слободно попладне. Што избираш?' },
    choices: [
      { en: 'Stay in and keep to myself', mk: 'Си стојам дома и се повлекувам', pts: 0,
        fb: { en: 'Rest is fine, but isolation can quietly grow loneliness.', mk: 'Одморот е во ред, но изолацијата тивко ја зголемува осаменоста.' } },
      { en: 'Message someone or join an activity', mk: 'Пишувам некому или се вклучувам во активност', pts: 2,
        fb: { en: 'Even a small connection lifts mood — reaching out is brave and helps.', mk: 'И мала врска го подобрува расположението — да се јавиш е храбро и помага.' } },
      { en: 'Wait for someone to message me first', mk: 'Чекам некој прв да ми се јави', pts: 1,
        fb: { en: 'Understandable — but you’re allowed to reach out first, too.', mk: 'Разбирливо — но и ти смееш прв да се јавиш.' } },
    ],
  },
  {
    id: 's5',
    prompt: { en: 'Your to-do list feels huge and you’re frozen. What’s your move?', mk: 'Списокот со обврски ти изгледа огромен и си замрзнат. Кој е твојот потег?' },
    choices: [
      { en: 'Panic and do nothing', mk: 'Паничам и не правам ништо', pts: 0,
        fb: { en: 'Freezing is a normal stress response — but tiny steps melt it.', mk: 'Замрзнувањето е нормална реакција на стрес — но малите чекори го топат.' } },
      { en: 'Pick one tiny task and start', mk: 'Избирам една мала задача и почнувам', pts: 2,
        fb: { en: 'Perfect — momentum from one small win makes the rest feel doable.', mk: 'Совршено — замавот од една мала победа го прави остатокот возможен.' } },
      { en: 'Ask someone to help me plan', mk: 'Барам некој да ми помогне да испланирам', pts: 2,
        fb: { en: 'Asking for help is a strength, not a weakness. Great choice.', mk: 'Барањето помош е сила, не слабост. Одличен избор.' } },
    ],
  },
]

export default function ScenarioGamePage() {
  const { lang, t } = useLang()
  const pick = (o) => (lang === 'mk' && o && o.mk != null ? o.mk : o.en)

  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [done, setDone] = useState(false)

  const total = SCENARIOS.length
  const max = total * 2
  const scenario = SCENARIOS[i]

  function choose(idx) {
    if (chosen !== null) return
    setChosen(idx)
    setScore((s) => s + scenario.choices[idx].pts)
  }
  function next() {
    if (i < total - 1) {
      setI(i + 1)
      setChosen(null)
    } else {
      setDone(true)
    }
  }
  function restart() {
    setI(0); setScore(0); setChosen(null); setDone(false)
  }

  if (done) {
    const pct = Math.round((score / max) * 100)
    const msg =
      pct >= 80
        ? t('You leaned into healthy, kind choices. Keep it up!', 'Избираше здрави, љубезни одлуки. Само така!')
        : pct >= 50
          ? t('A solid mix — small tweaks can make hard days easier.', 'Солидно — мали промени ги олеснуваат тешките денови.')
          : t('Tough situations are hard. Every tiny step counts — be kind to yourself.', 'Тешките ситуации се тешки. Секој мал чекор е важен — биди добар кон себе.')
    return (
      <div className="container page">
        <div className="quiz-wrap">
          <div className="summary-banner">
            <h2>{t('Nice reflecting', 'Браво за размислувањето')}</h2>
            <p className="lead">{msg}</p>
          </div>
          <div className="row" style={{ marginTop: '20px' }}>
            <button type="button" className="btn btn-primary" onClick={restart}>{t('Play again', 'Играј повторно')}</button>
            <Link to="/wellness" className="btn btn-secondary">{t('Wellness tools', 'Алатки за добросостојба')}</Link>
            <Link to="/learn" className="btn btn-ghost">{t('Learn more', 'Научи повеќе')}</Link>
          </div>
          <div className="section-gap"><DisclaimerBanner compact /></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container page">
      <div className="quiz-wrap">
        <header style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <p className="eyebrow">{t('Mini-game · learning through play', 'Мини-игра · учење преку игра')}</p>
          <h1>{t('What would you do?', 'Што би направил?')}</h1>
          <p className="muted">{t('Real situations, your call. There are kinder, healthier options — see if you can spot them.', 'Реални ситуации, твој избор. Има поздрави, полјубезни опции — обиди се да ги препознаеш.')}</p>
        </header>

        <div className="quiz-progress-meta">
          <span className="qp-pos">{t('Situation', 'Ситуација')} {i + 1} / {total}</span>
          <span className="qp-sec" style={{ color: 'var(--navy)' }}>{t('Answer honestly', 'Одговори искрено')}</span>
        </div>
        <div className="progress-track" style={{ marginBottom: '22px' }}>
          <div className="progress-fill" style={{ width: `${((i + (chosen !== null ? 1 : 0)) / total) * 100}%` }} />
        </div>

        <div className="quiz-card in-next" key={scenario.id} style={{ textAlign: 'left' }}>
          <h3 style={{ marginTop: 0 }}>{pick(scenario.prompt)}</h3>
          <div className="stack" style={{ gap: '10px', marginTop: '14px' }}>
            {scenario.choices.map((c, idx) => {
              const isChosen = chosen === idx
              const reveal = chosen !== null
              return (
                <button
                  type="button"
                  key={idx}
                  className={`challenge${isChosen ? ' done' : ''}`}
                  style={{
                    cursor: reveal ? 'default' : 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    borderColor: isChosen ? 'var(--navy)' : undefined,
                    opacity: reveal && !isChosen ? 0.55 : 1,
                  }}
                  onClick={() => choose(idx)}
                >
                  <span className="ch-text" style={{ fontWeight: 600 }}>{pick(c)}</span>
                </button>
              )
            })}
          </div>

          {chosen !== null && (
            <div className="learn-example" style={{ marginTop: '16px', borderColor: 'var(--line-strong)' }}>
              <p style={{ margin: 0 }}>{pick(scenario.choices[chosen].fb)}</p>
            </div>
          )}

          {chosen !== null && (
            <div className="row" style={{ marginTop: '16px' }}>
              <button type="button" className="btn btn-primary" onClick={next}>
                {i < total - 1 ? t('Next', 'Следно') : t('See result', 'Види резултат')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
