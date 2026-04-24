<template>
  <div class="map-list-container">
    <!-- 左侧：列表 -->
    <div class="list-container" ref="listContainer" @scroll="handleListScroll">
      <div
        v-for="point in points"
        :key="point.id"
        :class="['list-item', { active: activePointId === point.id }]"
        :data-point-id="point.id"
        @click="handleListItemClick(point.id, $event)"
      >
        <div class="list-item-content">
          <h4>{{ point.name }}</h4>
          <p>{{ point.address }}</p>
          <span class="status-badge" :class="point.status">
            {{ getStatusText(point.status) }}
          </span>
        </div>
      </div>
    </div>


    <!-- 右侧：地图 -->
    <div class="map-container" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 响应式数据
const listContainer = ref(null)
const mapContainer = ref(null)
const map = ref(null)
const markers = ref(new Map())

// 状态
const points = ref([])
const activePointId = ref(null)
const isScrolling = ref(false)
const isMapMoving = ref(false)

// 初始化
onMounted(async () => {
  // 加载数据
  await loadPointsData()

  // 初始化地图
  initMap()

  // 初始化列表观察器
  initListObserver()

  // 绑定事件
  setupEventListeners()
})

// 加载点位数据
const loadPointsData = async () => {
  // 从API获取数据
  const response = await fetch('/api/points')
  points.value = await response.json()
}

// 初始化地图
const initMap = () => {
  map.value = L.map(mapContainer.value).setView([39.915, 116.404], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map.value)

  // 添加标记
  addMapMarkers()
}

// 添加地图标记
const addMapMarkers = () => {
  markers.value.clear()

  points.value.forEach(point => {
    const marker = L.marker([point.lat, point.lng], {
      pointId: point.id,
      title: point.name
    })
      .addTo(map.value)
      .bindPopup(
        `
      <div class="map-popup">
        <h4>${point.name}</h4>
        <p>${point.address}</p>
        <p>状态: ${getStatusText(point.status)}</p>
      </div>
    `
      )
      .on('click', () => {
        handleMapMarkerClick(point.id)
      })

    markers.value.set(point.id, marker)
  })
}

// 初始化列表观察器
const initListObserver = () => {
  const observer = new IntersectionObserver(
    entries => {
      // 避免地图移动触发列表滚动时的循环
      if (isMapMoving.value) return

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const pointId = parseInt(entry.target.dataset.pointId)
          activatePoint(pointId, { fromList: true })
        }
      })
    },
    {
      root: listContainer.value,
      threshold: [0, 0.5, 1],
      rootMargin: '-20% 0px -60% 0px'
    }
  )

  // 观察所有列表项
  nextTick(() => {
    document.querySelectorAll('.list-item').forEach(item => {
      observer.observe(item)
    })
  })
}

// 激活点位（核心方法）
const activatePoint = (pointId, options = {}) => {
  const { fromList = false, fromMap = false } = options

  // 避免重复激活
  if (activePointId.value === pointId) return

  activePointId.value = pointId
  const point = points.value.find(p => p.id === pointId)
  if (!point) return

  // 更新列表选中状态
  updateListSelection(pointId)

  // 更新地图标记
  updateMapMarker(pointId)

  // 移动地图视野（如果是从列表触发的）
  if (fromList && !isMapMoving.value) {
    isScrolling.value = true
    moveMapToPoint(point)
  }
}

// 移动地图到点位
const moveMapToPoint = point => {
  isMapMoving.value = true

  map.value.flyTo([point.lat, point.lng], 15, {
    duration: 1.2,
    easeLinearity: 0.25
  })

  // 地图移动完成后重置标志
  setTimeout(() => {
    isMapMoving.value = false
  }, 1200)
}

// 地图标记点击处理
const handleMapMarkerClick = pointId => {
  activatePoint(pointId, { fromMap: true })
  scrollToListItem(pointId)
}

// 滚动列表到对应项
const scrollToListItem = pointId => {
  const item = document.querySelector(`.list-item[data-point-id="${pointId}"]`)
  if (item && listContainer.value) {
    isScrolling.value = true

    const itemTop = item.offsetTop
    const containerHeight = listContainer.value.clientHeight
    const itemHeight = item.clientHeight

    listContainer.value.scrollTo({
      top: itemTop - (containerHeight - itemHeight) / 2,
      behavior: 'smooth'
    })

    // 滚动完成后重置标志
    setTimeout(() => {
      isScrolling.value = false
    }, 500)
  }
}

// 清理
onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})


</script>

<style scoped>
.map-list-container {
  display: flex;
  height: 100vh;
}

.list-container {
  width: 300px;
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
}

.map-container {
  flex: 1;
}

.list-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-item:hover {
  background-color: #f5f5f5;
}

.list-item.active {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-top: 8px;
}

.status-badge.normal {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-badge.warning {
  background-color: #fff3e0;
  color: #ef6c00;
}
</style>
