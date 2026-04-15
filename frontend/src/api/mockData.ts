import type {
  ApiResponse,
  CpuData,
  MemoryData,
  DiskData,
  GpuData,
  NetworkData,
  BatteryData,
  SensorData,
  SystemData,
  ProcessData,
  ProcessEntry,
  AllMetricsData,
} from '../types/metrics'
import { Endpoints } from './endpoints'

// ── helpers ──────────────────────────────────────────────────────────────────

function jitter(base: number, pct = 0.15): number {
  return base + base * (Math.random() * 2 - 1) * pct
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

function now(): string {
  return new Date().toISOString()
}


// ── CPU mock ────────────────────────────────────────────────────────────────

function mockCpu(): ApiResponse<CpuData> {
  const coreCount = 11
  const cores = Array.from({ length: coreCount }, (_, i) => ({
    index: i,
    usage_percent: parseFloat(jitter(25, 0.5).toFixed(1)),
  }))
  const total = parseFloat((cores.reduce((s, c) => s + c.usage_percent, 0) / coreCount).toFixed(1))
  return {
    code: 0,
    message: 'success',
    data: {
      model: 'Apple M3 Pro',
      core_count: coreCount,
      cores,
      total_usage_percent: total,
      temperature_celsius: parseFloat(jitter(48, 0.2).toFixed(1)),
      fan_speed_rpm: [2156, 2012],
    },
    timestamp: now(),
  }
}

// ── Memory mock ─────────────────────────────────────────────────────────────

function mockMemory(): ApiResponse<MemoryData> {
  const total = 36 * 1024 ** 3 // 36 GB
  const used = Math.floor(jitter(total * 0.62))
  return {
    code: 0,
    message: 'success',
    data: {
      total_bytes: total,
      used_bytes: used,
      free_bytes: total - used,
      usage_percent: parseFloat(((used / total) * 100).toFixed(1)),
      pressure: 'normal',
      swap_total_bytes: 2 * 1024 ** 3,
      swap_used_bytes: Math.floor(jitter(200 * 1024 ** 2)),
      swap_free_bytes: 2 * 1024 ** 3,
      swap_usage_percent: parseFloat(jitter(5, 0.3).toFixed(1)),
    },
    timestamp: now(),
  }
}

// ── Disk mock ───────────────────────────────────────────────────────────────

function mockDisk(): ApiResponse<DiskData> {
  const rootTotal = 512 * 1024 ** 3
  const rootUsed = Math.floor(jitter(rootTotal * 0.55))
  return {
    code: 0,
    message: 'success',
    data: {
      partitions: [
        {
          mountpoint: '/',
          filesystem: 'apfs',
          total_bytes: rootTotal,
          used_bytes: rootUsed,
          free_bytes: rootTotal - rootUsed,
          usage_percent: parseFloat(((rootUsed / rootTotal) * 100).toFixed(1)),
        },
        {
          mountpoint: '/Volumes/Data',
          filesystem: 'apfs',
          total_bytes: 1024 * 1024 ** 3,
          used_bytes: Math.floor(jitter(300 * 1024 ** 3)),
          free_bytes: Math.floor(jitter(700 * 1024 ** 3)),
          usage_percent: parseFloat(jitter(30, 0.3).toFixed(1)),
        },
      ],
      io_stats: {
        read_bytes_per_sec: Math.floor(jitter(5 * 1024 ** 2)),
        write_bytes_per_sec: Math.floor(jitter(2 * 1024 ** 2)),
        read_ops_per_sec: Math.floor(jitter(150)),
        write_ops_per_sec: Math.floor(jitter(80)),
      },
    },
    timestamp: now(),
  }
}

// ── GPU mock ────────────────────────────────────────────────────────────────

function mockGpu(): ApiResponse<GpuData> {
  const memTotal = 36 * 1024 ** 3
  return {
    code: 0,
    message: 'success',
    data: {
      name: 'Apple M3 Pro GPU',
      type: 'integrated',
      usage_percent: parseFloat(jitter(18, 0.5).toFixed(1)),
      memory_total_bytes: memTotal,
      memory_used_bytes: Math.floor(jitter(memTotal * 0.28)),
      memory_usage_percent: parseFloat(jitter(28, 0.3).toFixed(1)),
      temperature_celsius: parseFloat(jitter(45, 0.2).toFixed(1)),
      core_count: 40,
    },
    timestamp: now(),
  }
}

// ── Network mock ────────────────────────────────────────────────────────────

function mockNetwork(): ApiResponse<NetworkData> {
  return {
    code: 0,
    message: 'success',
    data: {
      interfaces: [
        {
          name: 'en0',
          type: 'wifi',
          ip_internal: '192.168.1.100',
          ip_external: null,
          download_bytes_per_sec: Math.floor(jitter(2 * 1024 ** 2)),
          upload_bytes_per_sec: Math.floor(jitter(512 * 1024)),
          signal_dbm: -55,
          link_speed_mbps: 1200,
        },
        {
          name: 'en1',
          type: 'ethernet',
          ip_internal: '10.0.0.42',
          ip_external: null,
          download_bytes_per_sec: Math.floor(jitter(10 * 1024 ** 2)),
          upload_bytes_per_sec: Math.floor(jitter(5 * 1024 ** 2)),
          signal_dbm: null,
          link_speed_mbps: null,
        },
        {
          name: 'lo0',
          type: 'loopback',
          ip_internal: '127.0.0.1',
          ip_external: null,
          download_bytes_per_sec: 0,
          upload_bytes_per_sec: 0,
          signal_dbm: null,
          link_speed_mbps: null,
        },
      ],
      total_download_bytes_per_sec: Math.floor(jitter(12 * 1024 ** 2)),
      total_upload_bytes_per_sec: Math.floor(jitter(5.5 * 1024 ** 2)),
    },
    timestamp: now(),
  }
}

// ── Battery mock ────────────────────────────────────────────────────────────

function mockBattery(): ApiResponse<BatteryData> {
  return {
    code: 0,
    message: 'success',
    data: {
      is_present: true,
      charge_percent: 72,
      is_charging: false,
      is_plugged_in: true,
      health_percent: 91,
      cycle_count: 184,
      time_remaining_secs: null,
      time_to_full_secs: clamp(Math.floor(jitter(5400)), 0, 10800),
      design_capacity_mah: 8693,
      max_capacity_mah: 7910,
      current_capacity_mah: 6260,
      temperature_celsius: parseFloat(jitter(32, 0.1).toFixed(1)),
      power_source: 'AC Power',
    },
    timestamp: now(),
  }
}

// ── Sensors mock ────────────────────────────────────────────────────────────

function mockSensors(): ApiResponse<SensorData> {
  return {
    code: 0,
    message: 'success',
    data: {
      cpu_temperature_celsius: parseFloat(jitter(48, 0.2).toFixed(1)),
      cpu_proximity_celsius: parseFloat(jitter(46, 0.2).toFixed(1)),
      motherboard_celsius: parseFloat(jitter(42, 0.2).toFixed(1)),
      battery_temperature_celsius: parseFloat(jitter(32, 0.1).toFixed(1)),
      gpu_temperature_celsius: parseFloat(jitter(45, 0.2).toFixed(1)),
      fan_speeds_rpm: [
        { fan: 0, speed_rpm: Math.floor(jitter(2156, 0.1)), min_rpm: 1200, max_rpm: 6200 },
        { fan: 1, speed_rpm: Math.floor(jitter(2012, 0.1)), min_rpm: 1200, max_rpm: 6200 },
      ],
      throttling: false,
    },
    timestamp: now(),
  }
}

// ── System mock ─────────────────────────────────────────────────────────────

function mockSystem(): ApiResponse<SystemData> {
  const uptimeSecs = Math.floor(Date.now() / 1000) - new Date('2026-04-10T09:00:00Z').getTime() / 1000
  return {
    code: 0,
    message: 'success',
    data: {
      hostname: 'MacBook-Pro-M3',
      os_version: 'macOS 14.4 (Sonoma)',
      kernel_version: '23.4.0',
      uptime_secs: Math.floor(uptimeSecs),
      load_avg_1m: parseFloat(jitter(2.1, 0.3).toFixed(2)),
      load_avg_5m: parseFloat(jitter(1.8, 0.2).toFixed(2)),
      load_avg_15m: parseFloat(jitter(1.5, 0.2).toFixed(2)),
      platform: 'darwin',
      arch: 'arm64',
      boot_time: new Date(Date.now() - uptimeSecs * 1000).toISOString(),
    },
    timestamp: now(),
  }
}

// ── Processes mock ───────────────────────────────────────────────────────────

function mockProcesses(): ApiResponse<ProcessData> {
  const topNames = ['Code Helper', 'WindowServer', 'KernelTask', 'Spotlight', 'Dock', 'Safari', 'Terminal', 'npm', 'node', 'python3']
  const makeEntry = (name: string): ProcessEntry => ({
    pid: Math.floor(Math.random() * 50000) + 100,
    name,
    cpu_percent: parseFloat(jitter(15, 0.8).toFixed(1)),
    memory_bytes: Math.floor(jitter(300 * 1024 ** 2, 0.5)),
  })
  const cpuTop = topNames.slice(0, 5).map(makeEntry)
  const memTop = topNames.slice(0, 5).map(makeEntry)
  return { code: 0, message: 'success', data: { cpu_top: cpuTop, memory_top: memTop }, timestamp: now() }
}

// ── All mock ────────────────────────────────────────────────────────────────

function mockAll(): ApiResponse<AllMetricsData> {
  const cpu = mockCpu().data!
  const memory = mockMemory().data!
  const disk = mockDisk().data!
  const gpu = mockGpu().data!
  const network = mockNetwork().data!
  const battery = mockBattery().data!
  const sensors = mockSensors().data!
  const system = mockSystem().data!
  const processes = mockProcesses().data!
  return {
    code: 0,
    message: 'success',
    data: { cpu, memory, disk, gpu, network, battery, sensors, system, processes },
    timestamp: now(),
  }
}

// ── Exported mock registry ──────────────────────────────────────────────────

export const MockData: Record<string, () => ApiResponse<unknown>> = {
  [Endpoints.cpu]: mockCpu,
  [Endpoints.memory]: mockMemory,
  [Endpoints.disk]: mockDisk,
  [Endpoints.gpu]: mockGpu,
  [Endpoints.network]: mockNetwork,
  [Endpoints.battery]: mockBattery,
  [Endpoints.sensors]: mockSensors,
  [Endpoints.system]: mockSystem,
  [Endpoints.processes]: mockProcesses,
  [Endpoints.all]: mockAll,
}
