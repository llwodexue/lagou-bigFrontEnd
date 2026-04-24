// src/workers/time.worker.ts
/**
 * 时间 Worker - 处理时间相关任务
 * 负责高精度计时、时区转换、时间格式化等耗时操作
 */

// 消息类型定义
export interface TimeMessage {
  type:
    | 'START_CLOCK'
    | 'STOP_CLOCK'
    | 'GET_CURRENT_TIME'
    | 'FORMAT_TIME'
    | 'CONVERT_TIMEZONE'
  payload?: any
}

export interface TimeResponse {
  type: 'CURRENT_TIME' | 'TIME_FORMATTED' | 'TIMEZONE_CONVERTED' | 'ERROR'
  payload: any
}

// Worker 上下文
const ctx: Worker = self as any

// 状态变量
let timer: number | null = null
let isRunning = false
let updateInterval = 1000 // 默认1秒更新一次
let subscribers: number = 0

// 支持的时间格式
const timeFormats = {
  '12h': { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true },
  '24h': { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false },
  date: { year: 'numeric', month: '2-digit', day: '2-digit' },
  datetime: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  },
  relative: {} // 相对时间格式
} as const

// 监听消息
ctx.onmessage = (event: MessageEvent<TimeMessage>) => {
  const { type, payload } = event.data

  try {
    switch (type) {
      case 'START_CLOCK':
        handleStartClock(payload)
        break

      case 'STOP_CLOCK':
        handleStopClock()
        break

      case 'GET_CURRENT_TIME':
        handleGetCurrentTime(payload)
        break

      case 'FORMAT_TIME':
        handleFormatTime(payload)
        break

      case 'CONVERT_TIMEZONE':
        handleConvertTimezone(payload)
        break

      default:
        sendError(`未知的消息类型: ${type}`)
    }
  } catch (error) {
    sendError(error instanceof Error ? error.message : '处理时间消息时发生错误')
  }
}

/**
 * 启动时钟
 */
function handleStartClock(payload: { interval?: number } = {}) {
  if (isRunning) {
    // 如果已经在运行，只更新间隔
    if (payload.interval && payload.interval !== updateInterval) {
      updateInterval = payload.interval
      restartTimer()
    }
    return
  }

  isRunning = true
  subscribers++
  updateInterval = payload.interval || updateInterval

  // 立即发送一次当前时间
  sendCurrentTime()

  // 启动定时器
  restartTimer()
}

/**
 * 停止时钟
 */
function handleStopClock() {
  if (subscribers > 0) {
    subscribers--
  }

  if (subscribers === 0 && timer !== null) {
    clearInterval(timer)
    timer = null
    isRunning = false
  }
}

/**
 * 获取当前时间（单次）
 */
function handleGetCurrentTime(payload: { format?: keyof typeof timeFormats } = {}) {
  const now = new Date()
  const response: TimeResponse = {
    type: 'CURRENT_TIME',
    payload: {
      timestamp: now.getTime(),
      isoString: now.toISOString(),
      formatted: formatTime(now, payload.format || '24h'),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }
  ctx.postMessage(response)
}

/**
 * 格式化时间
 */
function handleFormatTime(payload: {
  timestamp: number
  format: keyof typeof timeFormats
  timezone?: string
}) {
  const date = new Date(payload.timestamp)
  const formatted = formatTime(date, payload.format, payload.timezone)

  const response: TimeResponse = {
    type: 'TIME_FORMATTED',
    payload: {
      original: payload.timestamp,
      formatted,
      timezone: payload.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }
  ctx.postMessage(response)
}

/**
 * 转换时区
 */
function handleConvertTimezone(payload: {
  timestamp: number
  fromTimezone: string
  toTimezone: string
}) {
  try {
    const date = new Date(payload.timestamp)

    // 创建 fromTimezone 的时间字符串
    const fromTimeStr = date.toLocaleString('en-US', { timeZone: payload.fromTimezone })
    const fromDate = new Date(fromTimeStr)

    // 转换到 toTimezone
    const toTimeStr = fromDate.toLocaleString('en-US', { timeZone: payload.toTimezone })
    const convertedDate = new Date(toTimeStr)

    const response: TimeResponse = {
      type: 'TIMEZONE_CONVERTED',
      payload: {
        original: payload.timestamp,
        converted: convertedDate.getTime(),
        fromTimezone: payload.fromTimezone,
        toTimezone: payload.toTimezone,
        offset: convertedDate.getTime() - date.getTime()
      }
    }
    ctx.postMessage(response)
  } catch (error) {
    sendError(`时区转换失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 重启定时器
 */
function restartTimer() {
  if (timer !== null) {
    clearInterval(timer)
  }

  timer = setInterval(() => {
    if (isRunning) {
      sendCurrentTime()
    }
  }, updateInterval) as unknown as number
}

/**
 * 发送当前时间
 */
function sendCurrentTime(format: keyof typeof timeFormats = '24h') {
  const now = new Date()
  const response: TimeResponse = {
    type: 'CURRENT_TIME',
    payload: {
      timestamp: now.getTime(),
      isoString: now.toISOString(),
      formatted: formatTime(now, format),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      updateInterval
    }
  }
  ctx.postMessage(response)
}

/**
 * 格式化时间
 */
function formatTime(
  date: Date,
  format: keyof typeof timeFormats,
  timezone?: string
): string {
  if (format === 'relative') {
    return getRelativeTime(date)
  }

  const options: Intl.DateTimeFormatOptions = timeFormats[format]
  return date.toLocaleString(undefined, {
    ...options,
    timeZone: timezone
  })
}

/**
 * 获取相对时间
 */
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟前`
  if (diffHour < 24) return `${diffHour}小时前`
  if (diffDay < 7) return `${diffDay}天前`

  return date.toLocaleDateString()
}

/**
 * 发送错误信息
 */
function sendError(message: string) {
  const response: TimeResponse = {
    type: 'ERROR',
    payload: { message }
  }
  ctx.postMessage(response)
}

// Worker 初始化完成
ctx.postMessage({ type: 'WORKER_READY', payload: { version: '1.0.0' } })
