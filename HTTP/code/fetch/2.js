// async function fetchText() {
//   let response = await fetch('/readme.txt')
//   if (response.status >= 200 && response.status < 300) {
//     return await response
//   } else {
//     throw new Error(response.statusText)
//   }
// }

// async function fetchText() {
//   let response = await fetch('/readme.txt')
//   if (response.ok) {
//     return response
//   } else {
//     throw new Error(response.statusText)
//   }
// }

// fetchText().then(res => {
//   for (let [key, value] of res.headers) {
//     console.log(`${key} : ${value}`)
//   }
// })

// async function fetchImg() {
//   const response = await fetch('./sea.png')
//   const reader = response.body.getReader()
//   while (true) {
//     const { done, value } = await reader.read()

//     if (done) {
//       break
//     }

//     console.log(`Received ${value.length} bytes`)
//   }
// }
// fetchImg()

// window.onunload = function () {
//   fetch('http://localhost:8089/analytics?a=b', {
//     method: 'POST',
//     mode: 'cors',
//     keepalive: true
//   })
// }

// window.addEventListener('beforeunload', function (event) {
//   navigator.sendBeacon('http://localhost:8089/analytics?a=b')
// })

/* let controller = new AbortController()
let signal = controller.signal
fetch(url, {
  signal: controller.signal
})
signal.addEventListener('abort', () => console.log('abort!'))
controller.abort() // 取消
console.log(signal.aborted) // true
 */

let controller = new AbortController()
setTimeout(() => controller.abort(), 1000)

async function abortFn() {
  try {
    await fetch('http://localhost:8089/analytics', {
      mode: 'no-cors',
      signal: controller.signal
    })
  } catch (err) {
    if (err.name == 'AbortError') {
      console.log('Aborted!')
    } else {
      throw err
    }
  }
}
abortFn()
