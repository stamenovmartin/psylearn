import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { valueLabel, prettyLabel, CHART_COLORS } from '../utils.js'

// BarChart from a {label:count} object. x labels via valueLabel/prettyLabel.
export default function DistributionBar({ data, target, color }) {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return <p className="muted center">No distribution data yet.</p>
  }

  const rows = Object.entries(data).map(([key, value]) => ({
    key,
    name: target ? valueLabel(target, key) : prettyLabel(key),
    value: Number(value) || 0,
  }))

  const barColor = color || CHART_COLORS[0]

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 28, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={52}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ fillOpacity: 0.1 }} />
          <Bar dataKey="value" name="Count" fill={barColor} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
