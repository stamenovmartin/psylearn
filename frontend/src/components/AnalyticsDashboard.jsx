import { DistributionPie, DistributionBar } from '../charts/index.js'
import { formatScore, scoreLabel, memoryMethodTitle } from '../utils.js'
import { useT } from '../i18n.jsx'

// Curated sub-scores to surface as average meter bars.
const AVG_SCORE_KEYS = [
  'intrinsic_motivation_score',
  'extrinsic_motivation_score',
  'deep_learning_score',
  'surface_learning_score',
  'learning_goal_score',
  'performance_goal_score',
  'stress_score',
  'organization_score',
]

export default function AnalyticsDashboard({ summary, distributions }) {
  const t = useT()
  const dist = (distributions && distributions.distributions) || {}
  const averages = (distributions && distributions.average_scores) || {}

  const mostRecommended =
    (summary.most_recommended_memory_method
      ? memoryMethodTitle(summary.most_recommended_memory_method)
      : null) || '–'

  return (
    <div className="stack section-gap">
      {/* Headline stats */}
      <div className="grid grid-4">
        <div className="card stat">
          <div className="stat-value">{summary.total_surveys}</div>
          <div className="stat-label">{t('Total surveys', 'Вкупно анкети')}</div>
        </div>
        <div className="card stat">
          <div className="stat-value">
            {formatScore(summary.avg_intrinsic_motivation_score)}
          </div>
          <div className="stat-label">{t('Avg intrinsic motivation', 'Просек внатрешна мотивација')}</div>
        </div>
        <div className="card stat">
          <div className="stat-value">
            {formatScore(summary.avg_deep_learning_score)}
          </div>
          <div className="stat-label">{t('Avg deep learning', 'Просек длабоко учење')}</div>
        </div>
        <div className="card stat">
          <div className="stat-value">{mostRecommended}</div>
          <div className="stat-label">{t('Most recommended method', 'Најпрепорачан метод')}</div>
        </div>
      </div>

      {/* Distribution charts */}
      <div className="grid grid-2">
        <div className="chart-card">
          <h3 className="chart-title">{t('Motivation types', 'Типови мотивација')}</h3>
          <DistributionPie
            data={dist.motivation_type}
            target="motivation_type"
          />
        </div>

        <div className="chart-card">
          <h3 className="chart-title">{t('Study styles', 'Стилови на учење')}</h3>
          <DistributionPie data={dist.study_style} target="study_style" />
        </div>

        <div className="chart-card">
          <h3 className="chart-title">{t('Stress risk', 'Ризик од стрес')}</h3>
          <DistributionBar data={dist.stress_risk} target="stress_risk" />
        </div>

        <div className="chart-card">
          <h3 className="chart-title">{t('Learning orientation', 'Ориентација во учењето')}</h3>
          <DistributionBar
            data={dist.learning_orientation}
            target="learning_orientation"
          />
        </div>

        <div className="chart-card">
          <h3 className="chart-title">{t('Personality profiles', 'Профили на личност')}</h3>
          <DistributionPie
            data={dist.personality_profile}
            target="personality_profile"
          />
        </div>

        <div className="chart-card">
          <h3 className="chart-title">{t('Recommended memory methods', 'Препорачани меморсиски методи')}</h3>
          <DistributionBar
            data={dist.recommended_memory_method}
            target="recommended_memory_method"
          />
        </div>
      </div>

      {/* Average sub-scores */}
      <div className="chart-card">
        <h3 className="chart-title">{t('Average sub-scores', 'Просечни под-скорови')}</h3>
        <p className="chart-sub muted">
          {t('Community averages across all completed surveys (each on a 1–5 scale).', 'Просеци на заедницата од сите пополнети анкети (секој на скала 1–5).')}
        </p>
        <div className="stack">
          {AVG_SCORE_KEYS.map((key) => {
            const value = averages[key]
            const pct =
              value === null || value === undefined || Number.isNaN(Number(value))
                ? 0
                : (Number(value) / 5) * 100
            return (
              <div className="progress" key={key}>
                <div className="progress-meta">
                  <span>{scoreLabel(key)}</span>
                  <span className="muted">{formatScore(value)}</span>
                </div>
                <div className="meter">
                  <div
                    className="meter-fill"
                    style={{ width: pct + '%' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
