class HashTable<T = any> {
  // 创建一个数组，用来存放链地址法中的链（数组）
  storage: [string, T][][] = []
  // 定义数组的长度
  private length: number = 7
  // 记录已经存放元素的个数
  private count: number = 0
  // 计算索引值
  private getIndex(key: string, max: number): number {
    let hashCode = 0
    const length = key.length
    for (let i = 0; i < length; i++) {
      // 霍纳法则计算 hashCode
      hashCode = 31 * hashCode + key.charCodeAt(i)
    }
    const index = hashCode % max
    return index
  }
  // 获取下一个质数
  private getNextPrime(num: number) {
    let newPrime = num
    while (!this.isPrime(newPrime)) {
      newPrime++
    }
    if (newPrime < 7) newPrime = 7
    return newPrime
  }
  // 扩容/缩容
  private resize(newLength: number) {
    // 设置新的长度
    this.length = this.getNextPrime(newLength)
    console.log(this.length, 'new')

    // 获取原来所有的数据，并且重新放入到新的容量数组中
    // 1.对数据进行初始化操作
    const oldStorage = this.storage
    this.storage = []
    this.count = 0
    // 2.获取原来数，放入新的数组中
    oldStorage.forEach(bucket => {
      if (!bucket) return
      for (let i = 0; i < bucket.length; i++) {
        const tuple = bucket[i]
        this.put(tuple[0], tuple[1])
      }
    })
  }
  // 是否是质数
  private isPrime(num: number): boolean {
    // 质数的特点：只能被1和num整除
    const sqrt = Math.sqrt(num)
    for (let i = 2; i <= sqrt; i++) {
      if (num % i === 0) {
        return false
      }
    }
    return true
  }
  // 插入/修改
  put(key: string, value: T) {
    // 1.根据key获取数组中对应的索引值
    const index = this.getIndex(key, this.length)
    // 2.取出索引值对应位置的数组（桶）
    let bucket = this.storage[index]
    // 3.判断bucket是否有值
    if (!bucket) {
      bucket = []
      this.storage[index] = bucket
    }
    // 4.确定已经有一个数组，但是数组中是否已经存在key是不确定的
    let isUpdate = false
    for (let i = 0; i < bucket.length; i++) {
      const tuple = bucket[i]
      const tupleKey = tuple[0]
      if (tupleKey === key) {
        isUpdate = true
        tuple[1] = value
      }
    }
    // 5.如果上面的代码没有进行覆盖，那么在该位置进行添加
    if (!isUpdate) {
      bucket.push([key, value])
      this.count++
      // 如果loadFactor大于0.75，扩容操作
      const loadFactor = this.count / this.length
      if (loadFactor > 0.75) {
        this.resize(this.length * 2)
      }
    }
  }
  // 获取值
  get(key: string): T | undefined {
    // 1.根据key获取索引值index
    const index = this.getIndex(key, this.length)
    // 2.获取bucket（桶）
    const bucket = this.storage[index]
    if (!bucket) return undefined
    // 3.对bucket进行遍历
    for (let i = 0; i < bucket.length; i++) {
      const tuple = bucket[i]
      const tupleKey = tuple[0]
      const tupleValue = tuple[1]
      if (tupleKey === key) {
        return tupleValue
      }
      return undefined
    }
  }
  // 删除操作
  delete(key: string): T | undefined {
    // 1.获取索引值的位置
    const index = this.getIndex(key, this.length)
    // 2.获取bucket（桶）
    const bucket = this.storage[index]
    if (!bucket) return undefined
    for (let i = 0; i < bucket.length; i++) {
      const tuple = bucket[i]
      const tupleKey = tuple[0]
      const tupleValue = tuple[1]
      if (tupleKey === key) {
        bucket.splice(i, 1)
        this.count--
        // 如果loadFactor小于0.25，缩容操作
        const loadFactor = this.count / this.length
        if (loadFactor < 0.25 && this.length > 7) {
          this.resize(Math.floor(this.length / 2))
        }
        return tupleValue
      }
    }
  }
}

const hashTable = new HashTable()
hashTable.put('aaa', 100)
hashTable.put('aaa', 200)
hashTable.put('bbb', 300)
hashTable.put('ccc', 400)
hashTable.put('ccc', 400)
hashTable.put('abc', 111)
hashTable.put('cba', 222)
console.log(hashTable.storage)

hashTable.put('nba', 333)
hashTable.put('mba', 444)
console.log(hashTable.storage)

hashTable.delete('aaa')
hashTable.delete('bbb')
hashTable.delete('ccc')
hashTable.delete('abc')
hashTable.delete('cba')
hashTable.delete('mba')
console.log(hashTable.storage)

export default HashTable
