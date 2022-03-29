const { ajax } = require('./ajax')

function co(generator) {
  const g = generator()
  function handleResult(result) {
    // 生成器函数结束
    if (result.done) return
    result.value.then(
      data => {
        handleResult(g.next(data))
      },
      error => {
        g.throw(error)
      }
    )
  }
  handleResult(g.next())
}
function* main() {
  try {
    const users = yield ajax('/api/users.json')
    console.log(users)
    const posts = yield ajax('/api/posts.json')
    console.log(posts)
  } catch (e) {
    console.log(e)
  }
}
co(main)
