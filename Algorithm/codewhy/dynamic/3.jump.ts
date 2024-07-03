// function jump(n: number): number {
//   if (n <= 1) return n
//   return jump(n - 1) + jump(n - 2)
// }

function jump(n: number): number {
  const memo = new Array(n + 1).fill(0)
  return jumpMemo(n, memo)
}

function jumpMemo(n: number, memo: number[]): number {
  if (n <= 1) return n
  if (memo[n] !== 0) return memo[n]
  memo[n] = jumpMemo(n - 1, memo) + jumpMemo(n - 2, memo)
  return memo[n]
}

console.log(jump(10))

export {}
