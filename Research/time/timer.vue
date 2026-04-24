<!-- src/components/TimeDisplay.vue -->
<template>
  <div class="time-display">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">
      <span>时间服务初始化中...</span>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <span>错误: {{ error }}</span>
      <button @click="init" class="retry-btn">重试</button>
    </div>
    
    <!-- 正常显示 -->
    <div v-else class="time-content">
      <!-- 主要时间显示 -->
      <div class="time-main">
        <h1>{{ displayTime }}</h1>
        <div class="time-details">
          <span>{{ displayDate }}</span>
          <span class="timezone">{{ currentTime?.timezone }}</span>
        </div>
      </div>
      
      <!-- 控制面板 -->
      <div class="controls">
        <button 
          @click="toggleClock" 
          :class="['control-btn', isRunning ? 'stop' : 'start']"
        >
          {{ isRunning ? '⏸️ 暂停' : '▶️ 开始' }}
        </button>
        
        <select v-model="selectedFormat" @change="onFormatChange" class="format-select">
          <option value="24h">24小时制</option>
          <option value="12h">12小时制</option>
          <option value="datetime">日期时间</option>
          <option value="date">仅日期</option>
        </select>
        
        <select v-model="selectedInterval" @change="onIntervalChange" class="interval-select">
          <option :value="1000">1秒</option>
          <option :value="500">0.5秒</option>
          <option :value="2000">2秒</option>
          <option :value="5000">5秒</option>
        </select>
      </div>
      
      <!-- 详细信息 -->
      <div v-if="showDetails" class="time-details-panel">
        <div class="detail-item">
          <label>时间戳:</label>
          <span>{{ currentTime?.timestamp }}</span>
        </div>
        <div class="detail-item">
          <label>ISO 格式:</label>
          <span>{{ currentTime?.isoString }}</span>
        </div>
        <div class="detail-item">
          <label>更新间隔:</label>
          <span>{{ currentTime?.updateInterval }}ms</span>
        </div>
      </div>
      
      <!-- 扩展功能 -->
      <div class="extra-features">
        <button @click="showDetails = !showDetails" class="toggle-details">
          {{ showDetails ? '隐藏详情' : '显示详情' }}
        </button>
        
        <button @click="refreshTime" class="refresh-btn" :disabled="isLoading">
          🔄 刷新
        </button>
      </div>
    </div>
    
    <!-- 状态指示器 -->
    <div class="status-indicator">
      <span 
        :class="['status-dot', isRunning ? 'running' : 'stopped']"
        :title="isRunning ? '运行中' : '已停止'"
      ></span>
      <span class="status-text">
        {{ isRunning ? '实时更新中' : '已暂停' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTimeWorker } from '@/composables/useTimeWorker'

// 使用时间 Worker
const { 
  currentTime, 
  isRunning, 
  error, 
  isLoading, 
  start, 
  stop, 
  init,
  switchFormat,
  switchInterval,
  getCurrentTime
} = useTimeWorker()

// 本地状态
const selectedFormat = ref('24h')
const selectedInterval = ref(1000)
const showDetails = ref(false)

// 计算显示的时间
const displayTime = computed(() => {
  if (!currentTime.value) return '--:--:--'
  return currentTime.value.formatted
})

// 计算显示的日期
const displayDate = computed(() => {
  if (!currentTime.value) return '加载中...'
  
  const date = new Date(currentTime.value.timestamp)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  })
})

// 切换时钟运行状态
const toggleClock = async () => {
  if (isRunning.value) {
    await stop()
  } else {
    await start({ 
      format: selectedFormat.value,
      interval: selectedInterval.value
    })
  }
}

// 格式改变处理
const onFormatChange = () => {
  switchFormat(selectedFormat.value, isRunning.value)
}

// 间隔改变处理
const onIntervalChange = () => {
  switchInterval(selectedInterval.value)
}

// 手动刷新时间
const refreshTime = async () => {
  await getCurrentTime(selectedFormat.value)
}

// 组件挂载时自动启动
onMounted(async () => {
  await start({ 
    format: selectedFormat.value,
    interval: selectedInterval.value
  })
})
</script>

<style scoped>
.time-display {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background: #f5f5f5;
}

.error {
  background: #ffe6e6;
  color: #d63031;
}

.retry-btn {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  background: #d63031;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.time-main {
  text-align: center;
  margin-bottom: 2rem;
}

.time-main h1 {
  font-size: 3.5rem;
  font-weight: 300;
  margin: 0;
  color: #2d3436;
  letter-spacing: 2px;
}

.time-details {
  margin-top: 1rem;
  color: #636e72;
  font-size: 1.1rem;
}

.timezone {
  margin-left: 1rem;
  padding: 0.2rem 0.5rem;
  background: #dfe6e9;
  border-radius: 4px;
  font-size: 0.9rem;
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.control-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn.start {
  background: #00b894;
  color: white;
}

.control-btn.stop {
  background: #e17055;
  color: white;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.format-select, .interval-select {
  padding: 0.75rem;
  border: 1px solid #b2bec3;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
}

.time-details-panel {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border-left: 4px solid #74b9ff;
}

.detail-item {
  display: flex;
  justify-content: between;
  margin-bottom: 0.5rem;
}

.detail-item label {
  font-weight: 600;
  min-width: 100px;
  color: #2d3436;
}

.extra-features {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.toggle-details, .refresh-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #b2bec3;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-details:hover, .refresh-btn:hover:not(:disabled) {
  background: #dfe6e9;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  color: #636e72;
  font-size: 0.9rem;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.status-dot.running {
  background: #00b894;
  animation: pulse 2s infinite;
}

.status-dot.stopped {
  background: #dfe6e9;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .time-display {
    padding: 1rem;
  }
  
  .time-main h1 {
    font-size: 2.5rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: center;
  }
  
  .control-btn, .format-select, .interval-select {
    width: 100%;
    max-width: 200px;
  }
}
</style>