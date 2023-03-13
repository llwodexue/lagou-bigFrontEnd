function main(left, right) {
  let count = 0
  for (let i = left; i <= right; i++) {
    const binary = Number(i).toString(2)
    if (binary.includes('101')) {
      count++
    }
  }
  return right - left + 1 - count
}

console.log(main(1, 10))
console.log(main(10, 20))
