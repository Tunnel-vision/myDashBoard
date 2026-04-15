// ── Standard REST response wrapper ─────────────────────────────────────────

export interface ApiResponse<T> {
  code: number
  message: string
  data: T | null
  timestamp: string
}

// ── CPU ─────────────────────────────────────────────────────────────────────

export interface CpuCore {
  index: number
  usage_percent: number
}

export interface CpuData {
  model: string
  core_count: number
  cores: CpuCore[]
  total_usage_percent: number
  temperature_celsius: number | null
  fan_speed_rpm: number[]
}

// ── Memory ──────────────────────────────────────────────────────────────────

export type MemoryPressure = 'normal' | 'warn' | 'critical'

export interface MemoryData {
  total_bytes: number
  used_bytes: number
  free_bytes: number
  usage_percent: number
  pressure: MemoryPressure
  swap_total_bytes: number
  swap_used_bytes: number
  swap_free_bytes: number
  swap_usage_percent: number
}

// ── Disk ─────────────────────────────────────────────────────────────────────

export interface DiskPartition {
  mountpoint: string
  filesystem: string
  total_bytes: number
  used_bytes: number
  free_bytes: number
  usage_percent: number
}

export interface DiskIoStats {
  read_bytes_per_sec: number
  write_bytes_per_sec: number
  read_ops_per_sec: number
  write_ops_per_sec: number
}

export interface DiskData {
  partitions: DiskPartition[]
  io_stats: DiskIoStats
}

// ── GPU ─────────────────────────────────────────────────────────────────────

export type GpuType = 'integrated' | 'discrete'

export interface GpuData {
  name: string
  type: GpuType
  usage_percent: number
  memory_total_bytes: number
  memory_used_bytes: number
  memory_usage_percent: number
  temperature_celsius: number | null
  core_count: number
}

// ── Network ─────────────────────────────────────────────────────────────────

export type NetworkInterfaceType = 'wifi' | 'ethernet' | 'loopback'

export interface NetworkInterface {
  name: string
  type: NetworkInterfaceType
  ip_internal: string | null
  ip_external: string | null
  download_bytes_per_sec: number
  upload_bytes_per_sec: number
  signal_dbm: number | null
  link_speed_mbps: number | null
}

export interface NetworkData {
  interfaces: NetworkInterface[]
  total_download_bytes_per_sec: number
  total_upload_bytes_per_sec: number
}

// ── Battery ─────────────────────────────────────────────────────────────────

export type PowerSource = 'Battery' | 'AC Power' | 'Unknown'

export interface BatteryData {
  is_present: boolean
  charge_percent: number
  is_charging: boolean
  is_plugged_in: boolean
  health_percent: number
  cycle_count: number
  time_remaining_secs: number | null
  time_to_full_secs: number | null
  design_capacity_mah: number
  max_capacity_mah: number
  current_capacity_mah: number
  temperature_celsius: number
  power_source: PowerSource
}

// ── Sensors ─────────────────────────────────────────────────────────────────

export interface FanSpeed {
  fan: number
  speed_rpm: number
  min_rpm: number
  max_rpm: number
}

export interface SensorData {
  cpu_temperature_celsius: number | null
  cpu_proximity_celsius: number | null
  motherboard_celsius: number | null
  battery_temperature_celsius: number | null
  gpu_temperature_celsius: number | null
  fan_speeds_rpm: FanSpeed[]
  throttling: boolean
}

// ── System ──────────────────────────────────────────────────────────────────

export type SystemArch = 'arm64' | 'x86_64'

export interface SystemData {
  hostname: string
  os_version: string
  kernel_version: string
  uptime_secs: number
  load_avg_1m: number
  load_avg_5m: number
  load_avg_15m: number
  platform: string
  arch: SystemArch
  boot_time: string
}

// ── Processes ────────────────────────────────────────────────────────────────

export interface ProcessEntry {
  pid: number
  name: string
  cpu_percent: number
  memory_bytes: number
}

export interface ProcessData {
  cpu_top: ProcessEntry[]
  memory_top: ProcessEntry[]
}

// ── /all endpoint ───────────────────────────────────────────────────────────

export interface AllMetricsData {
  cpu: CpuData
  memory: MemoryData
  disk: DiskData
  gpu: GpuData
  network: NetworkData
  battery: BatteryData
  sensors: SensorData
  system: SystemData
  processes: ProcessData
}

// ── /history endpoint ───────────────────────────────────────────────────────

export interface HistoryPoint {
  timestamp: string
  value: number
}

export interface HistoryData {
  category: string
  interval_secs: number
  points: HistoryPoint[]
}

// ── WebSocket messages ──────────────────────────────────────────────────────

// Client → Server
export type WsClientMessage =
  | { action: 'subscribe'; categories: string[] }
  | { action: 'unsubscribe'; categories: string[] }
  | { action: 'ping' }

// Server → Client
export interface WsMetricsMessage {
  type: 'metrics'
  timestamp: string
  interval_ms: number
  data: Partial<AllMetricsData>
}

export interface WsPongMessage {
  type: 'pong'
  timestamp: string
}

export interface WsErrorMessage {
  type: 'error'
  code: number
  message: string
}

export type WsServerMessage = WsMetricsMessage | WsPongMessage | WsErrorMessage

// ── Partial metrics used by useMetrics state ─────────────────────────────────

export type MetricsState = Partial<AllMetricsData>

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
