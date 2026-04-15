import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { SensorData } from '../../types/metrics'
import { formatTemp } from '../../utils/format'

interface SensorPanelProps {
  data: SensorData | undefined
}

const TEMP_COLOR = (t: number | null) => {
  if (t == null) return '#ffffff22'
  if (t < 50) return '#00ff88'
  if (t < 70) return '#ffd600'
  return '#ff4444'
}

export function SensorPanel({ data }: SensorPanelProps) {
  if (!data) return <div className="panel"><div className="panel-title">Sensors</div><div className="text-white/30 text-xs">Loading…</div></div>

  const temps = [
    { label: 'CPU', value: data.cpu_temperature_celsius },
    { label: 'CPU Prox', value: data.cpu_proximity_celsius },
    { label: 'MB', value: data.motherboard_celsius },
    { label: 'Battery', value: data.battery_temperature_celsius },
    { label: 'GPU', value: data.gpu_temperature_celsius },
  ].filter(t => t.value != null)

  return (
    <div className="panel">
      <div className="panel-title">Sensors</div>

      {data.throttling && (
        <div className="mb-2 px-2 py-1 bg-accent-red/20 border border-accent-red/40 rounded text-xs text-accent-red">
          ⚠ Thermal throttling active
        </div>
      )}

      {temps.length > 0 && (
        <div className="h-20 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={temps} margin={{ top: 2, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fill: '#ffffff44', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#ffffff44', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}°`}
              />
              <Tooltip
                formatter={(v: number) => [formatTemp(v), 'Temp']}
                contentStyle={{ background: '#1a1a2e', border: 'none', fontSize: 11, color: '#fff' }}
              />
              <Bar dataKey="value" radius={[2, 2, 0, 0]} isAnimationActive={false}>
                {temps.map((t, i) => (
                  <Cell key={i} fill={TEMP_COLOR(t.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {data.fan_speeds_rpm.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] text-white/40 uppercase tracking-wider">Fan Speeds</div>
          {data.fan_speeds_rpm.map(fan => {
            const pct = fan.max_rpm > 0 ? (fan.speed_rpm / fan.max_rpm) * 100 : 0
            return (
              <div key={fan.fan}>
                <div className="flex justify-between text-[10px] text-white/60 mb-0.5">
                  <span>Fan {fan.fan}</span>
                  <span>{fan.speed_rpm} RPM</span>
                </div>
                <div className="w-full bg-white/10 rounded-sm h-1.5">
                  <div
                    className="bg-accent-cyan rounded-sm h-1.5 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {temps.length === 0 && data.fan_speeds_rpm.length === 0 && (
        <div className="text-xs text-white/30">No sensor data available</div>
      )}
    </div>
  )
}
