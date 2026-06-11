// Slim progress indicator for the survey: how many questions are answered.
export default function ProgressBar({ current, total }) {
  const safeTotal = total > 0 ? total : 1
  const percent = Math.round((current / safeTotal) * 100)

  return (
    <div className="progress">
      <div className="progress-meta">
        <span>
          {current} of {total} answered
        </span>
        <span>{percent}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
