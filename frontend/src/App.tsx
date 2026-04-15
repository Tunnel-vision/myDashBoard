import { Dashboard } from './components/layout/Dashboard'
import { CpuPanel } from './components/panels/CpuPanel'
import { MemoryPanel } from './components/panels/MemoryPanel'
import { DiskPanel } from './components/panels/DiskPanel'
import { GpuPanel } from './components/panels/GpuPanel'
import { NetworkPanel } from './components/panels/NetworkPanel'
import { BatteryPanel } from './components/panels/BatteryPanel'
import { SensorPanel } from './components/panels/SensorPanel'
import { SystemPanel } from './components/panels/SystemPanel'
import { ProcessPanel } from './components/panels/ProcessPanel'
import { useMetrics } from './hooks/useMetrics'

export default function App() {
  const { metrics, status } = useMetrics()

  return (
    <Dashboard system={metrics.system} connectionStatus={status}>
      <CpuPanel data={metrics.cpu} />
      <MemoryPanel data={metrics.memory} />
      <DiskPanel data={metrics.disk} />
      <GpuPanel data={metrics.gpu} />
      <NetworkPanel data={metrics.network} />
      <BatteryPanel data={metrics.battery} />
      <SensorPanel data={metrics.sensors} />
      <SystemPanel data={metrics.system} />
      <ProcessPanel data={metrics.processes} />
    </Dashboard>
  )
}
