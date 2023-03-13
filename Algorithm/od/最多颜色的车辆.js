//JSRUN引擎2.0，支持多达30种语言在线运行，全仿真在线交互输入输出。
function main(cars, n) {
  const car_count = new Array(3).fill(0)
  for (let i = 0; i < n; i++) {
    car_count[cars[i]] += 1
  }
  let result = Math.max(...car_count)
  for (let i = n; i < cars.length; i++) {
    car_count[cars[i]] += 1
    car_count[cars[i - n]] -= 1
    result = Math.max(
      result,
      Math.max(Math.max(car_count[0], car_count[1]), car_count[2])
    )
  }
  return result
}

main([0, 1, 2, 1, 1, 2, 1], 3)
