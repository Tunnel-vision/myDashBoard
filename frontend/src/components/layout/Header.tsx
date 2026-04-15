import type { ConnectionStatus } from '../../types/metrics'
import { formatUptime } from '../../utils/format'

interface HeaderProps {
  hostname: string | undefined
  uptimeSecs: number | undefined
  status: ConnectionStatus
}

const statusLabel: Record<ConnectionStatus, string> = {
  connecting: 'Connecting…',
  connected: 'Live',
  reconnecting: 'Reconnecting…',
  disconnected: 'Disconnected',
}

export function Header({ hostname, uptimeSecs, status }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-bg-panel/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-bold tracking-widest text-accent-cyan uppercase">
          myDashBoard
        </h1>
        {hostname && (
          <span className="text-xs text-white/50 font-mono">{hostname}</span>
        )}
      </div>

      <div className="flex items-center gap-6">
        {uptimeSecs != null && (
          <span className="text-xs text-white/40 font-mono">
            uptime {formatUptime(uptimeSecs)}
          </span>
        )}
        <div className="flex items-center gap-2">
          <span className={`status-dot status-${status.replace('ing', '')}`} />
          <span className="text-xs text-white/60 font-mono">
            {statusLabel[status]}
          </span>
        </div>
      </div>
    </header>
  )
}
