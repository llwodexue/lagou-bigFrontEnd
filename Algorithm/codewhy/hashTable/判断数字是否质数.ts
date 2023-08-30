// import { isPrime } from "hy-algokit"
/**
 * 根据传入的数字，判断是否是一个质数
 * @param num 要判断的数字
 * @returns 是否是一个质数
 */
function isPrime(num: number): boolean {
  // 质数的特点：只能被1和num整除
  const sqrt = Math.sqrt(num)
  for (let i = 2; i <= sqrt; i++) {
    if (num % i === 0) {
      return false
    }
  }
  return true
}

console.log(isPrime(8))
console.log(isPrime(14))
console.log(isPrime(15))
console.log(isPrime(17))
console.log(isPrime(23))

export {}