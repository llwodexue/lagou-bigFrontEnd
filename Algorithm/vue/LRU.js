class LRUCache {
  constructor(max) {
    this.max = max
    this.cache = new Map()
    this.keys = new Set()
  }

  get(key) {
    if (this.cache.has(key)) {
      // 如果换成有这个键，就将它移到最后面
      this.keys.delete(key)
      this.keys.add(key)
      // 返回对应的缓存数据
      return this.cache.get(key)
    } else {
      return -1
    }
  }

  set(key, value) {
    if (this.cache.has(key)) {
      // 缓存中有这个键，就先给它移除
      this.keys.delete(key)
    } else {
      // 缓存没有这个键，判断缓存是否已满
      if (this.keys.size >= this.max) {
        // 缓存已满，取出最近最少使用的键
        const leastUsedKey = this.keys.values().next().value
        this.cache.delete(leastUsedKey)
        this.keys.delete(leastUsedKey)
      }
    }
    // 添加新的缓存策略
    this.cache.set(key, value)
    this.keys.add(key)
  }
}

const cache = new LRUCache(2)
cache.set('a', 1)
cache.set('b', 2)
console.log(cache.get('a')) // 1
cache.set('c', 3)
console.log(cache.get('b')) // -1
cache.set('d', 4)
console.log(cache.get('a')) // -1
console.log(cache.get('c')) // 3
console.log(cache.get('d')) // 4
