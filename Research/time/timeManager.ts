// src/utils/timeManager.ts
import { WorkerManager } from './workerManager'

/**
 * 时间管理器
 * 封装时间相关的业务逻辑
 */

export interface TimeData {
  timestamp: number
  isoString: string
  formatted: string
  timezone: string
  format: string
}

export class TimeManager {
  private workerManager: WorkerManager
  private timeUpdateCallbacks: Set<(time: TimeData) => void> = new Set()
  private errorCallbacks: Set<(error: string) => void> = new Set()
  private isRunning = false

  constructor() {
    // 使用 Vite 的 worker 导入方式
    this.workerManager = new WorkerManager(
      new URL('../workers/time.worker.ts', import.meta.url)
    )
    
    this.setupEventListeners()
  }

  // 设置事件监听
  private setupEventListeners() {
    this.workerManager.on('TIME_UPDATE', (data: TimeData) => {
      this.timeUpdateCallbacks.forEach(callback => callback(data))
    })
    
    this.workerManager.on('ERROR', (error: { message: string }) => {
      this.errorCallbacks.forEach(callback => callback(error.message))
    })
    
    this.workerManager.on('STARTED', () => {
      this.isRunning = true
    })
    
    this.workerManager.on('STOPPED', () => {
      this.isRunning = false
    })
  }

  // 初始化
  async init(): Promise<void> {
    await this.workerManager.init()
  }

  // 启动时间更新
  async start(options: { interval?: number; format?: string } = {}): Promise<void> {
    await this.workerManager.sendMessage('START', options)
  }

  // 停止时间更新
  async stop(): Promise<void> {
    await this.workerManager.sendMessage('STOP')
  }

  // 设置时间格式
  async setFormat(format: string): Promise<void> {
    await this.workerManager.sendMessage('SET_FORMAT', format)
  }

  // 设置更新间隔
  async setInterval(interval: number): Promise<void> {
    await this.workerManager.sendMessage('SET_INTERVAL', interval)
  }

  // 获取当前时间（单次）
  async getCurrentTime(): Promise<TimeData> {
    return await this.workerManager.sendMessage('GET_CURRENT_TIME')
  }

  // 监听时间更新
  onTimeUpdate(callback: (time: TimeData) => void): () => void {
    this.timeUpdateCallbacks.add(callback)
    
    // 返回取消监听函数
    return () => {
      this.timeUpdateCallbacks.delete(callback)
    }
  }

  // 监听错误
  onError(callback: (error: string) => void): () => void {
    this.errorCallbacks.add(callback)
    
    return () => {
      this.errorCallbacks.delete(callback)
    }
  }

  // 获取运行状态
  getIsRunning(): boolean {
    return this.isRunning
  }

  // 销毁
  destroy() {
    this.stop()
    this.timeUpdateCallbacks.clear()
    this.errorCallbacks.clear()
    this.workerManager.terminate()
  }
}