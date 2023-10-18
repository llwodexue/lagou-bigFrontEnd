## 实现all/race

### all

```js
function allPromise(promises) {
  return new Promise((resolve, reject) => {
    const result = []
    let count = 0
    const total = promises.length
    promises.forEach((item, i) => {
      Promise.resolve(item)
        .then(res => {
          result[i] = res
          count++
          if (count === total) {
            return resolve(result)
          }
        })
        .catch(err => {
          return reject(err)
        })
    })
  })
}
```

### race

```js
function racePromise(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(item => {
      Promise.resolve(item)
        .then(res => {
          return resolve(res)
        })
        .catch(err => {
          return reject(err)
        })
    })
  })
}
```

## 异步sum/add

请实现一个 sum 函数，接收一个数组 arr 进行累加，并且只能使用 add 异步方法

- add 函数已实现，模拟异步请求后端返回一个相加后的值

```js
function add(a, b) {
  return Promise.resolve(a + b)
}

function sum(arr) {

}
```

转换成我们业务中的场景就是：

- 调用接口执行 1+2, 接口返回 3，
- 调用接口再执行 3+3, 接口返回 6
- 调用接口再执行 6+4，接口返回 10
- 调用接口再执行 10+5，接口返回 15

### 初步实现

- 借助数组方法 reduce 实现

```js
function sum(arr) {
  if (arr.length === 1) return arr[0]
  return arr.reduce((pre, cur) => {
    return Promise.resolve(pre).then(pre => add(pre, cur))
  })
}
```

- 借助 async/await 实现

```js
async function sum(arr) {
  let s = arr[0]
  for (let i = 1; i < arr.length; i++) {
    s = await add(s, arr[i])
  }
  return s
}
```

### 优化实现

既然是异步操作，还是累加操作，也就是说，只要输入的数组是确定的，返回的累加值也就是确定的

可以借助 `promise.all()` 改成并行请求，数组两两一组，进行累加，然后再把和累加

比如输入[1,2,3,4,5]

- 第一次请求 [1,2] [3,4]，拿到接口返回 3，7
- 第二次请求 [3,7]，拿到接口返回 10
- 第三次请求 [10,5], 拿到接口返回 15

```js
function chunk(arr) {
  const res = []
  for (let i = 0; i < arr.length; i++) {
    const index = Math.floor(i / 2)
    res[index] ??= []
    res[index].push(arr[i])
  }
  return res
}
function sum(arr) {
  if (arr.length === 1) return arr[0]
  const promises = chunk(arr).map(([x, y]) => (y === undefined ? x : add(x, y)))
  return Promise.all(promises).then(list => sum(list))
}
```

时间复杂度也降低到了 logN

### 浏览器限制问题

`promise.all` 中可以写 100、1000 个元素，一起发起请求，但是浏览器不能同时发送 100、1000 个请求，如果网络拥堵，想控制成只能发送 10 个请求

如果需要控制并行数，则可以先实现一个 `promise.map` 用以控制并发

