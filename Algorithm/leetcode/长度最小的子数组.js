function minSubArrayLen(target, nums) {
  let start = 0
  let end = 0
  let sum = 0
  let len = nums.length
  let result = Infinity
  while (end < len) {
    sum += nums[end]
    while (sum >= target) {
      result = Math.min(result, end - start + 1)
      sum -= nums[start]
      start++
    }
    end++
  }
  return result === Infinity ? 0 : result
}

console.log(minSubArrayLen(7, [2, 3, 1, 2, 4, 3]))
