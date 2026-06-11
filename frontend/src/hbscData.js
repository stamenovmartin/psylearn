// Real statistics from the HBSC (Health Behaviour in School-aged Children) study,
// WHO collaborative cross-national survey 2021/2022 (~280,000 adolescents aged
// 11, 13, 15 across 44 countries/regions). Figures gathered from the official
// HBSC international reports — NOT synthetic. See HBSC_META.sources for citations.

export const HBSC_META = {
  study: 'HBSC — Health Behaviour in School-aged Children (a WHO collaborative study)',
  survey: '2021/2022 international survey',
  respondents: 280000,
  countries: 44,
  ages: '11, 13 & 15',
  sources: [
    {
      label: 'HBSC international report — adolescent mental health & well-being (WHO, 2024)',
      url: 'https://www.hbsc.org/new-who-hbsc-international-report-a-focus-on-adolescent-mental-health-and-well-being/',
    },
    {
      label: 'HBSC — adolescent peer violence & bullying (WHO, 2024)',
      url: 'https://www.hbsc.org/publications/reports/a-focus-on-adolescent-peer-violence-and-bullying-in-europe-central-asia-and-canada/',
    },
    { label: 'HBSC Data Browser', url: 'https://data-browser.hbsc.org/' },
  ],
}

// Headline figures (regional averages across all ages unless noted).
export const HBSC_HEADLINES = [
  { id: 'nervous', label: 'Feel nervous or irritable weekly', value: 33, note: 'more than once a week, past 6 months' },
  { id: 'sleep', label: 'Have sleep difficulties weekly', value: 29, note: 'more than once a week' },
  { id: 'low', label: 'Feel low weekly', value: 25, note: 'more than once a week' },
  { id: 'cyberbullied', label: 'Have been cyberbullied', value: 16, note: 'about 1 in 6 adolescents' },
  { id: 'psmu', label: 'Show problematic social-media use', value: 11, note: 'up from 7% in 2018' },
  { id: 'headache', label: 'Have weekly headaches', value: 20, note: 'more than once a week' },
]

// Indicators with a girls vs boys breakdown (percent).
export const HBSC_GENDER = [
  { id: 'loneliness', label: 'Often lonely (age 15)', girls: 25, boys: 14, betterHigh: false },
  { id: 'active', label: 'Active 60 min daily', girls: 15, boys: 25, betterHigh: true },
  { id: 'psmu', label: 'Problematic social media', girls: 13, boys: 9, betterHigh: false },
  { id: 'bully', label: 'Bully others regularly', girls: 5, boys: 8, betterHigh: false },
  { id: 'fight', label: 'Frequent physical fights', girls: 6, boys: 14, betterHigh: false },
]

// Each HBSC domain mapped to how this platform responds (assignment: a solution
// that addresses the problem and promotes wellbeing).
export const HBSC_DOMAINS = [
  {
    id: 'mental',
    title: 'Mental health & stress',
    icon: 'pulse',
    stat: '1 in 3 teens feel nervous or irritable every week.',
    response: 'Our wellbeing check flags stress early, then offers calming techniques (box breathing, grounding) and the Flow canvas to unwind.',
    links: [
      { to: '/survey', label: 'Wellbeing check' },
      { to: '/flow', label: 'Flow' },
    ],
  },
  {
    id: 'sleep',
    title: 'Sleep',
    icon: 'alarm',
    stat: 'Nearly 3 in 10 teens have weekly sleep difficulties.',
    response: 'Learn how sleep consolidates memory and mood, with practical wind-down and routine tips.',
    links: [{ to: '/learn', label: 'Learn' }],
  },
  {
    id: 'digital',
    title: 'Digital well-being',
    icon: 'grid',
    stat: 'Problematic social-media use rose from 7% to 11% since 2018.',
    response: 'Flow is a deliberately offline, calm activity; Learn covers online/offline balance and healthy habits.',
    links: [{ to: '/flow', label: 'Flow' }, { to: '/learn', label: 'Learn' }],
  },
  {
    id: 'bullying',
    title: 'Peer relations & bullying',
    icon: 'group',
    stat: 'About 1 in 6 teens have experienced cyberbullying.',
    response: 'Learn covers peer relationships and social support, and the profile encourages connection (study groups, teaching others).',
    links: [{ to: '/learn', label: 'Learn' }],
  },
  {
    id: 'activity',
    title: 'Physical activity',
    icon: 'pulse',
    stat: 'Only 15% of girls and 25% of boys move 60 min a day.',
    response: 'Your study plan builds in movement breaks, and techniques use short active Pomodoro breaks.',
    links: [{ to: '/survey', label: 'Get a plan' }],
  },
  {
    id: 'connection',
    title: 'Social support & loneliness',
    icon: 'pair',
    stat: '1 in 4 girls (and 1 in 7 boys) aged 15 feel lonely often.',
    response: 'The profile highlights how you recharge and suggests ways to build supportive study connections.',
    links: [{ to: '/learn', label: 'Learn' }],
  },
]
