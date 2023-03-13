function twoSum(nums, target) {
  let hash = {}
  const len = nums.length
  for (let i = 0; i < len; i++) {
    if (hash[target - nums[i]] !== undefined) {
      return [i, hash[target - nums[i]]]
    }
    hash[nums[i]] = i
  }
  return []
}

console.log(twoSum([2, 7, 11, 15], 9))
