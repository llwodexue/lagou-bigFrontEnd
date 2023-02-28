/**
 * 给定一个未经排序的整数数组，找到最长且连续递增的子序列，并返回该序列的长度
 *
 * 连续递增的子序列 可以由两个下标 l 和 r（l < r）确定
 * 如果对于每个 l <= i < r，都有 nums[i] < nums[i + 1]
 * 那么子序列 [nums[l], nums[l + 1], ..., nums[r - 1]
 * nums[r]] 就是连续递增子序列
 */
const lengthOfLIS = nums => {
  const n = nums.length
  if (n <= 1) {
    return n
  }
  // dp[i] 记录 nums 的下标 0-i 最长严格递增子序列长度，且 nums[i] 在子序列内
  const dp = new Array(n).fill(1)
  let max = 1
  for (let i = 0; i < n; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (nums[i] > nums[j]) {
        // 严格递增，获取dp[i]最大值
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
    max = Math.max(dp[i], max)
  }
  return max
}

const lengthOfLIS1 = nums => {
  const n = nums.length
  if (n <= 1) {
    return n
  }
  const dp = new Array(n).fill(1)
  let max = 0
  for (let i = 0; i < n; i++) {
    if (dp[max] < nums[i]) {
      dp[++max] = nums[i]
      continue
    }
    // 二分查找 dp
    let pos = 0
    let left = 1,
      right = max,
      mid
    while (left <= right) {
      mid = (left + right) >> 1
      if (nums[i] > dp[mid]) {
        // 元素在右边
        left = mid + 1
        pos = mid
      } else {
        right = mid - 1
      }
    }
    dp[pos + 1] = nums[i]
  }
  return max
}

function LIS(nums) {
  const len = nums.length
  if (len <= 1) {
    return len
  }
  let max = 1
  const dp = new Array(len).fill(1)
  for (let i = 0; i < len; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
    max = Math.max(dp[i], max)
  }
  return max
}

console.log(LIS([10]))
console.log(LIS([10, 9, 2, 5, 3, 7, 101, 18]))
console.log(LIS([0, 1, 0, 3, 2, 3]))
console.log(LIS([7, 7, 7, 7, 7, 7, 7]))
