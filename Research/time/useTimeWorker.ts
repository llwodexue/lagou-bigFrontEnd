// src/composables/useTimeWorker.ts
import { ref, onMounted, onUnmounted, readonly } from 'vue'
import { TimeManager, type TimeData } from '@/utils/TimeManager'

/**
 * 使用时间 Worker 的组合式函数
 */
export function useTimeWorker() {
  const currentTime = ref<TimeData | null>(null)
  const isRunning = ref(false)
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  let timeManager: TimeManager | null = null
  let unsubscribe: (() => void) | null = null

  /**
   * 初始化时间管理器
   */
  const init = async () => {
    if (timeManager) return

    try {
      isLoading.value = true
      timeManager = new TimeManager()

      // 监听时间更新
      unsubscribe = timeManager.onTimeUpdate(timeData => {
        currentTime.value = timeData
        error.value = null
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : '初始化时间管理器失败'
      console.error('初始化时间管理器失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 启动时间更新
   */
  const start = async (options: { interval?: number; format?: string } = {}) => {
    if (!timeManager) {
      await init()
    }

    try {
      await timeManager!.startClock(options)
      isRunning.value = true
      error.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : '启动时间更新失败'
      isRunning.value = false
    }
  }

  /**
   * 停止时间更新
   */
  const stop = async () => {
    if (!timeManager) return

    try {
      await timeManager.stopClock()
      isRunning.value = false
      error.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : '停止时间更新失败'
    }
  }

  /**
   * 获取当前时间（单次）
   */
  const getCurrentTime = async (format: string = '24h'): Promise<TimeData | null> => {
    if (!timeManager) {
      await init()
    }

    try {
      return await timeManager!.getCurrentTime(format)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取当前时间失败'
      return null
    }
  }

  /**
   * 格式化时间
   */
  const formatTime = async (
    timestamp: number,
    format: string,
    timezone?: string
  ): Promise<string | null> => {
    if (!timeManager) {
      await init()
    }

    try {
      return await timeManager!.formatTime(timestamp, format, timezone)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '格式化时间失败'
      return null
    }
  }

  /**
   * 切换时间格式
   */
  const switchFormat = async (format: string, restart: boolean = true) => {
    if (!timeManager) return

    const wasRunning = isRunning.value

    if (wasRunning) {
      await stop()
    }

    if (restart || wasRunning) {
      await start({ format })
    }
  }

  /**
   * 切换更新频率
   */
  const switchInterval = async (interval: number) => {
    if (!timeManager) return

    const wasRunning = isRunning.value

    if (wasRunning) {
      // 如果正在运行，重启以应用新的间隔
      await stop()
      await start({ interval })
    }
  }

  // 组件挂载时自动初始化
  onMounted(() => {
    init()
  })

  // 组件卸载时清理资源
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
    if (timeManager) {
      timeManager.destroy()
      timeManager = null
    }
  })

  return {
    // 响应式状态
    currentTime: readonly(currentTime),
    isRunning: readonly(isRunning),
    error: readonly(error),
    isLoading: readonly(isLoading),

    // 方法
    init,
    start,
    stop,
    getCurrentTime,
    formatTime,
    switchFormat,
    switchInterval
  }
}
