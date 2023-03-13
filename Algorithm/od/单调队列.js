/**
 *  A公司准备对他下面的N个产品评选最差奖，评选的方式是首先对每个产品进行评分，然后根据评分区间计算相邻几个产品中最差的产品
 *  评选的标准是依次找到从当前产品开始前M个产品中最差的产品，请给出最差产品的评分序列
 *  输入：
 *  3
 *  12,3,8,6,5
 *  输出：
 *  3,3,5
 *  12.3.8 最差的是3
 *  3.8,6 中最差的是3
 *  8.6.5 中最差的是5
 */

function maxSlidingWindow(N, nums) {
  const res = []
  const len = nums.length
  const dq = []
  for (let i = 0; i < len; i++) {
    // 若队列不为空，且当前元素大于等于对尾所有下标的元素，则弹出对尾
    while (dq.length && nums[i] >= nums[dq[dq.length - 1]]) {
      dq.pop()
    }
    // 入队当前元素下标
    dq.push(i)
    // 判断当前最大值是否在窗口中，若不在便将其出队
    while (dq[0] <= i - N) {
      dq.shift()
    }
    // 当达到窗口大小时便开始向结果中添加数据
    if (i >= N - 1) {
      res.push(nums[dq[0]])
    }
  }
  return res
}
// console.log(maxSlidingWindow(3, [12, 3, 8, 6, 5, 7]))

function minSlidingWindows(N, nums) {
  const res = []
  const len = nums.length
  const dq = []
  for (let i = 0; i < len; i++) {
    while (dq.length && nums[dq[dq.length - 1]] >= nums[i]) {
      dq.pop()
    }
    dq.push(i)
    while (dq[0] <= i - N) {
      dq.shift()
    }
    if (i >= N - 1) {
      res.push(nums[dq[0]])
    }
  }
  return res
}
console.log(minSlidingWindows(3, [12, 3, 8, 6, 5, 7]))
