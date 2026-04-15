import { useEffect, useRef, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { MemoryData } from '../../types/metrics'
import { formatBytes, formatPct } from '../../utils/format'

interface MemoryPanelProps {
  data: MemoryData | undefined
}

const HISTORY_SIZE = 30

const PRESSURE_COLOR = {
  normal: 'text-accent-green',
  warn: 'text-accent-yellow',
  critical: 'text-accent-red',
}

export function MemoryPanel({ data }: MemoryPanelProps) {
  const historyRef = useRef<{ idx: number; used: number }[]>([])
  const [history, setHistory] = useState<{ idx: number; used: number }[]>([])

  useEffect(() => {
    if (!data) return
    const h = historyRef.current
    h.push({ idx: h.length, used: data.usage_percent })
    if (h.length > HISTORY_SIZE) h.shift()
    setHistory([...h])
  }, [data])

  if (!data) return <div className="panel"><div className="panel-title">Memory</div><div className="text-white/30 text-xs">Loading…</div></div>

  const usedGB = data.used_bytes / 1024 ** 3
  const totalGB = data.total_bytes / 1024 ** 3

  return (
    <div className="panel">
      <div className="panel-title">Memory</div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-white">
          {formatPct(data.usage_percent)}
        </span>
        <span className="text-xs text-white/40">
          {usedGB.toFixed(1)} / {totalGB.toFixed(0)} GB
        </span>
        <span className={`text-[10px] font-bold uppercase ${PRESSURE_COLOR[data.pressure]}`}>
          {data.pressure}
        </span>
      </div>

      <div className="h-16 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <YAxis domain={[0, 100]} hide />
            <XAxis dataKey="idx" hide />
            <Tooltip
              formatter={(v: number) => [`${v.toFixed(1)}%`, 'Memory']}
              contentStyle={{ background: '#1a1a2e', border: 'none', fontSize: 11, color: '#fff' }}
              labelFormatter={() => ''}
            />
            <Area
              type="monotone"
              dataKey="used"
              stroke="#9d4edd"
              fill="#9d4edd22"
              strokeWidth={1.5}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Memory bar */}
      <div className="w-full bg-white/10 rounded-sm h-2 mb-1">
        <div
          className="bg-purple-500 rounded-sm h-2 transition-all duration-300"
          style={{ width: `${data.usage_percent}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-white/30 mb-1">
        <span>used {formatBytes(data.used_bytes)}</span>
        <span>free {formatBytes(data.free_bytes)}</span>
      </div>

      {/* Swap */}
      <div className="text-[10px] text-white/25">
        swap {formatBytes(data.swap_used_bytes)} / {formatBytes(data.swap_total_bytes)}
      </div>
    </div>
  )
}
