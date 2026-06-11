import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts'
import { CHART_COLORS } from '../utils.js'

// BarChart of learning orientation + study style sub-scores. YAxis domain [0,5].
export default function LearningChart({ scores }) {
  if (!scores || typeof scores !== 'object') {
    return <p className="muted center">No learning data to display yet.</p>
  }

  const data = [
    { name: 'Learning goal', value: Number(scores.learning_goal_score) || 0 },
    { name: 'Performance goal', value: Number(scores.performance_goal_score) || 0 },
    { name: 'Avoidance', value: Number(scores.avoidance_goal_score) || 0 },
    { name: 'Deep', value: Number(scores.deep_learning_score) || 0 },
    { name: 'Surface', value: Number(scores.surface_learning_score) || 0 },
    { name: 'Last-minute', value: Number(scores.last_minute_score) || 0 },
  ]

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 24, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={48}
          />
          <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => Number(v).toFixed(2)} cursor={{ fillOpacity: 0.1 }} />
          <Bar dataKey="value" name="Score" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
