// Generates a concrete, personalized weekly study plan from a predicted profile.
// Bilingual (EN/MK): pass the current language. Deterministic per profile+language.
import { memoryMethodTitle } from './utils.js'

const pick = (lang, en, mk) => (lang === 'mk' ? mk : en)

const SESSION_BY_STRESS = {
  low: ['45-minute focus blocks with a short break between them', '45-минутни блокови на фокус со кратка пауза меѓу нив'],
  moderate: ['35-minute focus blocks with a 5-minute break after each', '35-минутни блокови со 5-минутна пауза по секој'],
  high: ['25-minute focus blocks (Pomodoro) with frequent short breaks', '25-минутни блокови (Pomodoro) со чести кратки паузи'],
}

const METHOD_ACTION = {
  method_of_loci: ['place the key ideas along a familiar route and walk through it mentally', 'смести ги клучните идеи по позната патека и помини низ неа наум'],
  association_method: ['link each new idea to something you already know with a vivid image', 'поврзи ја секоја нова идеја со нешто што веќе го знаеш преку жива слика'],
  story_method: ['turn the material into a short, memorable story', 'претвори го материјалот во кратка, паметлива приказна'],
  first_letter_method: ['build first-letter cues or acronyms for ordered lists', 'создади потсетници од први букви или акроними за подредени листи'],
  repetition: ['review with spaced flashcards and self-testing', 'повторувај со распоредени флеш-картички и самотестирање'],
  teach_someone_else: ['explain the topic out loud as if teaching a classmate', 'објасни ја темата на глас како да предаваш на соученик'],
}

export function buildStudyPlan(predictions = {}, scores = {}, lang = 'en') {
  const P = (en, mk) => pick(lang, en, mk)
  const stress = predictions.stress_risk || 'moderate'
  const method = predictions.recommended_memory_method || 'repetition'
  const methodName = memoryMethodTitle(method)
  const ma = METHOD_ACTION[method] || METHOD_ACTION.repetition
  const methodAction = P(ma[0], ma[1])
  const sl = SESSION_BY_STRESS[stress] || SESSION_BY_STRESS.moderate
  const sessionLength = P(sl[0], sl[1])

  const principles = []
  if (predictions.study_style === 'surface_learner') {
    principles.push(P('Swap rereading for active recall — close the book and explain it.', 'Замени го препрочитувањето со активно присетување — затвори ја книгата и објасни го.'))
  } else if (predictions.study_style === 'deep_learner') {
    principles.push(P('Lean into your strength: connect each topic to what you already know.', 'Потпри се на твојата сила: поврзи ја секоја тема со тоа што веќе го знаеш.'))
  } else if (predictions.study_style === 'last_minute_learner') {
    principles.push(P('Beat cramming with spaced sessions — a little every day wins.', 'Победи го кампувањето со распоредени сесии — по малку секој ден победува.'))
  } else {
    principles.push(P('Match the method to the task: recall for facts, elaboration for ideas.', 'Прилагоди го методот на задачата: присетување за факти, разработка за идеи.'))
  }
  if (predictions.motivation_type === 'extrinsic' || predictions.motivation_type === 'pressure_based') {
    principles.push(P('Before each session, write one thing you want to understand — not just pass.', 'Пред секоја сесија, запиши една работа што сакаш да ја разбереш — не само да поминеш.'))
  } else if (predictions.motivation_type === 'intrinsic') {
    principles.push(P('Follow your curiosity: add one "why" question to each topic.', 'Следи ја љубопитноста: додај едно прашање „зошто“ на секоја тема.'))
  }
  if (predictions.learning_orientation === 'performance_goal_oriented') {
    principles.push(P('Track your own progress instead of comparing with others.', 'Следи го својот напредок наместо да се споредуваш со другите.'))
  }
  if (predictions.learning_orientation === 'avoidance_oriented') {
    principles.push(P('Start each hard task with one tiny step to lower the barrier.', 'Започни ја секоја тешка задача со еден мал чекор за да ја намалиш бариерата.'))
  }
  if (stress === 'high') {
    principles.push(P('Begin with an easy win to reduce pressure, and protect your breaks.', 'Почни со лесна победа за да го намалиш притисокот и чувај ги паузите.'))
  }
  if ((scores.organization_score ?? 3) <= 2) {
    principles.push(P('Keep a simple weekly checklist so nothing piles up.', 'Води едноставна неделна чек-листа за да не се натрупа ништо.'))
  }

  const teachOrWrite =
    predictions.personality_profile === 'extrovert'
      ? P('Explain a topic to a friend or study group.', 'Објасни тема на пријател или група за учење.')
      : P('Write a short summary linking the topics together.', 'Напиши кратко резиме што ги поврзува темите.')

  const week = [
    {
      day: P('Monday', 'Понеделник'),
      title: P('Plan & preview', 'Планирај и прегледај'),
      tasks: [
        P('List this week’s topics and pick the 2–3 most important.', 'Наброј ги темите за оваа недела и избери ги 2–3 најважни.'),
        P('Skim each topic to build a mental map before deep work.', 'Прелистај ја секоја тема за да изградиш ментална мапа пред длабока работа.'),
      ],
    },
    {
      day: P('Tuesday', 'Вторник'),
      title: P('Deep study', 'Длабоко учење'),
      tasks: [
        P(`Study the hardest topic in ${sessionLength}.`, `Учи ја најтешката тема во ${sessionLength}.`),
        P(`Use the ${methodName}: ${methodAction}.`, `Користи ${methodName}: ${methodAction}.`),
      ],
    },
    {
      day: P('Wednesday', 'Среда'),
      title: P('Active recall', 'Активно присетување'),
      tasks: [
        P('Close your notes and write everything you remember from memory.', 'Затвори ги белешките и напиши сè што паметиш по сеќавање.'),
        P('Check gaps and re-study only what you missed.', 'Провери ги празнините и повтори само тоа што го пропушти.'),
      ],
    },
    {
      day: P('Thursday', 'Четврток'),
      title: P('Apply & connect', 'Примени и поврзи'),
      tasks: [
        P('Work through examples or practice problems.', 'Реши примери или задачи за вежбање.'),
        teachOrWrite,
      ],
    },
    {
      day: P('Friday', 'Петок'),
      title: P('Spaced review', 'Распоредено повторување'),
      tasks: [
        P('Quickly review everything from the week (spaced repetition).', 'Брзо повтори сè од неделата (распоредено повторување).'),
        P('Rate your confidence per topic and flag what to revisit next week.', 'Оцени ја сигурноста по тема и означи што да повториш следната недела.'),
      ],
    },
  ]

  return { sessionLength, principles, week, methodName }
}
