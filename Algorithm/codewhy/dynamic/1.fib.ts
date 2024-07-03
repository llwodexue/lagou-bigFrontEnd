// function fib(n: number, memo: number[] = []): number {
//   if (n <= 1) return n
//   if (memo[n]) return memo[n]
//   const res = fib(n - 1, memo) + fib(n - 2, memo)
//   memo[n] = res
//   return res
// }
function fib(n: number): number {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)
}

console.time('---')
console.log(fib(50))
console.timeEnd('---')

export {}
