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
import { memoryMethodTitle, CHART_COLORS } from '../utils.js'

// BarChart of the 6 memory_signals. YAxis domain [0,5].
export default function MemoryChart({ signals }) {
  if (!signals || typeof signals !== 'object' || Object.keys(signals).length === 0) {
    return <p className="muted center">No memory-method data to display yet.</p>
  }

  const data = Object.entries(signals).map(([key, value]) => ({
    key,
    name: memoryMethodTitle(key),
    value: Number(value) || 0,
  }))

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 16, bottom: 4, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            tick={{ fontSize: 11 }}
          />
          <Tooltip formatter={(v) => Number(v).toFixed(2)} cursor={{ fillOpacity: 0.1 }} />
          <Bar dataKey="value" name="Fit" radius={[0, 6, 6, 0]}>
            {data.map((entry, i) => (
              <Cell key={entry.key} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
