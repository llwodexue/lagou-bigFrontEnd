## 题⽬⼀

提供⼀个Cache⽅法，缓存⼩时内访问次数最多的条数据

- cache中只保留最多条数据
  - `const cache = new Cache({ limit: 10 })`
- 每条数据在设置的时候通过key标识唯⼀
  - `cache.set('my-cache-key', { id:'xxx', name:'Hello' })`
- 通过缓存的key访问数据：
  - `cache.get('my-cache-key')`
- 如果设置新的 key 时，cache 中已经缓存了条不⼀样的 key，需要删除⼀条数据，删除的逻辑是：删除最近⼩时内通过 get ⽅法访问次数最少的 key（只统计在设置新 key 时的时间 T与 T-24 ⼩时内的访问次数）

```js
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
```

## 题⽬⼆

已知⼀个中⼼点 center，通过代码输出⼀个以 center 为中⼼的 N ⻆星的边缘路径。
⽅法名：`createNStarPathByCenter(center, starNum){ return path }`

> 疑问：感觉需要知道大圆半径，这里假设为 60

```js
/**
 * 以center为中⼼的N⻆星的边缘路径。
 * @param center: N⻆星的中⼼点x,y坐标，例如：[100, 100]
 * @param starNum: N⻆星的⻆的数量，五⻆星starNum为5
 * @returns path 输出的路径值，示例：[[30, 30], [60, 30], ....]
 */
function createNStarPathByCenter(center, starNum) {
  const R = 60
  const r = R / 2
  const cor = 180 / starNum
  const path = []

  for (let i = 0; i < starNum; i++) {
    const x1 = R * Math.sin(((2 * i * cor) / 180) * Math.PI)
    const y1 = R * Math.cos(((2 * i * cor) / 180) * Math.PI)

    const x2 = r * Math.sin((((2 * i + 1) * cor) / 180) * Math.PI)
    const y2 = r * Math.cos((((2 * i + 1) * cor) / 180) * Math.PI)

    path.push([center[0] + Math.floor(x1), center[1] + Math.floor(y1)])
    path.push([center[0] + Math.floor(x2), center[1] + Math.floor(y2)])
  }
  return path
}

createNStarPathByCenter([100, 100], 5)
```

## 题⽬三

在限定条件下，求⼩球运动停⽌位置

计算⿊⾊⼩球在绿⾊框内按照蓝⾊剪头的⽅向运动，与绿⾊框碰撞后发⽣反弹继续运动，直到碰到⻩⾊障碍物停⽌，求⼩球停⽌的位置

```js
/**
 * 在⼆维平⾯内计算：
 * 左上⻆为0，0, 右⽅为x轴正⽅向，下⽅为y轴正⽅向
 * @param startPos ⼩球运动起点，例如：[5,10]
 * @param direction 运动初始⽅向，例如：[[0,0],[5,5]]代表从[0,0]指向[5,5]
 * @param box 外围框，例如：[[0,0],[100,0],[100,100],[0,100]]
 * @param obstacle 障碍物位置，例如：[[70,20],[70, 35]] 代表障碍物线段两端位置
 * @returns endPos 返回结束位置，例如：[20,32]
 */
function getEndPos(startPos, direction, box, obstacle) {
  box = box.flat()
  const width = box[2] - box[0]
  const height = box[5] - box[1]

  const sp = [...startPos]
  let vx = 1
  let vy = direction.reduce((pre, cur) => cur[1] - pre[1] / cur[0] - pre[0])

  function directionPath() {
    sp[0] = sp[0] + vx
    sp[1] = sp[1] + vy
    if (sp[0] >= width) {
      vx = -vx
    }
    if (sp[0] <= 0) {
      vx = Math.abs(vx)
    }
    if (sp[1] >= height) {
      vy = -vy
    }
    if (sp[1] <= 0) {
      vy = Math.abs(vy)
    }
    return [sp[0], sp[1]]
  }

  let dir = true // 横向
  obstacle = obstacle.flat()
  let max = Math.max(obstacle[2], obstacle[0])
  let min = Math.min(obstacle[2], obstacle[0])
  if (obstacle[2] === obstacle[0]) {
    dir = false // 竖向
    max = Math.max(obstacle[3], obstacle[1])
    min = Math.min(obstacle[3], obstacle[1])
  }
  while (true) {
    const path = directionPath(sp)
    if (dir) {
      if (path[1] === obstacle[1] && max >= path[1] && path[1] >= min) {
        return path
      }
    } else {
      if (path[0] === obstacle[0] && max >= path[1] && path[1] >= min) {
        return path
      }
    }
  }
}

getEndPos(
  [5, 30],
  [
    [0, 0],
    [5, 5]
  ],
  [
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100]
  ],
  [
    [70, 20],
    [70, 50]
  ]
)
```

