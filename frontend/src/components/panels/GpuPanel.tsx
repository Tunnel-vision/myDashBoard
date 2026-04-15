import {
  RadialBarChart,
  RadialBar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { GpuData } from '../../types/metrics'
import { formatPct, formatTemp } from '../../utils/format'

interface GpuPanelProps {
  data: GpuData | undefined
}

const radialData = (pct: number) => [
  { name: 'used', value: pct, fill: '#9d4edd' },
  { name: 'free', value: 100 - pct, fill: '#1a1a2e' },
]

export function GpuPanel({ data }: GpuPanelProps) {
  if (!data) return <div className="panel"><div className="panel-title">GPU</div><div className="text-white/30 text-xs">Loading…</div></div>

  const usedMemGB = (data.memory_used_bytes / 1024 ** 3).toFixed(1)
  const totalMemGB = (data.memory_total_bytes / 1024 ** 3).toFixed(0)

  return (
    <div className="panel">
      <div className="panel-title">GPU</div>

      <div className="flex items-center gap-3">
        <div className="h-24 w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              data={radialData(data.usage_percent)}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                background={{ fill: '#1a1a2e' }}
                dataKey="value"
                isAnimationActive={false}
                cornerRadius={4}
              />
              <Tooltip
                formatter={(v: number) => [`${v.toFixed(1)}%`, 'Usage']}
                contentStyle={{ background: '#1a1a2e', border: 'none', fontSize: 11, color: '#fff' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="text-xs font-bold text-white truncate" title={data.name}>
            {data.name}
          </div>

          <div className="text-xl font-bold text-purple-400">
            {formatPct(data.usage_percent)}
          </div>

          <div className="text-[10px] text-white/40">
            {usedMemGB} / {totalMemGB} GB
          </div>

          <div className="flex gap-2 text-[10px] text-white/30">
            {data.temperature_celsius != null && (
              <span>🌡 {formatTemp(data.temperature_celsius)}</span>
            )}
            <span>cores: {data.core_count}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 text-[10px] text-white/25 capitalize">
        type: {data.type}
      </div>
    </div>
  )
}
