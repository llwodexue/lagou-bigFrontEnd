## try...catch

| 执行异常错误捕获方式                   | 同步任务 | 普通异步任务 | Promise任务 | async任务 | 资源加载 | 语法错误 |
| :------------------------------------- | -------- | ------------ | ----------- | --------- | -------- | -------- |
| try...catch                            | √        | ×            | ×           | √         | ×        | ×        |
| onerror                                | √        | √            | ×           | ×         | ×        | ×        |
| addEventListener('error')              | √        | √            | ×           | ×         | √        | ×        |
| addEventListener('unhandledrejection') | ×        | ×            | √           | √         | ×        | ×        |

`try...catch` 不能异步捕获代码错误，因为它本身就是一个同步代码块。所以一下的写法都是有问题的

```js
try {
  setTimeout(() => {
    throw new Error('err')
  }, 200)
} catch (err) {
  console.log(111, err)
}

try {
  Promise.resolve().then(() => {
    throw new Error('err')
  })
} catch (err) {
  console.log(222, err)
}
```

正确的做法是在异步操作中直接处理错误，例如使用回调函数、`Promise` 或者 `async/await` 结合 `try...catch`

```js
Promise.resolve()
  .then(() => {
    throw new Error('err')
  })
  .catch(err => {
    console.log(err) // 这里会捕捉到错误
  })

async function handleError() {
  try {
    await Promise.resolve().then(() => {
      throw new Error('err')
    })
  } catch (err) {
    console.log(err) // 这里会捕捉到错误
  }
}
handleError()
```

如果不使用 `try...catch` 包裹 `async/await`，也可以通过 `windwo.addEventListener` 来捕获到 `async/await` 抛出的错误，并在这个方法的回调中的 `event` 接收这个报错信息

```js
window.addEventListener('unhandledrejection', e => {
  e.preventDefault()
  console.log(e.reason)
})

const handle = async () => {
  const result = await Promise.reject('error')
  console.log(result) // 没有输出
}
handle()
```

