import {
  RadialBarChart,
  RadialBar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { BatteryData } from '../../types/metrics'
import { formatPct, formatTemp } from '../../utils/format'

interface BatteryPanelProps {
  data: BatteryData | undefined
}

const HEALTH_COLOR = (pct: number) =>
  pct >= 80 ? '#00ff88' : pct >= 50 ? '#ffd600' : '#ff4444'

export function BatteryPanel({ data }: BatteryPanelProps) {
  if (!data) return <div className="panel"><div className="panel-title">Battery</div><div className="text-white/30 text-xs">Loading…</div></div>

  if (!data.is_present) {
    return (
      <div className="panel">
        <div className="panel-title">Battery</div>
        <div className="text-xs text-white/30">No battery (desktop Mac)</div>
      </div>
    )
  }

  const chargeColor =
    data.charge_percent <= 20 ? '#ff4444' :
    data.charge_percent <= 50 ? '#ffd600' :
    '#00ff88'

  const radialData = [{ name: 'charge', value: data.charge_percent, fill: chargeColor }]

  return (
    <div className="panel">
      <div className="panel-title">Battery</div>

      <div className="flex items-center gap-3">
        <div className="h-24 w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              data={radialData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                background={{ fill: '#1a1a2e' }}
                dataKey="value"
                isAnimationActive={false}
                cornerRadius={4}
              />
              <Tooltip
                formatter={(v: number) => [`${v}%`, 'Charge']}
                contentStyle={{ background: '#1a1a2e', border: 'none', fontSize: 11, color: '#fff' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="text-center -mt-12 text-lg font-bold" style={{ color: chargeColor }}>
            {data.charge_percent}%
          </div>
        </div>

        <div className="flex-1 space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${data.is_charging ? 'bg-accent-green animate-pulse' : data.is_plugged_in ? 'bg-accent-yellow' : 'bg-white/20'}`} />
            <span className="text-white/60">
              {data.is_charging ? 'Charging' : data.is_plugged_in ? 'Plugged In' : 'On Battery'}
            </span>
          </div>

          <div>
            <div className="text-[10px] text-white/40">Health</div>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-white/10 rounded-sm h-1.5">
                <div
                  className="h-1.5 rounded-sm transition-all"
                  style={{ width: `${data.health_percent}%`, backgroundColor: HEALTH_COLOR(data.health_percent) }}
                />
              </div>
              <span style={{ color: HEALTH_COLOR(data.health_percent) }}>
                {formatPct(data.health_percent)}
              </span>
            </div>
          </div>

          <div className="text-white/30 text-[10px]">
            {data.cycle_count} cycles · {formatTemp(data.temperature_celsius)}
          </div>

          {data.time_to_full_secs != null && data.is_charging && (
            <div className="text-white/30 text-[10px]">
              → full in {Math.floor(data.time_to_full_secs / 3600)}h {Math.floor((data.time_to_full_secs % 3600) / 60)}m
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
