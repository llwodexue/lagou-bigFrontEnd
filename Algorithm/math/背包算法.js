function Fibonacci(n) {
  if (n <= 1) return 1
  return Fibonacci(n - 1) + Fibonacci(n - 2)
}

console.log(Fibonacci(5))
// 1 + 2 + 3 + 4

/**
 * dp[i][j]
 * [0, i] 物品任意存放容量为 j 的背包
 * dp(j - coins[i])
 */
const coinChange = (coins, amount) => {
  if (!amount) {
    return 0
  }

  let dp = Array(amount + 1).fill(Infinity)
  dp[0] = 0

  for (let i = 0; i < coins.length; i++) {
    for (let j = coins[i]; j <= amount; j++) {
      dp[j] = Math.min(dp[j - coins[i]] + 1, dp[j])
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount]
}

/**
 * @description 分割等和子集 零一背包
 *
 * 物品 0 重量 1 价值 15
 * 物品 1 重量 3 价值 20
 * 物品 2 重量 4 价值 30
 *
 *    |  0   |   1  |   2  |   3  |   4  |
 *
 *  0 |  0   |  15  |  15  |  15  |  15  |
 *
 *  1 |  0   |  xx  |  xx  |  xx  |  xx  |
 *
 *  2 |  0   |  xx  |  xx  |  xx  |  xx  |
 *
 * * 二维数组
 *
 * 1. dp 含义：dp[i][j] [0, i] 之间的物品任取放进容量为 j 的背包里
 * 2. 递推公式：dp[i][j]
 *  不放物品 i dp[i - 1][j]
 *  要放物品 i dp[i - 1][j - weight[i] + value[i]]
 *  dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i])
 *
 * * 一维数组
 *
 * 1. dp[j]：容量为 j 的背包最大值为 dp[j]
 * 2. dp[j] = max(dp[j], dp[j - weight[i]] + value[i])
 *
 *
 * [1, 5, 11, 5] => 22 11
 * 1. dp 数组含义：容量为 j 最大价值 dp[j] dp[target] == target
 * 2. 递推公式： dp[j] = max(dp[j], dp[j - weight[i]] + value[i])
 * 3. 初始化为0
 * 4. 确定递归顺序
 *
 * dp[j] += dp[j - nums[i]]
 */
function findTargetSumWays(nums, target) {
  const sum = nums.reduce((a, b) => a + b)
  if (Math.abs(target) > sum) {
    return 0
  }
  if ((target + sum) % 2) {
    return 0
  }
  const halfSum = (target + sum) / 2
  let dp = new Array(halfSum + 1).fill(0)
  dp[0] = 1
  for (let i = 0; i < nums.length; i++) {
    for (let j = halfSum; j >= nums[i]; j--) {
      dp[j] += dp[j - nums[i]]
    }
  }
  return dp[halfSum]
}

/* 
1. 含义：dp[i][j]：从下标为【0...i】的物品里任取，填满j这么⼤容积的包，有dp[i][j]种⽅法
2. 递推式：dp[i][j] = dp[i-1][j] + dp[i-1][j-nums[i]]
  dp[i-1][j]是不将物品i放入背包的方式数，dp[i-1][j-nums[i]]是将物品i放入背包的方式数
3. 初始化：dp[0] = 1 表示装满容量为0的背包，有1种⽅法，就是装0件物品。
  如果nums[0]在范围内的话，dp[0][nums[0]] = 1
  其他全为0
4. 计算顺序：顺序，行优先 
*/

console.log(findTargetSumWays([1, 1, 1, 1, 1], 3))
