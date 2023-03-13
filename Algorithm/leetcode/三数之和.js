function threeSum(nums) {
  nums.sort((a, b) => a - b)

  const len = nums.length
  let left = 0
  let right = len - 1
  let resArr = []
  for (let i = 0; i < len; i++) {
    if (nums[i] > 0) {
      return resArr
    }
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue
    }

    left = i + 1
    while (left < right) {
      let total = nums[i] + nums[left] + nums[right]
      if (total === 0) {
        resArr.push([nums[i], nums[left], nums[right]])
        left++
        right--
        while (nums[right] === nums[right + 1]) {
          right--
        }
        while (nums[left] === nums[left - 1]) {
          left++
        }
      } else if (total < 0) {
        left++
      } else {
        right--
      }
    }
  }

  return resArr
}

console.log(threeSum([-1, 0, 1, 2, -1, 1, 1, -4, 1]))
console.log(threeSum([]))
console.log(threeSum([0]))
