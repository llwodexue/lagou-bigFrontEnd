class Cache {
  constructor(opt) {
    this.limit = opt.limit
    this.times = 24 * 60 * 60 * 1000
    this.idxMap = []
    this.map = new Map()
  }
  checkTimesToDel() {
    let key = this.idxMap[0]
    let delIdx = 0
    for (let i = 1; i < this.idxMap.length; i++) {
      const fTimes = this.map.get(key).times.filter(i => i < this.times)
      const bTimes = this.map.get(this.idxMap[i]).times.filter(i => i < this.times)
      if (fTimes.length > bTimes.length) {
        key = this.idxMap[i]
        delIdx = i
      }
    }
    return { key, delIdx }
  }
  /**
   * 获取 key
   * @param {String} key
   * @param {String | { [String]: any }} data
   */
  set(key, data) {
    if (!this.idxMap.includes(key)) {
      if (this.idxMap.length >= this.limit) {
        const { key, delIdx } = this.checkTimesToDel()
        this.map.delete(key)
        this.idxMap.splice(delIdx, 1)
      }
      this.idxMap.push(key)
    }
    this.map.set(key, {
      time: new Date().getTime(),
      times: [],
      data: data
    })
  }
  /**
   * 设置 key
   * @param {String} key
   */
  get(key) {
    if (!this.idxMap.includes(key)) {
      return null
    } else {
      const item = this.map.get(key)
      item.times.push(new Date().getTime() - item.time)
      return item.data
    }
  }
}

const cache = new Cache({ limit: 4 })
cache.set('my-cache-1', { id: '111', name: 'Hello' })
cache.set('my-cache-2', { id: '222', name: 'Hello' })
cache.set('my-cache-3', { id: '333', name: 'Hello' })
cache.get('my-cache-2')
cache.get('my-cache-2')
cache.set('my-cache-4', { id: '444', name: 'Hello' })
cache.set('my-cache-5', { id: '555', name: 'Hello' })
cache.get('my-cache-4')
cache.set('my-cache-6', { id: '666', name: 'Hello' })
console.log(cache)
