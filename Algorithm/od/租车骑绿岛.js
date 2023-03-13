/**
 * 部门组织绿岛骑行团建活动。租用公共双人自行车，每辆自行车最多坐 2 人，做最大载重 M。给出部门每个人的体重，请问最多需要租用多少双人自行车。输入描述:
 * 第一行两个数字 m、n，分别代表自行车限重，部门总人数
 * 第二行，n 个数字，代表每个人的体重，体重都小于等于自行车限重 m
 * 0 < m <= 200
 * 0 < n <= 1000000
 */
function main(m, n, nums) {
  nums.sort((a, b) => a - b)
  let min = 0
  for (let i = 0; i <= n; i++) {
    for (let j = n; j >= i; j--) {
      if (nums[i] + nums[j] > m) {
        i++
        min++
      } else {
        i++
        j--
        min++
      }
    }
  }
  return min
}

function main(m, n, nums) {
  nums.sort((a, b) => a - b)
  let min = 0
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    if (nums[left] + nums[right] <= m) {
      left += 1
    }
    right -= 1
    min += 1
  }
  return min
}

console.log(main(3, 4, [3, 2, 2, 1]))
