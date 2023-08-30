class HashTable<T> {
  private storage: [string, T][][] = []
  private length: number = 11
  private count: number = 0
  private getIndex(key: string): number {
    let hashCode = 0
    const length = key.length
    for (let i = 0; i < length; i++) {
      hashCode = 31 * hashCode + key.charCodeAt(i)
    }
    const index = hashCode % this.length
    return index
  }

  put(key: string, value: T) {
    const index = this.getIndex(key)
    let bucket = this.storage[index]
    if (!bucket) {
      bucket = []
      this.storage[index] = bucket
    }
    let isUpdate = false
    for (let i = 0; i < bucket.length; i++) {
      const tuple = bucket[i]
      const tupleKey = tuple[0]
      if (tupleKey === key) {
        isUpdate = true
        tuple[1] = value
      }
    }
    if (!isUpdate) {
      bucket.push([key, value])
      this.count++
    }
  }

  get(key: string): T | undefined {
    const index = this.getIndex(key)
    const bucket = this.storage[index]
    if (!bucket) return undefined
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
}

const hashTable = new HashTable()
hashTable.put('aaa', 100)
hashTable.put('aaa', 200)
hashTable.put('bbb', 300)
hashTable.put('ccc', 400)

console.log('get', hashTable.get('aaa'))
console.log('get', hashTable.get('bbb'))
console.log('get', hashTable.get('ccc'))
console.log('get', hashTable.get('ddd'))
