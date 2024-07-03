// function maxSubArray(nums: number[]): number {
//   const n = nums.length
//   // 1.定义状态dp[i]
//   const dp: number[] = []
//   // 2.初始化状态
//   dp[0] = nums[0]
//   // 3.状态转移方程
//   for (let i = 1; i < n; i++) {
//     dp[i] = Math.max(nums[i], nums[i] + dp[i - 1])
//   }
//   return Math.max(...dp)
// }

function maxSubArray(nums: number[]): number {
  const n = nums.length
  let preValue = nums[0]
  let max = preValue
  for (let i = 1; i < n; i++) {
    preValue = Math.max(nums[i], nums[i] + preValue)
    max = Math.max(preValue, max)
  }
  return max
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))

export {}
