import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { DiskData } from '../../types/metrics'
import { formatBytes, formatBps } from '../../utils/format'

interface DiskPanelProps {
  data: DiskData | undefined
}

const COLORS = ['#00d9ff', '#9d4edd', '#00ff88', '#ffd600', '#ff4444', '#ff8844']

export function DiskPanel({ data }: DiskPanelProps) {
  if (!data) return <div className="panel"><div className="panel-title">Disk</div><div className="text-white/30 text-xs">Loading…</div></div>

  const partitions = data.partitions ?? []

  return (
    <div className="panel">
      <div className="panel-title">Disk</div>

      {partitions.length > 0 ? (
        <div className="flex gap-4 items-center">
          <div className="h-28 w-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={partitions}
                  dataKey="usage_percent"
                  nameKey="mountpoint"
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={50}
                  paddingAngle={2}
                  isAnimationActive={false}
                >
                  {partitions.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number, name: string) => [`${v}%`, name]}
                  contentStyle={{ background: '#1a1a2e', border: 'none', fontSize: 11, color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-1.5">
            {partitions.map((p, i) => (
              <div key={p.mountpoint}>
                <div className="flex justify-between text-[10px] text-white/60 mb-0.5">
                  <span className="truncate max-w-[120px]" title={p.mountpoint}>
                    {p.mountpoint}
                  </span>
                  <span>{formatPct(p.usage_percent, 1)}</span>
                </div>
                <div className="w-full bg-white/10 rounded-sm h-1.5">
                  <div
                    className="rounded-sm h-1.5 transition-all duration-300"
                    style={{ width: `${p.usage_percent}%`, backgroundColor: COLORS[i % COLORS.length] }}
                  />
                </div>
                <div className="text-[9px] text-white/25">
                  {formatBytes(p.used_bytes)} / {formatBytes(p.total_bytes)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-xs text-white/30">No partitions found</div>
      )}

      {/* I/O stats */}
      {data.io_stats && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex gap-4">
            <div>
              <div className="text-[10px] text-white/40">Read</div>
              <div className="text-xs text-accent-cyan">{formatBps(data.io_stats.read_bytes_per_sec)}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40">Write</div>
              <div className="text-xs text-accent-yellow">{formatBps(data.io_stats.write_bytes_per_sec)}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40">R OPS</div>
              <div className="text-xs text-white/60">{data.io_stats.read_ops_per_sec}/s</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40">W OPS</div>
              <div className="text-xs text-white/60">{data.io_stats.write_ops_per_sec}/s</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function formatPct(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`
}
