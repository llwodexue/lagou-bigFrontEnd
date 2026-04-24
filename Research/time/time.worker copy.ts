// src/workers/time.worker.ts
/**
 * 时间处理 Worker
 * 负责时间的定时更新和格式化
 */

// Worker 全局上下文
const ctx: Worker = self as any

// 状态变量
let timer: number | null = null
let isRunning = false
let updateInterval = 1000
let currentFormat: TimeFormat = '24h'

// 时间格式类型
type TimeFormat = '24h' | '12h' | 'date' | 'datetime'

// 消息处理
ctx.onmessage = (event: MessageEvent) => {
  const { type, payload } = event.data
  
  switch (type) {
    case 'START':
      handleStart(payload)
      break
      
    case 'STOP':
      handleStop()
      break
      
    case 'SET_FORMAT':
      handleSetFormat(payload)
      break
      
    case 'SET_INTERVAL':
      handleSetInterval(payload)
      break
      
    case 'GET_CURRENT_TIME':
      handleGetCurrentTime()
      break
      
    default:
      sendError(`未知的消息类型: ${type}`)
  }
}

// 启动时间更新
function handleStart(payload?: { interval?: number; format?: TimeFormat }) {
  if (isRunning) {
    // 如果已经在运行，只更新配置
    if (payload?.interval && payload.interval !== updateInterval) {
      updateInterval = payload.interval
      restartTimer()
    }
    if (payload?.format) {
      currentFormat = payload.format
    }
    return
  }
  
  isRunning = true
  updateInterval = payload?.interval || updateInterval
  currentFormat = payload?.format || currentFormat
  
  // 立即发送一次时间
  sendTime()
  
  // 启动定时器
  restartTimer()
  
  sendMessage('STARTED', { interval: updateInterval, format: currentFormat })
}

// 停止时间更新
function handleStop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  isRunning = false
  sendMessage('STOPPED')
}

// 设置时间格式
function handleSetFormat(format: TimeFormat) {
  currentFormat = format
  if (isRunning) {
    sendTime() // 立即用新格式发送时间
  }
  sendMessage('FORMAT_CHANGED', { format })
}

// 设置更新间隔
function handleSetInterval(interval: number) {
  if (interval < 100) {
    sendError('更新间隔不能小于100毫秒')
    return
  }
  
  updateInterval = interval
  if (isRunning) {
    restartTimer()
  }
  sendMessage('INTERVAL_CHANGED', { interval })
}

// 获取当前时间（单次）
function handleGetCurrentTime() {
  sendTime()
}

// 重启定时器
function restartTimer() {
  if (timer) {
    clearInterval(timer)
  }
  
  timer = setInterval(() => {
    if (isRunning) {
      sendTime()
    }
  }, updateInterval) as unknown as number
}

// 发送当前时间
function sendTime() {
  const now = new Date()
  const timeData = {
    timestamp: now.getTime(),
    isoString: now.toISOString(),
    formatted: formatTime(now, currentFormat),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    format: currentFormat
  }
  
  sendMessage('TIME_UPDATE', timeData)
}

// 格式化时间
function formatTime(date: Date, format: TimeFormat): string {
  switch (format) {
    case '24h':
      return date.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      
    case '12h':
      return date.toLocaleTimeString('zh-CN', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      
    case 'date':
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
      
    case 'datetime':
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      
    default:
      return date.toLocaleTimeString('zh-CN', { hour12: false })
  }
}

// 发送消息到主线程
function sendMessage(type: string, payload?: any) {
  ctx.postMessage({ type, payload })
}

// 发送错误信息
function sendError(message: string) {
  sendMessage('ERROR', { message })
}

// Worker 初始化完成
sendMessage('WORKER_READY', { version: '1.0.0' })