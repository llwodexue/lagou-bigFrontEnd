const webpack = require('webpack')

function f1() {
  return webpack({
    entry: './index.js',
    mode: 'none',
    output: {
      iife: false,
      pathinfo: 'verbose'
    }
  })
}

f1().run((err, stat) => {
  console.log(stat.toJson())
  console.log(`打包时间：${stat.toJson().time}`)
  console.log(`打包时间：stat.endTime - stat.startTime`)
})
