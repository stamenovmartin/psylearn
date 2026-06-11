// A single prediction result tile: a themed illustration, the target title,
// the predicted value (friendly label) and a short, encouraging explanation.
import { predictionTitle, valueLabel, STRESS_COLORS, TARGET_COLORS, explanationText } from '../utils.js'
import { PREDICTION_ART } from '../questionArt.jsx'

export default function ResultCard({ target, value, explanation }) {
  const accent =
    target === 'stress_risk' && STRESS_COLORS[value]
      ? STRESS_COLORS[value]
      : TARGET_COLORS[target] || 'var(--navy)'

  const tileStyle = {
    color: accent,
    background: `${accent}14`,
    borderColor: `${accent}33`,
  }

  return (
    <div className="card card-hover result-card">
      <span className="result-art draw" style={tileStyle}>
        {PREDICTION_ART[target]}
      </span>
      <div className="result-target">{predictionTitle(target)}</div>
      <div className="result-value" style={{ color: accent }}>
        {valueLabel(target, value)}
      </div>
      {explanation ? <p className="result-explain">{explanationText(target, value, explanation)}</p> : null}
    </div>
  )
}
