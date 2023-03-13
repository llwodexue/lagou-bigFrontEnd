/* const rl = require('readline').createInterface({ input: process.stdin })
var iter = rl[Symbol.asyncIterator]()
const readline = async () => (await iter.next()).value

void (async function () {
  // Write your code here
  const arr = []
  while ((line = await readline())) {
    arr.push(line)
  }
})()
 */

const arr = ['abc', 'abcabcabc']

arr.forEach(line => {
  // const n = line.length % 8 === 0 ? line.length : Math.floor(line.length / 8) * 8 + 8
  // console.log(line.padEnd(n, 0))
  const n = line.length % 8
  const l = line.concat('0'.repeat(n ? 8 - n : 0))
  for (let i = 0; i < l.length; i += 8) {
    console.log(l.substring(i, i + 8))
  }
})
