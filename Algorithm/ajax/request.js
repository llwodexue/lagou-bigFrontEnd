const sleep = time => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

const trsServer = 'sendTRS'
const trsToken =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJUVk1Vc2VyIiwiZGVwYXJ0TGV2ZWwiOiI1IiwiaW5uZXJDb2RlIjoiSURITUEiLCJvZmZpY2VObyI6IjYyMDAxMzAiLCJ3aW5kb3dObyI6IjAwMyIsImRheU5pZ2h0IjoiUiIsInN0YXRpc3RpY3NEYXRlIjoiMjAyMzA1MTYiLCJzaGlmdENvbnRpbnVlVGltZSI6IjIwMjMwNTE1MjIwMCIsInVzZXJOYW1lIjoiVFZNVXNlciIsInNoaWZ0TW9kZSI6IjIiLCJkZWZ1bHRUaW1lem9uZSI6IkUwNyIsImxpY2Vuc2VQZXJpb2QiOiIyMDk5MTIzMSIsImRlZnVsdExhbmd1YWUiOiJlbl9VUyIsImRlZnVsdENvdW50cnkiOiJJRE4iLCJuYW1lIjoiSVRSUyIsInZhbHVhdGlvbkN1cnJlbmN5IjoiMzYwIiwic2V0dGxlQ3VycmVuY3lDb2RlIjoiMzYwIiwic2FsZUJ1cmVhdSI6IklEQSIsInNhbGVTdGF0aW9uIjoiSURITUEiLCJzYWxlTW9kZSI6IkIiLCJyZWZ1bmRDdXJyZW5jeSI6IjM2MCIsIlVVSUQiOiI1MDk5MTUyZi03NDAwLTQ1YzgtYjhkOC1jN2I4Zjg1MzYzOWIifQ.-66QD8p5ngHV4Z5PvWr_4mvgsa1LUdjQyZqaxDi25fpFx4dpsu2EmDkC3k-ndkgIa1sz9NkZDUrTeFuRp4M5mQ'

/**
 * 对 ajax 进行封装
 * @param {String} method 请求方式
 * @param {String} url 请求地址
 * @param {Object} params 请求参数 params
 * @param {Object} data 请求参数 data
 * @param {Int} retry 重试次数
 * @param {Int} timeout 超时时间,默认 10s
 * @param {Boolean} async 是否异步，默认true
 * @param {String} server 请求服务 IP+Port
 * @param {Function} success 成功回调
 * @param {Function} error 失败回调
 */
function ajax({
  method = 'get',
  url,
  params = {},
  data = {},
  retry = 3,
  timeout = 1,
  async = true,
  server,
  success,
  error
}) {
  const sendTo = server == trsServer ? 'sendTRS' : 'sendSC'
  timeout = isMock(sendTo) ? 1 * 1000 : timeout * 1000
  method = method.toUpperCase()

  const urlFormat = url

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.timeout = timeout
    xhr.open(method, urlFormat, async)
    xhr.setRequestHeader('Content-Type', 'application/json')
    if (server == trsServer) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + trsToken)
    }
    xhr.send(JSON.stringify(data))
    xhr.onreadystatechange = async function () {
      if (xhr.readyState === 4) {
        retry = retry - 1
        const { status, responseText } = xhr
        // console.log(xhr, 'xhr');
        if (status === 200) {
          success && success(JSON.parse(responseText), params, data)
          resolve({
            code: 200,
            data: JSON.parse(responseText)
          })
        } else if (isMock(sendTo)) {
          success && success(undefined, params, data)
          resolve({
            code: 200,
            data: null
          })
        } else {
          // 处理日志
          if (status === 0) {
            xhr.ontimeout = function () {
              console.log('服务器超时')
            }
            xhr.onerror = function () {
              console.log('服务器异常')
            }
          } else {
            console.log('服务器出错')
          }
          // 重新调用接口
          if (retry > 0) {
            await sleep(2 * 1000)
            ajax({
              method,
              url,
              params,
              data,
              retry,
              timeout: timeout / 1000,
              server,
              success,
              error
            })
              .then(resolve)
              .catch(reject)
          } else {
            error && error(params, data)
            xhr.abort()
            await sleep(1 * 1000)
            reject({
              code: status,
              data: null
            })
          }
        }
      }
    }
  })
}

// 判断是否走 mock 数据
function isMock(sendTo) {
  return false
}

// 拼接 params 字符串
function splitParamsStr(params) {
  let pairs = []
  for (let k in params) {
    pairs.push(k + '=' + params[k])
  }
  if (pairs.length > 0) {
    return `?${pairs.join('&')}`
  }
  return ''
}
