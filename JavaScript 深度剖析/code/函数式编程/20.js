const _ = require('lodash')

// lodash.map会传递三个参数value,index|key,collection
console.log(_.map(['23', '8', '10'], parseInt))
// parseInt('23', 0, array)
// parseInt('8', 1, array)
// parseInt('10', 2, array)

const fp = require('lodash/fp')
// fp.map只传递一个参数接收一个函数
console.log(fp.map(parseInt, ['23', '8', '10']))
