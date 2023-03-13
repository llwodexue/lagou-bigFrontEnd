function canPartition(nums) {
  const sum = nums.reduce((pre, cur) => pre + cur)
  if (sum & 1) return false // if (sum % 2 === 1) return false
  const len = nums.length
  const bagSize = sum / 2
  const dp = new Array(bagSize + 1).fill(0)
  for (let i = 0; i < len; i++) {
    for (let j = bagSize; j >= nums[i]; j--) {
      dp[j] = Math.max(dp[j], dp[j - nums[i]] + nums[i])
    }
  }
  return dp[bagSize] === bagSize
}

console.log(canPartition([1, 5, 11, 5]))
