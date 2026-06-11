import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { scoreLabel, CHART_COLORS } from '../utils.js'

// RadarChart of all 16 sub-scores. radius axis domain [0,5].
export default function ScoreChart({ scores }) {
  if (!scores || typeof scores !== 'object' || Object.keys(scores).length === 0) {
    return <p className="muted center">No score data to display yet.</p>
  }

  const data = Object.entries(scores).map(([key, value]) => ({
    key,
    label: scoreLabel(key),
    value: Number(value) || 0,
  }))

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid />
          <PolarAngleAxis dataKey="label" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} angle={90} />
          <Radar
            name="Your scores"
            dataKey="value"
            stroke={CHART_COLORS[0]}
            fill={CHART_COLORS[0]}
            fillOpacity={0.45}
          />
          <Tooltip formatter={(v) => Number(v).toFixed(2)} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
