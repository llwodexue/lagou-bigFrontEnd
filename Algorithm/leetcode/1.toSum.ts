// 命令式、过程式
function toSum1(arrays: number[], target: number): boolean {
  let dict: Record<number, boolean> = {}
  for (const i of arrays) {
    if (dict[i]) {
      return true
    }
    let dst = target - i
    dict[dst] = true
  }
  return false
}

// 声明变量但是不能改动
function toSum2(arrays: number[], target: number): boolean {
  let dict: Record<number, boolean> = Object.fromEntries(arrays.map(i => [i, true]))
  for (const i of arrays) {
    if (dict[target - i]) {
      return true
    }
  }
  return false
}

// for循环分布式
function toSum3(arrays: number[], target: number): boolean {
  let dict: Record<number, boolean> = Object.fromEntries(arrays.map(i => [i, true]))
  return arrays.some(i => dict[target - i])
}

// 递归
function toSum4(arrays: number[], target: number, set: Set<number>): boolean {
  if (arrays.length === 0) return false
  const delta = target - arrays[0]
  return (
    set.contains(delta) || toSum4(arrays.slice(1), target, new Set([...set, arrays[0]]))
  )
}

function flowerNumber(n: number) {
  const digits = Array.from({ length: 10 }, (_, i) => i ** n)

  function isFlower(num: number) {
    return [...String(num)].reduce((a, b) => a + digits[+b], 0) === num
  }

  const result: Array<number> = []
  let start = 10 ** n
  let end = 10 ** (n + 1) - 1
  for (let i = start; i <= end; i++) {
    if (isFlower(i)) {
      result.push(i)
    }
  }
  return result
}

type Tail<T> = T extends [any, ...infer Tail] ? Tail : []

type TwoSum<N extends number[], T extends number, Set> = N['length'] extends 0
  ? false
  : Set extends Sub<T, N[0]>
  ? true
  : TwoSum<Tail<N>, T, N[0]>
