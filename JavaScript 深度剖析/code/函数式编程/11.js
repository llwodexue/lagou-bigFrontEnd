// 不纯函数
let min = 18
function checkAge(age) {
  return age >= min
}

// 纯函数（有硬编码，可以通过柯里化解决）
function checkAge(age) {
  let min = 18
  return age >= min
}
