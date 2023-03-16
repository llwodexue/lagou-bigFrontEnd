Array.prototype.uniq = function () {
  /* 1 */
  return [...new Set(this)]
  /* 2 */
  const map = new Map()
  let arr = []
  for (let i = 0; i < this.length; i++) {
    if (!map.has(this[i])) {
      map.set(this[i], 1)
      arr.push(this[i])
    }
  }
  return arr
  /* 3 */
  this.sort((a, b) => a - b)
  let j = 0
  for (let i = 1; i < this.length; i++) {
    if (this[i] !== this[j]) {
      j += 1
      this[j] = this[i]
    }
  }
  return this.splice(0, j + 1)
}
// const a = [1, 1, 1, 2, 2, 3, 3, 6]
// console.log([1, 1, 3, 2, 3, 2, 1, 6].uniq())
console.log([false, true, undefined, null, NaN, 0, 1, {}, {}, 'a', 'a', NaN].uniq())
