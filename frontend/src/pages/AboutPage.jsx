// About & Disclaimer — presented as a short scholarly document with a sticky
// "spec sheet" sidebar, numbered sections and an ML pipeline diagram.
import { Link } from 'react-router-dom'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'
import { useLang } from '../i18n.jsx'

const CONCEPTS = [
  ['Learning & motivation', 'what turns study effort on', 'Учење и мотивација', 'што го поттикнува трудот за учење'],
  ['Intrinsic vs. extrinsic motivation', 'interest and growth vs. rewards', 'Внатрешна наспроти надворешна мотивација', 'интерес и раст наспроти награди'],
  ['Learning vs. performance goals', 'mastery vs. comparison; avoidance', 'Цели на учење наспроти изведба', 'совладување наспроти споредба; избегнување'],
  ['Memory & forgetting', 'how information is retained', 'Меморија и заборавање', 'како се задржува информацијата'],
  ['Memory techniques', 'loci, association, story, first-letter, repetition', 'Меморсиски техники', 'локации, асоцијации, приказна, први букви, повторување'],
  ['Emotions, frustration & stress', 'their effect on concentration', 'Емоции, фрустрација и стрес', 'нивно влијание врз концентрацијата'],
  ['Personality', 'introversion–extraversion, Big-Five-style traits', 'Личност', 'интроверзија–екстраверзија, црти од типот Big Five'],
  ['Self-perception in learning', 'how you see yourself while studying', 'Само-перцепција во учењето', 'како се гледаш себеси додека учиш'],
]

const SPEC = [
  ['Type', 'Educational prototype', 'Тип', 'Едукативен прототип'],
  ['Model', 'RandomForest ×6', 'Модел', 'RandomForest ×6'],
  ['Features', '16 sub-scores', 'Карактеристики', '16 под-скорови'],
  ['Targets', '6 profiles', 'Таргети', '6 профили'],
  ['Training data', '3,000 synthetic', 'Податоци', '3.000 синтетички'],
  ['Library', 'scikit-learn', 'Библиотека', 'scikit-learn'],
  ['Storage', 'SQLite (anonymous)', 'Складирање', 'SQLite (анонимно)'],
  ['Version', '1.0', 'Верзија', '1.0'],
]

const PIPELINE = [
  ['01', 'Answer', '30 Likert statements, each rated 1–5.', 'Одговори', '30 Ликертови тврдења, секое оценето 1–5.'],
  ['02', 'Score', '16 learning-psychology sub-scores are computed.', 'Скорирај', 'Се пресметуваат 16 под-скорови за психологија на учење.'],
  ['03', 'Classify', 'A RandomForest model predicts each of 6 targets.', 'Класифицирај', 'RandomForest модел предвидува за секој од 6 таргети.'],
  ['04', 'Profile', 'You get 6 predictions, explanations and study tips.', 'Профил', 'Добиваш 6 предвидувања, објаснувања и совети за учење.'],
]

