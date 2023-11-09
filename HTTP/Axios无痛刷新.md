## 无痛刷新

> [axios如何利用promise无痛刷新token](https://segmentfault.com/a/1190000020210980)
>
> [axios如何利用promise无痛刷新token（二）](https://segmentfault.com/a/1190000020986592)

前端登录后，后端返回 `token` 和 token 有效时间段 `tokenExprieIn`，当 token 过期时间到了，前端需要主动用旧 token 去获取一个新的 token，做到用户无感知地去刷新 token

后端返回 token 的有效事件，有两种方法：

1. 在请求发起前拦截每个请求，判断 token 的有效时间是否已经过期，若已过期，则将请求挂起，先刷新 token 后再继续请求
2. 不在请求前拦截，而是拦截返回后的数据。先发起请求，接口返回过期后，先刷新 token，再进行一次重试



```js
// 请求队列
let requestList = []
// 是否正在刷新中
let isRefreshToken = false

service.interceptors.response.use(
  async res => {
    const code = res.data.code
    const msg = res.data.msg
    if (code === 401) {
      // 如果未认证，并且未进行刷新令牌，说明可能是访问令牌过期了
      if (!isRefreshToken) {
        isRefreshToken = true
        // 1. 如果获取不到刷新令牌，则只能执行登出操作
        if (!getRefreshToken()) {
          return handleAuthorized()
        }
        // 2. 进行刷新访问令牌
        try {
          const refreshTokenRes = await refreshToken()
          // 2.1 刷新成功，则回放队列的请求 + 当前请求
          setToken(refreshTokenRes.data)
          requestList.forEach(cb => cb())
          return service(res.config)
        } catch (e) {
          // 为什么需要 catch 异常呢？刷新失败时，请求因为 Promise.reject 触发异常。
          // 2.2 刷新失败，只回放队列的请求
          requestList.forEach(cb => cb())
          // 提示是否要登出。即不回放当前请求！不然会形成递归
          return handleAuthorized()
        } finally {
          requestList = []
          isRefreshToken = false
        }
      } else {
        // 添加到队列，等待刷新获取到新的令牌
        return new Promise(resolve => {
          requestList.push(() => {
            res.config.headers['Authorization'] = 'Bearer ' + getAccessToken() // 让每个请求携带自定义token 请根据实际情况自行修改
            resolve(service(res.config))
          })
        })
      }
    }
  },
  error => {
    return Promise.reject(error)
  }
)

function handleAuthorized() {
  if (!isRelogin.show) {
    isRelogin.show = true
    MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        isRelogin.show = false
        store.dispatch('LogOut').then(() => {
          location.href = getPath('/index')
        })
      })
      .catch(() => {
        isRelogin.show = false
      })
  }
  return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
}
```

