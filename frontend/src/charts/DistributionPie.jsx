import {
  Pie,
  PieChart,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { valueLabel, prettyLabel, CHART_COLORS } from '../utils.js'

// PieChart from a {label:count} object. Slice names via valueLabel/prettyLabel.
export default function DistributionPie({ data, target }) {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return <p className="muted center">No distribution data yet.</p>
  }

  const rows = Object.entries(data).map(([key, value]) => ({
    key,
    name: target ? valueLabel(target, key) : prettyLabel(key),
    value: Number(value) || 0,
  }))

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={rows}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="72%"
            label={(entry) => entry.name}
            labelLine={false}
          >
            {rows.map((row, i) => (
              <Cell key={row.key} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
