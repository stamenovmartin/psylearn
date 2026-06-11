// Landing page for PsyLearn Profiler.
// Introduces the app, what it explores, and how it works, then drives users
// toward the questionnaire. Purely presentational — no API calls.
import { Link } from 'react-router-dom'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'
import DidYouKnow from '../components/DidYouKnow.jsx'
import { useLang } from '../i18n.jsx'

const FEAT_MK = {
  Motivation: ['Мотивација', 'Што те движи во учењето — внатрешна љубопитност наспроти надворешни награди и притисок.'],
  'Learning style': ['Стил на учење', 'Дали се наклонуваш кон длабоко разбирање или површно меморирање, и колку си организиран.'],
  'Memory techniques': ['Меморсиски техники', 'Техники што може да ти одговараат: локации, асоцијации, приказна, први букви, повторување и предавање.'],
  Personality: ['Личност', 'Каде се наоѓаш на спектарот интроверт–амбиверт–екстроверт додека учиш.'],
  'Stress & emotions': ['Стрес и емоции', 'Како фрустрацијата и концентрацијата ги обликуваат сесиите за учење, со нежни совети.'],
}
const STEP_MK = {
  1: ['Одговори 30 прашања', 'Одговори на краток прашалник со Ликертова скала од 1 до 5. Трае само неколку минути.'],
  2: ['Модел ги чита одговорите', 'Лесен ML модел ги претвора одговорите во 16 под-скорови за психологија на учење.'],
  3: ['Добиј го профилот', 'Добиј профил со јасни графикони и персонализирани совети што можеш веднаш да ги пробаш.'],
}

