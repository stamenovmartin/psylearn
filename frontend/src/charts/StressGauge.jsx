import {
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import { STRESS_COLORS, formatScore } from '../utils.js'

// Semicircular gauge for stress. score is 1..5, level is 'low'|'moderate'|'high'.
export default function StressGauge({ score, level }) {
  const hasScore = score !== null && score !== undefined && !Number.isNaN(Number(score))
  if (!hasScore && !level) {
    return <p className="muted center">No stress data to display yet.</p>
  }

  const numeric = hasScore ? Number(score) : 0
  const safeLevel = level && STRESS_COLORS[level] ? level : 'low'
  const fill = STRESS_COLORS[safeLevel]
  const levelText = safeLevel.charAt(0).toUpperCase() + safeLevel.slice(1)

  const data = [{ name: 'stress', value: numeric, fill }]

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={180}
            endAngle={0}
            barSize={26}
          >
            <PolarAngleAxis type="number" domain={[0, 5]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: '#ece4d2' }}
              dataKey="value"
              cornerRadius={13}
              angleAxisId={0}
              isAnimationActive={false}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div
        className="center"
        style={{
          marginTop: '-1.5rem',
          position: 'relative',
          pointerEvents: 'none',
        }}
      >
        <div className="stat-value" style={{ color: fill }}>
          {hasScore ? formatScore(numeric) : '–'}
        </div>
        <div className="badge" style={{ color: fill, borderColor: fill }}>
          {levelText} stress
        </div>
      </div>
    </div>
  )
}
