// src/utils/WorkerManager.ts
import { ref, type Ref } from 'vue'

/**
 * WebWorker 消息接口
 * @template T 消息载荷类型
 * @property type 消息类型，用于标识不同的处理逻辑
 * @property payload 消息数据载荷
 * @property id 可选的消息ID，用于请求-响应匹配
 */
export interface WorkerMessage<T = any> {
  type: string
  payload?: T
  id?: string
}

/**
 * Worker 管理类
 * 提供对 Web Worker 的统一管理，包括消息发送、响应处理、事件监听等功能
 * @template T Worker 返回的数据类型
 */
export class WorkerManager<T> {
  // 存储 Worker 实例
  private worker: Worker | null = null
  
  // 存储异步调用的回调函数，key 为消息ID，value 为回调函数
  private callbacks = new Map<string, (data: any) => void>()
  
  // 消息ID计数器，确保每个消息有唯一标识
  private messageId = 0
  
  // 事件监听器映射，用于处理全局事件
  private listeners = new Map<string, Array<(data: any) => void>>()

  /**
   * 构造函数
   * @param workerUrl Worker 文件的URL或路径
   * @param options Worker 配置选项
   */
  constructor(
    private workerUrl: string,
    private options?: WorkerOptions
  ) {}

  /**
   * 初始化 Worker
   * 创建 Worker 实例并设置消息、错误、消息错误事件监听器
   */
  init(): void {
    // 防止重复初始化
    if (this.worker) return
    
    // 创建 Worker 实例
    this.worker = new Worker(this.workerUrl, this.options)
    
    // 监听 Worker 返回的消息
    this.worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const { type, payload, id } = event.data
      
      // 如果有消息ID，说明是异步请求的响应，调用对应的回调函数
      if (id && this.callbacks.has(id)) {
        const callback = this.callbacks.get(id)!
        callback(payload)
        this.callbacks.delete(id) // 回调后删除，避免内存泄漏
      }
      
      // 触发对应类型的全局事件
      this.emit(type, payload)
    }
    
    // 监听 Worker 错误
    this.worker.onerror = (error) => {
      this.emit('error', error)
    }
    
    // 监听 Worker 消息解析错误
    this.worker.onmessageerror = (error) => {
      this.emit('messageerror', error)
    }
  }

  /**
   * 发送消息到 Worker
   * @param message 要发送的消息对象
   * @returns 消息ID，用于后续识别响应
   */
  postMessage(message: WorkerMessage): string {
    // 如果 Worker 未初始化，先进行初始化
    if (!this.worker) {
      this.init()
    }
    
    // 生成唯一的消息ID
    const id = `msg_${Date.now()}_${++this.messageId}`
    const messageWithId = { ...message, id }
    
    // 发送消息
    this.worker!.postMessage(messageWithId)
    return id
  }

  /**
   * 发送消息并等待响应（Promise 封装）
   * @template R 期望的响应数据类型
   * @param type 消息类型
   * @param payload 消息载荷
   * @returns Promise，包含 Worker 返回的数据
   */
  async sendMessage<R>(type: string, payload?: any): Promise<R> {
    return new Promise((resolve, reject) => {
      // 发送消息并获取消息ID
      const id = this.postMessage({ type, payload })
      
      // 存储回调函数，在收到响应时调用
      this.callbacks.set(id, (data) => {
        resolve(data)
      })
      
      // 设置超时处理，避免 Promise 永远挂起
      setTimeout(() => {
        if (this.callbacks.has(id)) {
          this.callbacks.delete(id)
          reject(new Error(`Worker 响应超时: ${type}`))
        }
      }, 30000) // 30秒超时
    })
  }

  /**
   * 注册事件监听器
   * @param event 事件名称
   * @param callback 回调函数
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  /**
   * 移除事件监听器
   * @param event 事件名称
   * @param callback 要移除的回调函数
   */
  off(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) return
    
    const callbacks = this.listeners.get(event)!
    const index = callbacks.indexOf(callback)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  }

  /**
   * 触发事件
   * 调用指定事件的所有监听器
   * @param event 事件名称
   * @param data 事件数据
   * @private
   */
  private emit(event: string, data: any): void {
    if (this.listeners.has(event)) {
      // 遍历调用所有监听器
      this.listeners.get(event)!.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`事件 ${event} 的监听器执行错误:`, error)
        }
      })
    }
  }

  /**
   * 获取 Worker 实例
   * 如果 Worker 未初始化，会先进行初始化
   */
  getWorker(): Worker | null {
    if (!this.worker) {
      this.init()
    }
    return this.worker
  }

  /**
   * 检查 Worker 是否正在运行
   */
  isRunning(): boolean {
    return this.worker !== null
  }

  /**
   * 获取活跃的回调数量
   * 用于调试和监控
   */
  getPendingCallbacksCount(): number {
    return this.callbacks.size
  }

  /**
   * 获取活跃的监听器数量
   */
  getActiveListenersCount(): number {
    let count = 0
    this.listeners.forEach(callbacks => {
      count += callbacks.length
    })
    return count
  }

  /**
   * 终止 Worker
   * 清理所有资源，包括回调函数和事件监听器
   */
  terminate(): void {
    if (this.worker) {
      // 终止 Worker
      this.worker.terminate()
      this.worker = null
      
      // 清理所有回调函数
      this.callbacks.clear()
      
      // 清理所有事件监听器
      this.listeners.clear()
      
      // 触发终止事件
      this.emit('terminated', null)
    }
  }

  /**
   * 重启 Worker
   * 先终止当前 Worker，然后重新初始化
   */
  restart(): void {
    this.terminate()
    this.init()
  }

  /**
   * 清理过期的回调函数
   * 防止内存泄漏，可以定期调用
   * @param maxAge 最大存活时间（毫秒），默认5分钟
   */
  cleanupExpiredCallbacks(maxAge: number = 5 * 60 * 1000): void {
    const now = Date.now()
    const expiredIds: string[] = []
    
    this.callbacks.forEach((_, id) => {
      // 从消息ID中提取时间戳
      const timestamp = parseInt(id.split('_')[1])
      if (now - timestamp > maxAge) {
        expiredIds.push(id)
      }
    })
    
    // 移除过期的回调
    expiredIds.forEach(id => {
      this.callbacks.delete(id)
    })
    
    if (expiredIds.length > 0) {
      console.warn(`清理了 ${expiredIds.length} 个过期的回调函数`)
    }
  }
}