// Shared SVG wrapper for the thin line icons used on the feature cards.
function Icon({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

// The five learning-psychology themes the profile explores.
const FEATURES = [
  {
    title: 'Motivation',
    text: 'What drives your studying — intrinsic curiosity versus extrinsic rewards and outside pressure.',
    icon: (
      <Icon>
        <polyline points="3 17 9 11 13 15 21 7" />
        <polyline points="15 7 21 7 21 13" />
      </Icon>
    ),
  },
  {
    title: 'Learning style',
    text: 'Whether you lean toward deep understanding or surface memorizing, and how organized your habits are.',
    icon: (
      <Icon>
        <path d="M12 6c-2-1.3-5-1.3-8-.8v13c3-.5 6-.5 8 .8 2-1.3 5-1.3 8-.8V5.2c-3-.5-6-.5-8 .8z" />
        <path d="M12 6v13.2" />
      </Icon>
    ),
  },
  {
    title: 'Memory techniques',
    text: 'Techniques that may fit you: method of loci, association, story, first-letter, repetition and teaching others.',
    icon: (
      <Icon>
        <polygon points="12 3 3 7.5 12 12 21 7.5 12 3" />
        <polyline points="3 16.5 12 21 21 16.5" />
        <polyline points="3 12 12 16.5 21 12" />
      </Icon>
    ),
  },
  {
    title: 'Personality',
    text: 'Where you sit on the introvert, ambivert and extrovert spectrum while learning.',
    icon: (
      <Icon>
        <circle cx="9" cy="12" r="6" />
        <circle cx="15" cy="12" r="6" />
      </Icon>
    ),
  },
  {
    title: 'Stress & emotions',
    text: 'How frustration and concentration shape your study sessions, with gentle coaching tips.',
    icon: (
      <Icon>
        <polyline points="3 12 7.5 12 10 5 14 19 16.5 12 21 12" />
      </Icon>
    ),
  },
]

// The three-step flow from questionnaire to personalized profile.
const STEPS = [
  {
    n: 1,
    title: 'Answer 30 questions',
    text: 'Respond to a short questionnaire using a simple Likert scale from 1 to 5. It only takes a few minutes.',
  },
  {
    n: 2,
    title: 'A model reads your answers',
    text: 'A lightweight ML model turns your responses into 16 learning-psychology sub-scores.',
  },
  {
    n: 3,
    title: 'Get your profile',
    text: 'Receive your learning profile with clear charts and personalized study tips you can try right away.',
  },
]

export default function HomePage() {
  const { lang, t } = useLang()
  return (
    <div className="container page">
      <section className="hero">
        <p className="eyebrow">{t('Youth wellbeing · inspired by WHO HBSC data', 'Младинска добросостојба · инспирирана од WHO HBSC')}</p>
        <h1 className="hero-title">{t('Learn well, feel well', 'Учи добро, чувствувај се добро')}</h1>
        <p className="hero-sub">
          {t(
            'A wellbeing platform for students, inspired by the HBSC study of young people’s health. Do a quick check-in to understand how you learn, handle stress and stay connected — then get techniques, a study plan and a calm space to unwind. Built around real youth-wellbeing data.',
            'Платформа за добросостојба за ученици, инспирирана од студијата HBSC за здравјето на младите. Направи брза проценка за да разбереш како учиш, како се справуваш со стрес и како остануваш поврзан — па добиј техники, план за учење и смирен простор за релаксација. Изградена врз реални податоци за младинска добросостојба.',
          )}
        </p>
        <div className="row" style={{ marginTop: '1.75rem' }}>
          <Link to="/survey" className="btn btn-primary btn-lg">
            {t('Start check-in', 'Започни проценка')}
          </Link>
          <Link to="/hbsc" className="btn btn-secondary">
            {t('Explore HBSC data', 'Истражи HBSC податоци')}
          </Link>
        </div>
      </section>

      <div className="section-gap">
        <DidYouKnow />
      </div>

      <div className="section-gap">
        <DisclaimerBanner />
      </div>

      <section className="section-gap">
        <p className="eyebrow">{t('What it explores', 'Што истражува')}</p>
        <h2>{t('Five dimensions of learning', 'Пет димензии на учењето')}</h2>
        <div className="grid grid-auto" style={{ marginTop: '1.5rem' }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="card card-hover">
              <div className="feature-icon">{f.icon}</div>
              <h3>{lang === 'mk' ? FEAT_MK[f.title][0] : f.title}</h3>
              <p className="muted">{lang === 'mk' ? FEAT_MK[f.title][1] : f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-gap">
        <p className="eyebrow">{t('How it works', 'Како функционира')}</p>
        <h2>{t('From answers to insight', 'Од одговори до увид')}</h2>
        <div className="grid grid-3" style={{ marginTop: '1.5rem' }}>
          {STEPS.map((s) => (
            <div key={s.n} className="card">
              <div className="result-icon" aria-hidden="true">
                {s.n}
              </div>
              <h3>{lang === 'mk' ? STEP_MK[s.n][0] : s.title}</h3>
              <p className="muted">{lang === 'mk' ? STEP_MK[s.n][1] : s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-gap">
        <p className="eyebrow">{t('More than a questionnaire', 'Повеќе од прашалник')}</p>
        <h2>{t('Explore, practice & inspect the model', 'Истражувај, вежбај и провери го моделот')}</h2>
        <div className="grid grid-auto" style={{ marginTop: '1.5rem' }}>
          <Link to="/hbsc" className="card card-hover card-link">
            <div className="feature-icon">
              <Icon>
                <line x1="8" y1="20" x2="8" y2="12" />
                <line x1="12" y1="20" x2="12" y2="6" />
                <line x1="16" y1="20" x2="16" y2="15" />
              </Icon>
            </div>
            <h3>{t('HBSC data', 'HBSC податоци')}</h3>
            <p className="muted">
              {t('Real WHO data on youth wellbeing — stress, sleep, bullying, activity — and how this app responds to it.', 'Реални WHO податоци за младинска добросостојба — стрес, сон, булинг, активност — и како оваа апликација реагира на нив.')}
            </p>
          </Link>
          <Link to="/wellness" className="card card-hover card-link">
            <div className="feature-icon">
              <Icon>
                <polyline points="3 12 7.5 12 10 5 14 19 16.5 12 21 12" />
              </Icon>
            </div>
            <h3>{t('Wellness', 'Добросостојба')}</h3>
            <p className="muted">
              {t('A daily mood diary and three quick wellness challenges — build a streak of healthy habits.', 'Дневник на расположение и три брзи предизвици — гради низа од здрави навики.')}
            </p>
          </Link>
          <Link to="/learn" className="card card-hover card-link">
            <div className="feature-icon">
              <Icon>
                <path d="M12 6c-2-1.3-5-1.3-8-.8v12c3-.5 6-.5 8 .8 2-1.3 5-1.3 8-.8V5.2c-3-.5-6-.5-8 .8z" />
                <path d="M12 6v13" />
              </Icon>
            </div>
            <h3>{t('Learn library', 'Библиотека Учи')}</h3>
            <p className="muted">
              {t('Plain-language explanations of every concept, plus a full toolbox of study and coping techniques.', 'Едноставни објаснувања за секој концепт, плус цела ризница од техники за учење и справување.')}
            </p>
          </Link>
          <Link to="/trainer" className="card card-hover card-link">
            <div className="feature-icon">
              <Icon>
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="4.5" />
              </Icon>
            </div>
            <h3>{t('Memory Trainer', 'Тренер за меморија')}</h3>
            <p className="muted">
              {t('Practice the recommended memory techniques with an interactive recall drill and track your best score.', 'Вежбај ги препорачаните техники со интерактивна вежба за присетување и следи го најдобриот резултат.')}
            </p>
          </Link>
          <Link to="/analytics" className="card card-hover card-link">
            <div className="feature-icon">
              <Icon>
                <line x1="8" y1="20" x2="8" y2="12" />
                <line x1="12" y1="20" x2="12" y2="6" />
                <line x1="16" y1="20" x2="16" y2="15" />
              </Icon>
            </div>
            <h3>{t('Community analytics', 'Аналитика на заедницата')}</h3>
            <p className="muted">
              {t('Anonymous, aggregate patterns across everyone who completed the survey.', 'Анонимни, збирни обрасци од сите што го решиле прашалникот.')}
            </p>
          </Link>
          <Link to="/model" className="card card-hover card-link">
            <div className="feature-icon">
              <Icon>
                <rect x="7" y="7" width="10" height="10" rx="1.5" />
                <line x1="10" y1="4" x2="10" y2="7" />
                <line x1="14" y1="4" x2="14" y2="7" />
                <line x1="10" y1="17" x2="10" y2="20" />
                <line x1="14" y1="17" x2="14" y2="20" />
                <line x1="4" y1="10" x2="7" y2="10" />
                <line x1="4" y1="14" x2="7" y2="14" />
                <line x1="17" y1="10" x2="20" y2="10" />
                <line x1="17" y1="14" x2="20" y2="14" />
              </Icon>
            </div>
            <h3>{t('Model insights', 'Анализа на моделот')}</h3>
            <p className="muted">
              {t('Look under the hood: accuracy, feature importance and confusion matrices.', 'Погледни зад кулисите: точност, важност на карактеристики и матрици на конфузија.')}
            </p>
          </Link>
        </div>
      </section>

      <section className="section-gap">
        <div className="card card-lg center">
          <h2>{t('Ready to discover your learning profile?', 'Подготвен да го откриеш твојот профил на учење?')}</h2>
          <p className="lead muted" style={{ maxWidth: '46ch', margin: '0 auto 1.5rem' }}>
            {t('Answer 30 short questions and get personalized, encouraging study tips.', 'Одговори на кратки прашања и добиј персонализирани, охрабрувачки совети за учење.')}
          </p>
          <Link to="/survey" className="btn btn-primary btn-lg">
            {t('Start questionnaire', 'Започни прашалник')}
          </Link>
        </div>
      </section>
    </div>
  )
}
