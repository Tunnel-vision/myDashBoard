import type { ProcessData } from '../../types/metrics'
import { formatBytes, formatPct } from '../../utils/format'

interface ProcessPanelProps {
  data: ProcessData | undefined
}

export function ProcessPanel({ data }: ProcessPanelProps) {
  if (!data) return <div className="panel"><div className="panel-title">Processes</div><div className="text-white/30 text-xs">Loading…</div></div>

  const cpuTop = data.cpu_top ?? []
  const memTop = data.memory_top ?? []

  return (
    <div className="panel">
      <div className="panel-title">Processes</div>

      <div className="space-y-4">
        {/* CPU Top */}
        <div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Top by CPU</div>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-white/30 border-b border-white/5">
                <th className="text-left pb-1">Name</th>
                <th className="text-right pb-1">PID</th>
                <th className="text-right pb-1">CPU</th>
                <th className="text-right pb-1">MEM</th>
              </tr>
            </thead>
            <tbody>
              {cpuTop.slice(0, 6).map(p => (
                <tr key={`${p.pid}-${p.name}`} className="border-b border-white/5">
                  <td className="py-0.5 text-white/70 truncate max-w-[100px]" title={p.name}>{p.name}</td>
                  <td className="py-0.5 text-white/30 text-right font-mono">{p.pid}</td>
                  <td className="py-0.5 text-accent-cyan text-right font-mono">{formatPct(p.cpu_percent, 1)}</td>
                  <td className="py-0.5 text-white/50 text-right font-mono">{formatBytes(p.memory_bytes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Memory Top */}
        <div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Top by Memory</div>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-white/30 border-b border-white/5">
                <th className="text-left pb-1">Name</th>
                <th className="text-right pb-1">PID</th>
                <th className="text-right pb-1">MEM</th>
                <th className="text-right pb-1">CPU</th>
              </tr>
            </thead>
            <tbody>
              {memTop.slice(0, 6).map(p => (
                <tr key={`${p.pid}-${p.name}`} className="border-b border-white/5">
                  <td className="py-0.5 text-white/70 truncate max-w-[100px]" title={p.name}>{p.name}</td>
                  <td className="py-0.5 text-white/30 text-right font-mono">{p.pid}</td>
                  <td className="py-0.5 text-purple-400 text-right font-mono">{formatBytes(p.memory_bytes)}</td>
                  <td className="py-0.5 text-white/50 text-right font-mono">{formatPct(p.cpu_percent, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
