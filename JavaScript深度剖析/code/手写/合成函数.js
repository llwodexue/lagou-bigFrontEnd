function compose(...args) {
  return function (value) {
    return args.reverse().reduce((acc, fn) => fn(acc), value)
  }
}

const reverse = arr => arr.reverse()
const first = arr => arr[0]
const toUpper = s => s.toUpperCase()
const f = compose(toUpper, first, reverse)
console.log(f(['one', 'two', 'three'])) // THREE
