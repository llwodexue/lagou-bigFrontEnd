function checkAge(min) {
  return function (age) {
    return age >= min
  }
}
console.log(checkAge(18)(20))