/**
 * Worker 状态管理
 * 提供对 Worker 运行状态的管理
 */
export class WorkerStateManager {
  // Worker 状态枚举
  static readonly STATES = {
    IDLE: 'idle',        // 空闲
    BUSY: 'busy',        // 忙碌
    ERROR: 'error',      // 错误
    TERMINATED: 'terminated' // 已终止
  } as const

  private state: string = WorkerStateManager.STATES.IDLE
  private startTime: number | null = null
  private error: Error | null = null

  /**
   * 设置 Worker 状态
   * @param newState 新状态
   */
  setState(newState: string): void {
    this.state = newState
    
    if (newState === WorkerStateManager.STATES.BUSY) {
      this.startTime = Date.now()
    } else if (newState === WorkerStateManager.STATES.IDLE) {
      this.startTime = null
    }
  }

  /**
   * 获取当前状态
   */
  getState(): string {
    return this.state
  }

  /**
   * 设置错误信息
   * @param error 错误对象
   */
  setError(error: Error): void {
    this.error = error
    this.setState(WorkerStateManager.STATES.ERROR)
  }

  /**
   * 获取错误信息
   */
  getError(): Error | null {
    return this.error
  }

  /**
   * 获取任务执行时间
   * @returns 执行时间（毫秒），如果没有任务在执行则返回 null
   */
  getExecutionTime(): number | null {
    if (this.startTime) {
      return Date.now() - this.startTime
    }
    return null
  }
}

/**
 * Worker 性能监控
 * 记录 Worker 的性能指标
 */
export class WorkerPerformanceMonitor {
  private executionTimes: number[] = []
  private errorCount = 0
  private successCount = 0
  
  // 性能指标配置
  private config = {
    maxRecords: 100,      // 最大记录数
    warningThreshold: 1000 // 警告阈值（毫秒）
  }

  /**
   * 记录任务执行时间
   * @param duration 执行时间（毫秒）
   */
  recordExecution(duration: number): void {
    this.executionTimes.push(duration)
    
    // 保持记录数量不超过最大值
    if (this.executionTimes.length > this.config.maxRecords) {
      this.executionTimes.shift()
    }
    
    this.successCount++
    
    // 如果执行时间超过阈值，记录警告
    if (duration > this.config.warningThreshold) {
      console.warn(`Worker 任务执行时间过长: ${duration}ms`)
    }
  }

  /**
   * 记录错误
   */
  recordError(): void {
    this.errorCount++
  }

  /**
   * 获取平均执行时间
   */
  getAverageExecutionTime(): number {
    if (this.executionTimes.length === 0) return 0
    const sum = this.executionTimes.reduce((a, b) => a + b, 0)
    return sum / this.executionTimes.length
  }

  /**
   * 获取成功率
   */
  getSuccessRate(): number {
    const total = this.successCount + this.errorCount
    if (total === 0) return 0
    return (this.successCount / total) * 100
  }

  /**
   * 重置性能记录
   */
  reset(): void {
    this.executionTimes = []
    this.errorCount = 0
    this.successCount = 0
  }
}