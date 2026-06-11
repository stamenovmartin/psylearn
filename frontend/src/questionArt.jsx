// Hand-drawn line illustrations for each survey question (and each section).
// Every icon reflects the meaning of its statement, in the academic line style.
// Icons inherit `currentColor`, so the survey tints them with the section color.

function S({ children }) {
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

const DOT = (cx, cy, r = 0.7) => <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />

export const QUESTION_ART = {
  // --- Section A: Motivation ---------------------------------------------- //
  q1: ( // study to understand → lightbulb
    <S>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.7.6 1 1.3 1 2.5h6c0-1.2.3-1.9 1-2.5A6 6 0 0 0 12 3z" />
    </S>
  ),
  q2: ( // grades motivate → award medal
    <S>
      <circle cx="12" cy="8" r="6" />
      <path d="M8.5 13 7 22l5-3 5 3-1.5-9" />
      {DOT(12, 8, 1.4)}
    </S>
  ),
  q3: ( // pressure/control → stopwatch
    <S>
      <circle cx="12" cy="13" r="7" />
      <path d="M12 13V9" />
      <path d="M10 2h4" />
      <path d="M12 4V2" />
      <path d="M18.5 7.5 20 6" />
    </S>
  ),
  q4: ( // practical use → gear/tools
    <S>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.5 1.5M16.2 16.2l1.5 1.5M17.7 6.3l-1.5 1.5M7.8 16.2l-1.5 1.5" />
    </S>
  ),
  q5: ( // grades drive study → certificate
    <S>
      <rect x="5" y="3" width="14" height="13" rx="1.5" />
      <path d="M8 7h8M8 10h5" />
      <circle cx="15.5" cy="16.5" r="2.5" />
      <path d="M14 18.5 13 22l2.5-1.3L18 22l-1-3.5" />
    </S>
  ),
  q6: ( // aha / solved it → check in circle
    <S>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.3 12.5l2.5 2.5 5-5.5" />
    </S>
  ),

  // --- Section B: Learning goals ----------------------------------------- //
  q7: ( // understanding over passing → magnifier
    <S>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M20 20l-5-5" />
      <path d="M10.5 8v5M8 10.5h5" />
    </S>
  ),
  q8: ( // worry about others' view → speech bubble + ?
    <S>
      <path d="M5 5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
      <path d="M10.6 8.6a1.6 1.6 0 0 1 2.6 1.2c0 1.1-1.3 1.2-1.3 2.2" />
      {DOT(11.9, 13.4, 0.6)}
    </S>
  ),
  q9: ( // outperform others → trophy
    <S>
      <path d="M8 4h8v4a4 4 0 0 1-8 0z" />
      <path d="M8 5H5a3 3 0 0 0 3 3M16 5h3a3 3 0 0 1-3 3" />
      <path d="M12 12v3M9 20h6M10 20l.5-3h3l.5 3" />
    </S>
  ),
  q10: ( // mistakes are normal → growth loop
    <S>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 5v4h-4" />
    </S>
  ),
  q11: ( // give up quickly → trending down
    <S>
      <path d="M4 7l6 6 3-3 7 7" />
      <path d="M20 13v4h-4" />
    </S>
  ),
  q12: ( // likes challenges → mountain + flag
    <S>
      <path d="M3 19l6-11 4 7 2-3 6 7z" />
      <path d="M12 8V4l3 1-3 1" />
    </S>
  ),

  // --- Section C: Study style -------------------------------------------- //
  q13: ( // last minute → alarm clock
    <S>
      <circle cx="12" cy="13" r="7" />
      <path d="M12 10v3l2.5 1.5" />
      <path d="M5 4 3 6M19 4l2 2" />
    </S>
  ),
  q14: ( // notes & diagrams → clipboard
    <S>
      <rect x="6" y="5" width="12" height="15" rx="1.5" />
      <path d="M9 4h6v3H9z" />
      <path d="M9 11h6M9 14h6M9 17h4" />
    </S>
  ),
  q15: ( // reread without analysis → repeat page
    <S>
      <path d="M17 3l3 3-3 3" />
      <path d="M20 6H9a4 4 0 0 0-4 4v1" />
      <path d="M7 21l-3-3 3-3" />
      <path d="M4 18h11a4 4 0 0 0 4-4v-1" />
    </S>
  ),
  q16: ( // connect to prior knowledge → linked nodes
    <S>
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="6" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <path d="M8.2 10.9 15.8 7.1M8.2 13.1 15.8 16.9" />
    </S>
  ),
  q17: ( // examples & practice → flask
    <S>
      <path d="M9 3h6M10 3v6l-4.2 8.3A1.8 1.8 0 0 0 7.4 20h9.2a1.8 1.8 0 0 0 1.6-2.7L14 9V3" />
      <path d="M8 15h8" />
    </S>
  ),
  q18: ( // detail without big picture → magnify a dot
    <S>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M20 20l-5-5" />
      {DOT(10.5, 10.5, 1.6)}
    </S>
  ),

  // --- Section D: Memory -------------------------------------------------- //
  q19: ( // images/places → map pin
    <S>
      <path d="M12 21s-6-5.7-6-10a6 6 0 0 1 12 0c0 4.3-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.2" />
    </S>
  ),
  q20: ( // story / association → open book
    <S>
      <path d="M12 6c-2-1.3-5-1.3-8-.8v12c3-.5 6-.5 8 .8 2-1.3 5-1.3 8-.8V5.2c-3-.5-6-.5-8 .8z" />
      <path d="M12 6v13" />
    </S>
  ),
  q21: ( // first letters / abbreviations → tag
    <S>
      <path d="M3 12l8.5-8.5a1.5 1.5 0 0 1 1 -.5H19a2 2 0 0 1 2 2v5.5a1.5 1.5 0 0 1-.5 1L12 20z" />
      <circle cx="16.5" cy="7.5" r="1.3" />
    </S>
  ),
  q22: ( // forget without repetition → refresh loop
    <S>
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 4v5h-5" />
    </S>
  ),
  q23: ( // explain to someone → presentation board
    <S>
      <rect x="3" y="4" width="18" height="11" rx="1.5" />
      <path d="M7 11l2.6-2.6 2 2L15 7.4" />
      <path d="M12 15v4M9 21l3-2 3 2" />
    </S>
  ),
  q24: ( // need visual structure → grid
    <S>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </S>
  ),

  // --- Section E: Personality & emotions --------------------------------- //
  q25: ( // energized around people → group
    <S>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 6.5a3 3 0 0 1 0 5M20.5 19a5.5 5.5 0 0 0-3.5-5.1" />
    </S>
  ),
  q26: ( // prefer studying alone/quiet → single person
    <S>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </S>
  ),
  q27: ( // anxious before exam → heartbeat
    <S>
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    </S>
  ),
  q28: ( // many responsibilities → stacked papers
    <S>
      <rect x="5" y="4" width="14" height="4" rx="1" />
      <rect x="5" y="10" width="14" height="4" rx="1" />
      <rect x="5" y="16" width="14" height="4" rx="1" />
    </S>
  ),
  q29: ( // organized & plans ahead → calendar
    <S>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
      <path d="M8.5 14l2 2 3.5-3.5" />
    </S>
  ),
  q30: ( // stress lowers focus → target
    <S>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      {DOT(12, 12, 1.2)}
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    </S>
  ),
}

// One illustration per prediction target (shown on the Results cards).
export const PREDICTION_ART = {
  motivation_type: ( // flame
    <S>
      <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3.2 2-4 0 1.2.7 2 1.6 2C13 9 12 6 12 3z" />
    </S>
  ),
  learning_orientation: ( // bullseye / goal
    <S>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      {DOT(12, 12, 1.2)}
    </S>
  ),
  study_style: ( // open book
    <S>
      <path d="M12 6c-2-1.3-5-1.3-8-.8v12c3-.5 6-.5 8 .8 2-1.3 5-1.3 8-.8V5.2c-3-.5-6-.5-8 .8z" />
      <path d="M12 6v13" />
    </S>
  ),
  recommended_memory_method: ( // key
    <S>
      <circle cx="8" cy="15" r="4" />
      <path d="M10.8 12.2 20 3" />
      <path d="M15.5 7.5 18 10" />
      <path d="M18 5l2.5 2.5" />
    </S>
  ),
  personality_profile: ( // intro/extro spectrum
    <S>
      <circle cx="9" cy="12" r="6" />
      <circle cx="15" cy="12" r="6" />
    </S>
  ),
  stress_risk: ( // heartbeat
    <S>
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    </S>
  ),
}

// One representative illustration per section (shown in the section opener).
export const SECTION_ART = {
  A: QUESTION_ART.q1, // motivation → lightbulb
  B: QUESTION_ART.q9, // learning goals → trophy
  C: QUESTION_ART.q14, // study style → notes
  D: QUESTION_ART.q19, // memory → map pin
  E: QUESTION_ART.q25, // personality → people
  F: QUESTION_ART.q1, // scenarios (placeholder)
}

// Extra illustrations used by the image-choice scenario options.
const EXTRA = {
  balance: (
    <S>
      <path d="M12 3v18" />
      <path d="M7 21h10" />
      <path d="M5 7h14" />
      <path d="M5 7l-2.5 5a2.5 2.5 0 0 0 5 0z" />
      <path d="M19 7l2.5 5a2.5 2.5 0 0 1-5 0z" />
    </S>
  ),
  compass: (
    <S>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </S>
  ),
  leaf: (
    <S>
      <path d="M5 19C5 11 11 5 19 5c0 8-6 14-14 14z" />
      <path d="M5 19c4-4 7-6 10-7" />
    </S>
  ),
  marker: (
    <S>
      <path d="M15 4l5 5-9 9-5 1 1-5z" />
      <path d="M13 6l5 5" />
    </S>
  ),
  note: (
    <S>
      <path d="M9 17V5l10-2v12" />
      <circle cx="6.5" cy="17.5" r="2.5" />
      <circle cx="16.5" cy="15.5" r="2.5" />
    </S>
  ),
  pair: (
    <S>
      <circle cx="8.5" cy="9" r="2.6" />
      <circle cx="15.5" cy="9" r="2.6" />
      <path d="M4 19a4.5 4.5 0 0 1 9 0" />
      <path d="M11 19a4.5 4.5 0 0 1 9 0" />
    </S>
  ),
  wave: (
    <S>
      <path d="M3 10c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
      <path d="M3 16c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
    </S>
  ),
  folder: (
    <S>
      <path d="M3 7a2 2 0 0 1 2-2h3.5l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </S>
  ),
  scatter: (
    <S>
      {DOT(6, 8, 1.3)}
      {DOT(17, 6, 1.3)}
      {DOT(12, 13, 1.3)}
      {DOT(7, 17, 1.3)}
      {DOT(18, 16, 1.3)}
    </S>
  ),
  neutral: (
    <S>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14.5h7" />
      {DOT(9.2, 10, 0.7)}
      {DOT(14.8, 10, 0.7)}
    </S>
  ),
  pencil: (
    <S>
      <path d="M4 20l1.2-4.2L16 5l3 3L8.2 18.8z" />
      <path d="M14 7l3 3" />
    </S>
  ),
  lines: (
    <S>
      <path d="M5 6h14M5 10h14M5 14h9M5 18h11" />
    </S>
  ),
}

// Big illustration for each scenario question (reuses existing icons).
Object.assign(QUESTION_ART, {
  q31: QUESTION_ART.q13, // alarm
  q32: QUESTION_ART.q9, // trophy
  q33: EXTRA.compass,
  q34: QUESTION_ART.q16, // nodes
  q35: QUESTION_ART.q19, // map pin
  q36: QUESTION_ART.q25, // group
  q37: QUESTION_ART.q27, // pulse
  q38: QUESTION_ART.q24, // grid
  q39: QUESTION_ART.q10, // growth
  q40: QUESTION_ART.q20, // story
})

// Illustration per scenario option (keyed by the `art` value in scoring.py).
export const OPTION_ART = {
  alarm: QUESTION_ART.q13,
  balance: EXTRA.balance,
  calendar: QUESTION_ART.q29,
  trophy: QUESTION_ART.q9,
  medal: QUESTION_ART.q2,
  bulb: QUESTION_ART.q1,
  compass: EXTRA.compass,
  book: QUESTION_ART.q20,
  leaf: EXTRA.leaf,
  nodes: QUESTION_ART.q16,
  repeat: QUESTION_ART.q22,
  marker: EXTRA.marker,
  mappin: QUESTION_ART.q19,
  note: EXTRA.note,
  group: QUESTION_ART.q25,
  pair: EXTRA.pair,
  solo: QUESTION_ART.q26,
  pulse: QUESTION_ART.q27,
  wave: EXTRA.wave,
  grid: QUESTION_ART.q24,
  folder: EXTRA.folder,
  scatter: EXTRA.scatter,
  growth: QUESTION_ART.q10,
  neutral: EXTRA.neutral,
  down: QUESTION_ART.q11,
  story: QUESTION_ART.q20,
  pencil: EXTRA.pencil,
  lines: EXTRA.lines,
}
