import { useEffect, useRef, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { CpuData } from '../../types/metrics'
import { formatPct, formatTemp } from '../../utils/format'

interface CpuPanelProps {
  data: CpuData | undefined
}

const HISTORY_SIZE = 30

export function CpuPanel({ data }: CpuPanelProps) {
  const historyRef = useRef<{ idx: number; total: number }[]>([])
  const [history, setHistory] = useState<{ idx: number; total: number }[]>([])

  useEffect(() => {
    if (!data) return
    const h = historyRef.current
    h.push({ idx: h.length, total: data.total_usage_percent })
    if (h.length > HISTORY_SIZE) h.shift()
    setHistory([...h])
  }, [data])

  if (!data) return <div className="panel"><div className="panel-title">CPU</div><div className="text-white/30 text-xs">Loading…</div></div>

  return (
    <div className="panel">
      <div className="panel-title">CPU</div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-white">{formatPct(data.total_usage_percent)}</span>
        <span className="text-xs text-white/40">{data.model}</span>
      </div>

      <div className="grid grid-cols-3 gap-1 mb-3">
        {data.cores.slice(0, 9).map(c => (
          <div key={c.index} className="flex flex-col items-center">
            <div
              className="w-full bg-accent-cyan/20 rounded-sm"
              style={{ height: 28 }}
            >
              <div
                className="bg-accent-cyan rounded-sm transition-all duration-300"
                style={{ height: `${c.usage_percent}%`, width: '100%' }}
              />
            </div>
            <span className="text-[10px] text-white/40 mt-0.5">{formatPct(c.usage_percent, 0)}</span>
          </div>
        ))}
      </div>

      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <YAxis domain={[0, 100]} hide />
            <XAxis dataKey="idx" hide />
            <Tooltip
              formatter={(v: number) => [`${v.toFixed(1)}%`, 'CPU']}
              contentStyle={{ background: '#1a1a2e', border: 'none', fontSize: 11, color: '#fff' }}
              labelFormatter={() => ''}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#00d9ff"
              fill="#00d9ff22"
              strokeWidth={1.5}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between text-[10px] text-white/30 mt-1">
        <span>cores: {data.core_count}</span>
        <span>temp: {formatTemp(data.temperature_celsius)}</span>
        {data.fan_speed_rpm.length > 0 && (
          <span>fans: {data.fan_speed_rpm.join(', ')} RPM</span>
        )}
      </div>
    </div>
  )
}
