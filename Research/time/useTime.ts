// src/composables/useTime.ts
import { ref, onUnmounted } from 'vue'
import { TimeManager, type TimeData } from '@/utils/timeManager'

/**
 * 使用时间的组合式函数
 * 在 Vue 组件中轻松使用时间功能
 */

export function useTime() {
  const currentTime = ref<TimeData | null>(null)
  const isRunning = ref(false)
  const error = ref<string | null>(null)
  const isLoading = ref(false)
  
  const timeManager = new TimeManager()
  
  // 初始化
  const init = async () => {
    try {
      isLoading.value = true
      error.value = null
      await timeManager.init()
      
      // 监听时间更新
      timeManager.onTimeUpdate((timeData) => {
        currentTime.value = timeData
      })
      
      // 监听错误
      timeManager.onError((errorMessage) => {
        error.value = errorMessage
      })
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : '初始化失败'
    } finally {
      isLoading.value = false
    }
  }

  // 启动
  const start = async (options?: { interval?: number; format?: string }) => {
    try {
      error.value = null
      await timeManager.start(options)
      isRunning.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '启动失败'
    }
  }

  // 停止
  const stop = async () => {
    try {
      await timeManager.stop()
      isRunning.value = false
    } catch (err) {
      error.value = err instanceof Error ? err.message : '停止失败'
    }
  }

  // 设置格式
  const setFormat = async (format: string) => {
    try {
      await timeManager.setFormat(format)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '设置格式失败'
    }
  }

  // 组件卸载时清理
  onUnmounted(() => {
    timeManager.destroy()
  })

  return {
    // 状态
    currentTime,
    isRunning,
    error,
    isLoading,
    
    // 方法
    init,
    start,
    stop,
    setFormat
  }
}