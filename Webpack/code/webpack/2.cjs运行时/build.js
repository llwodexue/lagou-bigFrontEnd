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

function f2() {
  return webpack({
    entry: './index.js',
    mode: 'none',
    infrastructureLogging: {
      debug: true,
      level: 'log'
    }
  })
}

f1().run((err, stat) => {
  // console.log(stat.toJson())
})
