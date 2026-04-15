import { useEffect, useRef, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { NetworkData } from '../../types/metrics'
import { formatBps } from '../../utils/format'

interface NetworkPanelProps {
  data: NetworkData | undefined
}

const HISTORY_SIZE = 20

export function NetworkPanel({ data }: NetworkPanelProps) {
  const downRef = useRef<number[]>([])
  const upRef = useRef<number[]>([])
  const [chartData, setChartData] = useState<{ idx: number; down: number; up: number }[]>([])

  useEffect(() => {
    if (!data) return
    const d = downRef.current
    const u = upRef.current
    d.push(data.total_download_bytes_per_sec)
    u.push(data.total_upload_bytes_per_sec)
    if (d.length > HISTORY_SIZE) d.shift()
    if (u.length > HISTORY_SIZE) u.shift()
    setChartData(d.map((down, i) => ({ idx: i, down, up: u[i] ?? 0 })))
  }, [data])

  if (!data) return <div className="panel"><div className="panel-title">Network</div><div className="text-white/30 text-xs">Loading…</div></div>

  const activeIfaces = data.interfaces.filter(i => i.type !== 'loopback')

  return (
    <div className="panel">
      <div className="panel-title">Network</div>

      <div className="flex gap-4 mb-3">
        <div>
          <div className="text-[10px] text-white/40">↓ Download</div>
          <div className="text-lg font-bold text-accent-green">
            {formatBps(data.total_download_bytes_per_sec)}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-white/40">↑ Upload</div>
          <div className="text-lg font-bold text-accent-cyan">
            {formatBps(data.total_upload_bytes_per_sec)}
          </div>
        </div>
      </div>

      <div className="h-20 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="idx" hide />
            <YAxis hide />
            <Tooltip
              formatter={(v: number, name: string) => [formatBps(v), name === 'down' ? '↓' : '↑']}
              contentStyle={{ background: '#1a1a2e', border: 'none', fontSize: 11, color: '#fff' }}
              labelFormatter={() => ''}
            />
            <Line
              type="monotone"
              dataKey="down"
              stroke="#00ff88"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="up"
              stroke="#00d9ff"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-1">
        {activeIfaces.map(iface => (
          <div key={iface.name} className="flex items-center justify-between text-[10px]">
            <span className="text-white/40 capitalize">{iface.name} ({iface.type})</span>
            <span className="text-white/60">
              {iface.ip_internal ?? '—'}
              {' '}
              {iface.signal_dbm != null && `· ${iface.signal_dbm} dBm`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
