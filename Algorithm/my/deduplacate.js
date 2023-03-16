// O(n) 空间
function deduplicateV1(arr) {
  const obj = Object.create(null)
  const res = []
  const len = arr.length
  for (let i = 0; i < len; i++) {
    if (!(arr[i] in obj)) {
      res.push(arr[i])
    }
    obj[arr[i]] = arr[i]
  }
  return res
}

// O(1) 空间
function deduplicateV2(arr) {
  arr.sort((a, b) => a - b)
  const len = arr.length
  let i = 1
  let j = 0
  while (i < len) {
    if (arr[i] !== arr[j]) {
      j += 1
      arr[j] = arr[i]
    }
    i += 1
  }
  return arr.splice(0, j + 1)
}

console.log(deduplicateV1([1, 2, 3, 2, 3, 2, 1, 6]))
console.log(deduplicateV2([1, 2, 3, 2, 3, 2, 1, 6]))

function quickSort(arr) {
  if (arr.length <= 1) {
    return arr
  }
  const midIndex = Math.floor(arr.length / 2)
  const middle = arr.splice(midIndex, 1)[0]
  const left = []
  const right = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < middle) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat([middle], quickSort(right))
}
console.log(quickSort([1, 2, 3, 2, 3, 2, 1, 6]))