export default function AboutPage() {
  const { lang, t } = useLang()
  const mk = lang === 'mk'
  return (
    <div className="container page">
      <header className="hero">
        <p className="eyebrow">{t('PNUV assignment · inspired by WHO HBSC', 'ПНУВ задача · инспирирана од WHO HBSC')}</p>
        <h1 style={{ maxWidth: '18ch' }}>{t('About & the project', 'За проектот')}</h1>
        <p className="hero-sub">
          {t(
            'PsyLearn is a student digital solution for the PNUV course, inspired by the HBSC study of young people’s health and wellbeing. It turns real youth-wellbeing data into an interactive, supportive platform for students.',
            'PsyLearn е студентско дигитално решение за предметот ПНУВ, инспирирано од студијата HBSC за здравјето и добросостојбата на младите. Реалните податоци за младинска добросостојба ги претвора во интерактивна, поддржувачка платформа за ученици.',
          )}
        </p>
      </header>

      {/* Project brief: problem -> idea -> impact (assignment requirement) */}
      <section className="section-gap">
        <p className="eyebrow">{t('The project', 'Проектот')}</p>
        <h2>{t('Problem → idea → impact', 'Проблем → идеја → влијание')}</h2>
        <div className="grid grid-2" style={{ marginTop: '1rem' }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>{t('1 · The problem (from HBSC)', '1 · Проблемот (од HBSC)')}</h3>
            <p className="muted">
              {t(
                'HBSC 2021/2022 data show adolescent wellbeing is under strain: 1 in 3 teens feel nervous or irritable weekly, 29% have sleep difficulties, 1 in 6 have been cyberbullied, problematic social-media use rose from 7% to 11%, and 1 in 4 girls aged 15 feel lonely often. Many young people don’t notice stress early or know simple, non-clinical ways to cope.',
                'Податоците од HBSC 2021/2022 покажуваат дека добросостојбата на адолесцентите е под притисок: 1 од 3 тинејџери се нервозни или раздразливи неделно, 29% имаат проблеми со сон, 1 од 6 биле жртви на сајбер-булинг, проблематичната употреба на соц. мрежи порасна од 7% на 11%, а 1 од 4 девојчиња на 15 години често се чувствуваат осамено. Многу млади не го забележуваат стресот навреме, ниту знаат едноставни, не-клинички начини за справување.',
              )}
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>{t('2 · Who it’s for', '2 · За кого е')}</h3>
            <p className="muted">
              {t(
                'Secondary-school students and young people (the HBSC 11–15 age group and a little older). The tone is youth-friendly, calm and judgment-free, and the whole app is free and anonymous — no account, no personal data.',
                'Средношколци и млади (HBSC возрасната група 11–15 и малку постари). Тонот е пријателски, смирен и без осудување, а целата апликација е бесплатна и анонимна — без сметка, без лични податоци.',
              )}
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>{t('3 · How the solution works', '3 · Како функционира решението')}</h3>
            <p className="muted">
              {t('A quick check-in builds a personal wellbeing & learning profile (a lightweight ML model). From there you get tailored coping techniques, a study plan, daily wellness challenges and a mood diary, a calm Flow drawing space, a Learn library, and an HBSC data dashboard. Streaks keep it engaging.',
                'Брза проценка гради личен профил на добросостојба и учење (лесен ML модел). Оттаму добиваш техники за справување, план за учење, дневни предизвици и дневник на расположение, смирен Flow простор за цртање, библиотека Учи и HBSC dashboard. Низите го прават ангажирачко.')}
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>{t('4 · Expected impact', '4 · Очекувано влијание')}</h3>
            <p className="muted">
              {t(
                'Raise awareness with real data, help students notice stress early, and nudge healthy daily habits (sleep, movement, connection, offline time) through small, repeatable actions — building wellbeing and self-awareness over time.',
                'Подигање на свесност со реални податоци, помош учениците навреме да го забележат стресот и поттик за здрави дневни навики (сон, движење, поврзаност, време офлајн) преку мали, повторливи дејства — градејќи добросостојба и самосвест со текот на времето.',
              )}
            </p>
          </div>
        </div>
        <p className="muted" style={{ marginTop: '14px', fontSize: '0.9rem' }}>
          <strong>{t('Solution types covered:', 'Опфатени типови решенија:')}</strong> {t('interactive web app · HBSC data dashboard · data-driven ML profile & recommendations · gamification (streaks, challenges).', 'интерактивна веб-апликација · HBSC dashboard · ML профил и препораки · геймификација (низи, предизвици).')}
          <strong> {t('Research basis:', 'Истражувачка основа:')}</strong> {t('real HBSC 2021/2022 figures and a public Big Five dataset (19,719 people) — see the', 'реални бројки од HBSC 2021/2022 и јавна Big Five база (19.719 луѓе) — види')} <Link to="/hbsc">{t('HBSC dashboard', 'HBSC dashboard')}</Link> {t('for sources.', 'за извори.')}
        </p>
      </section>

      {/* Prominent disclaimer */}
      <div
        className="card section-gap"
        style={{ borderLeft: '4px solid var(--ochre)' }}
      >
        <p className="eyebrow" style={{ marginBottom: '8px' }}>{t('Important disclaimer', 'Важна напомена')}</p>
        <p className="lead" style={{ margin: 0 }}>
          {t(
            'This application is an educational prototype for a psychology/machine learning student project. It is not a clinical psychological assessment, diagnosis, therapy tool or professional evaluation. Results are approximate and based on a lightweight ML model trained on synthetic educational data.',
            'Оваа апликација е едукативен прототип за студентски проект по психологија/машинско учење. Не е клиничка психолошка проценка, дијагноза, алатка за терапија или професионална евалуација. Резултатите се приближни и се базираат на лесен ML модел трениран на синтетички едукативни податоци.',
          )}
        </p>
      </div>

      <div className="survey-layout section-gap">
        {/* Sticky spec sheet */}
        <aside className="survey-aside">
          <div className="survey-panel">
            <p className="eyebrow" style={{ marginBottom: '14px' }}>{t('At a glance', 'На прв поглед')}</p>
            {SPEC.map(([k, v, kMk, vMk]) => (
              <div className="specrow" key={k}>
                <span className="k">{mk ? kMk : k}</span>
                <span className="v">{mk ? vMk : v}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Document body */}
        <div className="stack" style={{ gap: '40px' }}>
          <section>
            <div className="section-eyebrow">
              <span className="sec-no">01</span>
              <h2>{t('What this is', 'Што е ова')}</h2>
            </div>
            <p className="muted">
              {t('A student digital solution for the psychology (PNUV) course, inspired by the WHO HBSC study of youth health and wellbeing. It addresses topics like stress, sleep, social connection and digital balance: a short check-in becomes a personalized profile with techniques, a study plan and a calm Flow space, alongside a dashboard of real HBSC data.',
                'Студентско дигитално решение за предметот психологија (ПНУВ), инспирирано од WHO HBSC студијата за здравјето и добросостојбата на младите. Опфаќа теми како стрес, сон, социјална поврзаност и дигитална рамнотежа: кратка проценка станува персонализиран профил со техники, план за учење и смирен Flow простор, заедно со dashboard со реални HBSC податоци.')}{' '}
              (<Link to="/hbsc">HBSC dashboard</Link>)
            </p>
            <p className="muted">
              {t('It is a learning exercise and awareness tool, not a diagnostic or medical instrument — treat every result as a friendly prompt for reflection rather than an official measurement of who you are.',
                'Тоа е вежба за учење и алатка за свесност, не дијагностички или медицински инструмент — гледај го секој резултат како пријателски повод за размислување, а не како официјална мерка за тоа кој си.')}
            </p>
          </section>

          <section>
            <div className="section-eyebrow">
              <span className="sec-no">02</span>
              <h2>{t('Psychology concepts used', 'Користени концепти од психологија')}</h2>
            </div>
            <div className="card">
              {CONCEPTS.map(([name, gloss, nameMk, glossMk]) => (
                <div className="concept-row" key={name}>
                  <span className="c-mark" aria-hidden="true">§</span>
                  <span>
                    <span className="c-name">{mk ? nameMk : name}</span>{' '}
                    <span className="c-gloss">— {mk ? glossMk : gloss}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="section-eyebrow">
              <span className="sec-no">03</span>
              <h2>{t('How the ML works', 'Како работи ML')}</h2>
            </div>
            <div className="grid grid-4">
              {PIPELINE.map(([n, title, text, titleMk, textMk]) => (
                <div className="card" key={n}>
                  <div className="result-icon" aria-hidden="true">{n}</div>
                  <h3 style={{ marginBottom: '0.3em' }}>{mk ? titleMk : title}</h3>
                  <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>{mk ? textMk : text}</p>
                </div>
              ))}
            </div>
            <p className="muted" style={{ marginTop: '16px' }}>
              {t('The model is trained on 3,000+ synthetic examples whose labels come from transparent, rule-based logic, so the relationship between answers and outcomes stays explainable. The pipeline uses scikit-learn and is saved with joblib.',
                'Моделот е трениран на 3.000+ синтетички примери чии етикети доаѓаат од транспарентна логика базирана на правила, па врската меѓу одговорите и исходите останува објаснлива. Пайплајнот користи scikit-learn и се зачувува со joblib.')}
            </p>
          </section>

          <section>
            <div className="section-eyebrow">
              <span className="sec-no">04</span>
              <h2>{t('Privacy', 'Приватност')}</h2>
            </div>
            <p className="muted">
              {t('Only anonymous survey results are stored — the computed scores and the predicted labels. No names, emails or other personal identifiers are collected or saved. Your own report history is kept locally in your browser only.',
                'Се чуваат само анонимни резултати од прашалникот — пресметаните скорови и предвидените етикети. Не се собираат ниту чуваат имиња, е-пошти или други лични податоци. Твојата историја на извештаи се чува само локално во прелистувачот.')}
            </p>
          </section>

          <div>
            <DisclaimerBanner />
            <div className="row" style={{ marginTop: '20px' }}>
              <Link to="/survey" className="btn btn-primary">
                {t('Start questionnaire', 'Започни прашалник')}
              </Link>
              <Link to="/analytics" className="btn btn-secondary">
                {t('View analytics', 'Види аналитика')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
