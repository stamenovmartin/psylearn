// A 1-5 Likert chooser. `labels` is the likert_labels map {"1".."5": text}.
export default function LikertScale({ value, onChange, labels = {} }) {
  return (
    <div className="likert">
      {[1, 2, 3, 4, 5].map((n) => {
        const selected = value === n
        return (
          <button
            key={n}
            type="button"
            className={`likert-btn${selected ? ' selected' : ''}`}
            aria-pressed={selected}
            onClick={() => onChange(n)}
          >
            <span className="likert-num">{n}</span>
            <span className="likert-text">{labels[n] || labels[String(n)]}</span>
          </button>
        )
      })}
    </div>
  )
}
