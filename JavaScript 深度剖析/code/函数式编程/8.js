let array = [1, 2, 3, 4, 5]

console.log(array.slice(0, 3)) // [ 1, 2, 3 ]
console.log(array.slice(0, 3)) // [ 1, 2, 3 ]

console.log(array.splice(0, 3)) // [ 1, 2, 3 ]
console.log(array.splice(0, 3)) // [ 4, 5 ]

function getSum(n1, n2) {
  return n1 + n2
}
console.log(getSum(1, 2))
console.log(getSum(1, 2))
