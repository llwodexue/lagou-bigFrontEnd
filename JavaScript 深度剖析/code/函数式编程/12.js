// 普通纯函数
function checkAge(min, age) {
  return age >= min
}
console.log(checkAge(18, 20))

// 使用柯里化解决硬编码问题
function checkAge(min) {
  return function (age) {
    return age >= min
  }
}
console.log(checkAge(18)(20))

// ES6 写法
let checkAge = min => age => age >= min
let checkAge18 = checkAge(18)
console.log(checkAge18(24))
