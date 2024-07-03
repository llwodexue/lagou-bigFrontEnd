function jump(n: number): number {
  let pre = 1
  let cur = 1
  for (let i = 2; i <= n; i++) {
    const iValue = pre + cur
    pre = cur
    cur = iValue
  }
  return cur
}

console.log(jump(3))
console.log(jump(4))
