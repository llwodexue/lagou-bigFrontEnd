<!-- src/components/TimeDisplay.vue -->
<template>
  <div class="time-display">
    <h1>⏰ Web Worker 时间显示器</h1>

    <!-- 错误显示 -->
    <div v-if="error" class="error">
      {{ error }}
      <button @click="init" class="retry-btn">重试</button>
    </div>

    <!-- 加载状态 -->
    <div v-else-if="isLoading" class="loading">时间服务初始化中...</div>

    <!-- 正常显示 -->
    <div v-else class="time-content">
      <!-- 时间显示 -->
      <div class="time-main">
        <div class="time-text">{{ displayTime }}</div>
        <div class="date-text">{{ displayDate }}</div>
        <span class="timezone">{{ timezone }}</span>
      </div>

      <!-- 控制面板 -->
      <div class="controls">
        <button @click="toggle" :class="['control-btn', isRunning ? 'stop' : 'start']">
          {{ isRunning ? '⏸️ 暂停' : '▶️ 开始' }}
        </button>

        <select v-model="selectedFormat" @change="onFormatChange" class="format-select">
          <option value="24h">24小时制</option>
          <option value="12h">12小时制</option>
          <option value="date">仅日期</option>
          <option value="datetime">日期时间</option>
        </select>
      </div>

      <!-- 状态指示 -->
      <div class="status">
        <span class="status-dot" :class="isRunning ? 'running' : 'stopped'"></span>
        <span>{{ statusText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTime } from '@/composables/useTime'

// 使用时间功能
const { currentTime, isRunning, error, isLoading, init, start, stop, setFormat } =
  useTime()

// 本地状态
const selectedFormat = ref('24h')

// 计算属性
const displayTime = computed(() => {
  return currentTime.value?.formatted || '--:--:--'
})

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

const timezone = computed(() => {
  return currentTime.value?.timezone || '未知时区'
})

const statusText = computed(() => {
  return isRunning.value ? '实时更新中' : '已暂停'
})

// 方法
const toggle = async () => {
  if (isRunning.value) {
    await stop()
  } else {
    await start({ format: selectedFormat.value })
  }
}

const onFormatChange = () => {
  setFormat(selectedFormat.value)
}

// 组件挂载时初始化
onMounted(async () => {
  await init()
  await start({ format: selectedFormat.value })
})
</script>

<style scoped>
.time-display {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.time-main {
  margin: 2rem 0;
}

.time-text {
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 0.5rem;
}

.date-text {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.timezone {
  background: #f0f0f0;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.control-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.control-btn.start {
  background: #48bb78;
  color: white;
}

.control-btn.stop {
  background: #f56565;
  color: white;
}

.format-select {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #666;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.running {
  background: #48bb78;
  animation: pulse 1.5s infinite;
}

.status-dot.stopped {
  background: #ccc;
}

.error {
  background: #fed7d7;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.loading {
  color: #666;
  font-style: italic;
}

.retry-btn {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  background: #c53030;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
