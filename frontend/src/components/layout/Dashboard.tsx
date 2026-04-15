import type { ReactNode } from 'react'
import { Header } from './Header'
import type { ConnectionStatus, SystemData } from '../../types/metrics'

interface DashboardProps {
  children: ReactNode
  system: SystemData | undefined
  connectionStatus: ConnectionStatus
}

export function Dashboard({ children, system, connectionStatus }: DashboardProps) {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <Header
        hostname={system?.hostname}
        uptimeSecs={system?.uptime_secs}
        status={connectionStatus}
      />
      <main className="flex-1 p-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-min">
          {children}
        </div>
      </main>
    </div>
  )
}
