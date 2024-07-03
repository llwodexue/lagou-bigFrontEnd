// function maxProfit(prices: number[]): number {
//   const n = prices.length
//   if (n <= 1) return 0
//   // 1.定义状态dp[i]
//   const dp: number[] = []
//   // 2.设置初始化值
//   dp[0] = 0
//   // 3.状态转移方程dp[i]
//   let minPrice = prices[0]
//   for (let i = 1; i < n; i++) {
//     dp[i] = Math.max(dp[i - 1], prices[i] - minPrice)
//     minPrice = Math.min(prices[i], minPrice)
//   }
//   return dp[n - 1]
// }

function maxProfit(prices: number[]): number {
  const n = prices.length
  if (n <= 1) return 0
  let preValue = 0
  let minPrice = prices[0]
  for (let i = 1; i < n; i++) {
    preValue = Math.max(preValue, prices[i] - minPrice)
    minPrice = Math.min(prices[i], minPrice)
  }
  return preValue
}

console.log(maxProfit([7, 1, 5, 3, 6, 0, 4]))

export {}
