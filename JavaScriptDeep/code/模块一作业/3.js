const fp = require('lodash/fp')
// 数据：horsepower 马力，dollar_value 价格，in_stock 库存
const cars = [
  { name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true },
  { name: 'Spyker C12 Zagato', horsepower: 650, dollar_value: 648000, in_stock: false },
  { name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false },
  { name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
  { name: 'Aston Martin One-77', horsepower: 750, dollar_value: 1850000, in_stock: true },
  { name: 'Pagani Huayra', horsepower: 700, dollar_value: 1300000, in_stock: false },
]

// 1.
/* let isLastInStock = function (cars) {
  // 获取最后一条数据
  let last_car = fp.last(cars)
  // 获取最后一条数据的 in_stock 属性值
  return fp.prop('in_stock', last_car)
}
console.log(isLastInStock(cars)) // false

let isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)
console.log(isLastInStock(cars)) // false */

// 2.
/* let getFirstCar = fp.flowRight(fp.prop('name'), fp.first)
console.log(getFirstCar(cars)) // Ferrari FF */

// 3.
/* let _average = function (xs) {
  return fp.reduce(fp.add, 0, xs) / xs.length
}
let averageDollarValue = function (cars) {
  let dollar_value = fp.map(function (car) {
    return car.dollar_value
  }, cars)
  return _average(dollar_value)
}

const averageDollarValue = fp.flowRight(
  xs => fp.reduce(fp.add, 0, xs) / xs.length,
  fp.map('dollar_value')
)
console.log(averageDollarValue(cars)) // 790700 */

// 4.
let _underscore = fp.replace(/\W+/g, '_')
let sanitizeNames = fp.flowRight(
  fp.map(_underscore),
  fp.map(fp.toLower),
  fp.map(car => car.name)
)
console.log(sanitizeNames(cars))
/* [
  'ferrari_ff',
  'spyker_c12_zagato',
  'jaguar_xkr_s',
  'audi_r8',
  'aston_martin_one_77',
  'pagani_huayra'
] */