enum foot {
  apple = 2,
  banana = 4,
  tomato = 8,
  vegetable = 16,
  onion = 32
}

// 不使用位运算的实现
let sorry = [foot.apple, foot.banana, foot.tomato, foot.vegetable, foot.onion]
// 判断是否喜欢苹果
console.log(sorry.includes(foot.apple))
// 判断是否喜欢多个
console.log([foot.apple, foot.banana].every(item => sorry.includes(item)))
// 根据用户sorry所喜欢的创建一个新的组合,比如排除foot.apple
sorry.filter(item => item != foot.apple)
