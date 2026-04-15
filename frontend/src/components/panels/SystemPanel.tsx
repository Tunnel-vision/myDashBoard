import type { SystemData } from '../../types/metrics'
import { formatUptime } from '../../utils/format'

interface SystemPanelProps {
  data: SystemData | undefined
}

export function SystemPanel({ data }: SystemPanelProps) {
  if (!data) return <div className="panel"><div className="panel-title">System</div><div className="text-white/30 text-xs">Loading…</div></div>

  return (
    <div className="panel">
      <div className="panel-title">System</div>

      <div className="space-y-2">
        <div>
          <div className="text-[10px] text-white/40 mb-1">Load Average</div>
          <div className="flex gap-4 text-xs font-mono">
            <LoadAvgItem label="1m" value={data.load_avg_1m} />
            <LoadAvgItem label="5m" value={data.load_avg_5m} />
            <LoadAvgItem label="15m" value={data.load_avg_15m} />
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-white/40">OS</span>
            <span className="text-white/70 text-right truncate max-w-[180px]" title={data.os_version}>
              {data.os_version}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Kernel</span>
            <span className="text-white/70 font-mono text-[10px]">{data.kernel_version}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Arch</span>
            <span className="text-white/70 font-mono text-[10px] uppercase">{data.arch}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Uptime</span>
            <span className="text-white/70">{formatUptime(data.uptime_secs)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadAvgItem({ label, value }: { label: string; value: number }) {
  const color =
    value < 1 ? 'text-accent-green' :
    value < 3 ? 'text-accent-yellow' :
    'text-accent-red'

  return (
    <div className="flex flex-col items-center">
      <span className={`font-bold ${color}`}>{value.toFixed(2)}</span>
      <span className="text-[9px] text-white/30">{label}</span>
    </div>
  )
}
