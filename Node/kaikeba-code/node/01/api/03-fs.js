~(async () => {
  const fs = require('fs')
  const { promisify } = require('util')
  const readFile = promisify(fs.readFile)
  const data = await readFile('./download.js')
  console.log(data.toString())
})()

// 同步
// const data = fs.readFileSync('./download.js')
// console.log(data,data.toString())

// 异步方式
fs.readFile('./download.js', (err, data) => {
  if (err) throw err
  console.log(data, data.toString())
})
