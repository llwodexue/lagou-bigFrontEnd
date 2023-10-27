enum foot {
  apple = 2,
  banana = 4,
  tomato = 8,
  vegetable = 16,
  onion = 32
}

// 使用位运算的实现
let sorry = foot.apple | foot.banana | foot.tomato | foot.vegetable | foot.onion

// 判断是否喜欢一种食物
console.log((sorry & foot.onion) === foot.onion) // true
// 判断是否喜欢多种食物
let onionAndApple = foot.onion | foot.apple
console.log((sorry & onionAndApple) === onionAndApple) // true

// 根据当前sorry所喜欢的食物来剔除一些食物,创建一个新的组合
let zr = sorry & ~foot.apple
// 判断zr是否喜欢
console.log((zr & foot.apple) === foot.apple) //false
// 剔除多个类型, foo 就已经不包含(foot.onion,foot.vegetable )
let foo = sorry & ~(foot.onion | foot.vegetable)

console.log((foo & foot.apple) === foot.apple) // true
console.log((foo & foot.tomato) === foot.tomato) // true
console.log((foo & foot.onion) === foot.onion) // false
console.log((foo & foot.vegetable) === foot.vegetable) // false
