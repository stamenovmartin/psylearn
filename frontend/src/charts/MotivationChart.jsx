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

// BarChart of the three motivation sub-scores. YAxis domain [0,5].
export default function MotivationChart({ scores }) {
  if (!scores || typeof scores !== 'object') {
    return <p className="muted center">No motivation data to display yet.</p>
  }

  const data = [
    { name: 'Intrinsic', value: Number(scores.intrinsic_motivation_score) || 0 },
    { name: 'Extrinsic', value: Number(scores.extrinsic_motivation_score) || 0 },
    { name: 'Pressure', value: Number(scores.pressure_motivation_score) || 0 },
  ]

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
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
