// 最大公约数 Greatest Common Divisor
function getGcd(a, b) {
  let max = Math.max(a, b)
  let min = Math.min(a, b)
  if (max % min === 0) {
    return min
  } else {
    return getGcd(max % min, min)
  }
}

// 最小公倍数 Least Common Multiple
function getLcm() {
  return (a * b) / getGcd(a, b)
}

const line = '15 10'
let tokens = line.split(' ')
let a = parseInt(tokens[0])
let b = parseInt(tokens[1])
if (a < b) {
  ;[a, b] = [b, a]
}
let i = a
while (i % b !== 0) {
  i = i + a
}
console.log(i)
