const fp = require('lodash/fp')
// 这里fp.map调用了两次，可以对其进行优化
/* const firstLetterToUpper = fp.flowRight(
  fp.join('. '),
  fp.map(fp.first),
  fp.map(fp.toUpper),
  fp.split(' ')
) */
const firstLetterToUpper = fp.flowRight(
  fp.join('. '),
  fp.map(fp.flowRight(fp.first, fp.toUpper)),
  fp.split(' ')
)
console.log(firstLetterToUpper('world wild web'))
