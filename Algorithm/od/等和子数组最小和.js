/**
 * 输入:
 * 4 3 2 3 5 2 1
 * 输出:
 * 5
 * 说明: 可以等分的情况有:
 * 4 个子集 (5)， (1,4)， (2,3) ， (2,3)
 * 2 个子集 (5,1,4)，(2,3,2,3)
 * 但最小的为5
 */

function canPartitionKSubsets(cLen, cNums) {
  cNums.sort((a, b) => a - b)
  const sum = cNums.reduce((pre, cur) => pre + cur, 0)
  for (let i = 0; i < cLen; i++) {
    if (canPartition(i, cNums)) {
      console.log(i, sum / i)
      break
    }
  }

  function canPartition(len, nums) {
    const bagSize = sum / 2
    const dp = new Array(bagSize + 1).fill(0)
    for (let i = 0; i < len; i++) {
      for (let j = bagSize; j >= nums[i]; j--) {
        dp[j] = Math.max(dp[j], dp[j - nums[i]] + nums[i])
      }
    }
    return dp[bagSize] === bagSize
  }
}

canPartitionKSubsets(7, [4, 3, 2, 3, 5, 2, 1])
