import LikertScale from './LikertScale.jsx'

// One survey question: a themed illustration, the statement, and a Likert scale.
// `art` is an SVG element; `accentColor` tints the illustration tile.
// `domId` lets the survey scroll to it; `active` highlights the current item.
export default function QuestionCard({
  number,
  text,
  value,
  onChange,
  labels,
  accentColor,
  art,
  domId,
  active = false,
}) {
  const tileStyle = accentColor
    ? {
        color: accentColor,
        background: `${accentColor}14`,
        borderColor: `${accentColor}33`,
      }
    : undefined

  return (
    <div className={`card question-card${active ? ' q-active' : ''}`} id={domId}>
      <div className="question-head">
        {art ? (
          <span className="question-art" style={tileStyle}>
            {art}
          </span>
        ) : (
          <span className="question-number" style={{ backgroundColor: accentColor }}>
            {number}
          </span>
        )}
        <div className="question-body">
          <span className="question-tag">Question {number}</span>
          <p className="question-text">{text}</p>
        </div>
      </div>
      <LikertScale value={value} onChange={onChange} labels={labels} />
    </div>
  )
}
