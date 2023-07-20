const callbacks = []
let pending = false
let timerFunc

function flushCallbacks() {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

if (typeof Promise !== 'undefined') {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
  }
} else if (typeof MutationObserver !== 'undefined') {
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
} else if (typeof setInterval !== 'undefined') {
  timerFunc = () => {
    setInterval(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

function nextTick(cb, ...args) {
  let _resolve
  callbacks.push(() => {
    cb && cb(...args)
    _resolve && _resolve(...args)
  })

  if (!pending) {
    pending = true
    timerFunc()
  }
  return new Promise(resolve => {
    _resolve = resolve
  })
}