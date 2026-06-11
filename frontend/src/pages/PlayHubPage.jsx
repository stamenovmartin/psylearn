// Play — a hub for the interactive, lighter-touch parts of the platform:
// a choices game, perception illusions, the memory trainer and the Flow canvas.
import { Link } from 'react-router-dom'
import { OPTION_ART } from '../questionArt.jsx'
import { useLang } from '../i18n.jsx'

export default function PlayHubPage() {
  const { t } = useLang()

  const cards = [
    {
      to: '/stroop',
      icon: 'marker',
      title: t('Stroop Test', 'Струп тест'),
      text: t('Name the ink colour, not the word — a real attention test that measures the Stroop effect.', 'Именувај ја бојата на буквите, не зборот — вистински тест на вниманието што го мери Струп ефектот.'),
    },
    {
      to: '/reaction',
      icon: 'pulse',
      title: t('Reaction Time', 'Време на реакција'),
      text: t('Wait for green, tap fast. Measure your reaction time across five tries.', 'Чекај зелено, допри брзо. Измери го времето на реакција низ пет обиди.'),
    },
    {
      to: '/game',
      icon: 'compass',
      title: t('What would you do?', 'Што би направил?'),
      text: t('A scenario game about everyday situations — make choices, reflect on them.', 'Игра со сценарија од секојдневието — прави избори и размислувај за нив.'),
    },
    {
      to: '/perception',
      icon: 'grid',
      title: t('Perception illusions', 'Илузии на перцепција'),
      text: t('Classic optical illusions (rabbit–duck style) and what they reveal about the mind.', 'Класични оптички илузии (тип зајак–патка) и што откриваат за умот.'),
    },
    {
      to: '/trainer',
      icon: 'bulb',
      title: t('Memory Trainer', 'Тренер за меморија'),
      text: t('Practise memory techniques with an interactive recall drill and beat your best.', 'Вежбај техники за меморија со интерактивна вежба и надмини го најдоброто.'),
    },
    {
      to: '/flow',
      icon: 'pencil',
      title: t('Flow', 'Flow'),
      text: t('A calm drawing canvas to unwind and reset whenever you need a break.', 'Смирено платно за цртање за да се опуштиш кога ти треба пауза.'),
    },
  ]

  return (
    <div className="container page">
      <header style={{ marginBottom: '0.5rem' }}>
        <p className="eyebrow">{t('Play & relax', 'Играј и опушти се')}</p>
        <h1 style={{ maxWidth: '20ch' }}>{t('Learn through play', 'Учи преку игра')}</h1>
        <p className="lead" style={{ maxWidth: '60ch' }}>
          {t(
            'A lighter corner of the platform — games, illusions and calm activities that build wellbeing and self-awareness.',
            'Поразигран дел од платформата — игри, илузии и смирувачки активности што градат добросостојба и самосвест.',
          )}
        </p>
      </header>

      <div className="grid grid-2 section-gap">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="card card-hover card-link">
            <div className="learn-head">
              <span className="concept-icon draw" style={{ color: 'var(--navy)', background: 'var(--navy-tint)', borderColor: '#cdd8e6' }}>
                {OPTION_ART[c.icon] || OPTION_ART.bulb}
              </span>
              <div>
                <h3 style={{ margin: 0 }}>{c.title}</h3>
                <p className="muted" style={{ margin: '6px 0 0' }}>{c.text}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
