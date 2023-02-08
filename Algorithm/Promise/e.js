// 先定义一个全局的array对象
widow.webpackJsonp = []
// 重写这个的push方法
webpackJsonp.push = webpackJsonpCallback

// 定义installedChunks，用来存储加载过的js信息
var installedChunks = {
  main: 0
}

function webpackJsonpCallback(data) {
  var chunkIds = data[0]
  var moreModules = data[1]
  var executeModules = data[2]
  var moduleId,
    chunkId,
    i = 0,
    resolves = []
  for (; i < chunkIds.length; i++) {
    chunkId = chunkIds[i]
    if (
      Object.prototype.hasOwnProperty.call(installedChunks, chunkId) &&
      installedChunks[chunkId]
    ) {
      // __webpack_require__.e 函数中创建 promise 时，
      // 会把 installedChunks[chunkId] =  [resolve, reject];
      // 所以这里的installedChunks[chunkId][0]实际就是 promise.resolve 方法啦
      resolves.push(installedChunks[chunkId][0])
    }
    // 加载成功后 把 installedChunks[chunkId] 赋值为0，用来判断当前模块是否加载成功，
    // script.onload 的时候也会用来判断是否加载失败，显示提示信息
    installedChunks[chunkId] = 0
  }
  while (resolves.length) {
    resolves.shift()()
  }
}


/**
 * 0. 首次会执行一个全局定义的 webpackJsonpCallback 函数，
 * 1. 加载 chunk 的时候会判断 installedChunkData 的值，如果为 0 就不去加载了，所以加载同一个 chunk 不会多次添加 script 标签
 * 2. 如果 script 还没 loaded，就会返回首次加载时创建的 promise 对象，因为所有地方引用的都是同一个 promise，所以只要有一个地方调用了 resolve，promise 的状态就会改变
 */
__webpack_require__.e = function requireEnsure(chunkId) {
  // 定义一个存储promise的数组
  var promises = []

  // JSONP chunk loading for javascript
  // installedChunks为一个对象，用来存储加载过的js信息
  var installedChunkData = installedChunks[chunkId]
  if (installedChunkData !== 0) {
    // 0代表已经加载过了

    // 如果已经存在不为0，则代表正在加载
    if (installedChunkData) {
      // installedChunkData[2]存储的是正在加载中的promise
      promises.push(installedChunkData[2])
    } else {
      // 定义一个promise
      var promise = new Promise(function (resolve, reject) {
        installedChunkData = installedChunks[chunkId] = [resolve, reject]
      })
      // 存储promise
      promises.push((installedChunkData[2] = promise))

      // 创建script标签，开始加载js
      var script = document.createElement('script')
      var onScriptComplete

      script.charset = 'utf-8'
      // 设置一个超时时间
      script.timeout = 120
      if (__webpack_require__.nc) {
        script.setAttribute('nonce', __webpack_require__.nc)
      }
      // 获取src，并赋值
      script.src = jsonpScriptSrc(chunkId)

      // 创建一个error，在加载出错后返回
      var error = new Error()
      // 定义加载完成后的时间
      onScriptComplete = function (event) {
        // avoid mem leaks in IE.
        script.onerror = script.onload = null
        clearTimeout(timeout)
        // 判断是否加载成功
        var chunk = installedChunks[chunkId]
        // 不成功，进行错误处理
        if (chunk !== 0) {
          if (chunk) {
            var errorType = event && (event.type === 'load' ? 'missing' : event.type)
            var realSrc = event && event.target && event.target.src
            error.message =
              'Loading chunk ' +
              chunkId +
              ' failed.\n(' +
              errorType +
              ': ' +
              realSrc +
              ')'
            error.name = 'ChunkLoadError'
            error.type = errorType
            error.request = realSrc
            chunk[1](error)
          }
          installedChunks[chunkId] = undefined
        }
      }
      var timeout = setTimeout(function () {
        onScriptComplete({ type: 'timeout', target: script })
      }, 120000)
      // 加载成功和失败都走onScriptComplete，具体原因看下文
      script.onerror = script.onload = onScriptComplete
      document.head.appendChild(script)
    }
  }
  // 返回promise
  return Promise.all(promises)
}
