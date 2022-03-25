const { ajax } = require('./ajax')

function* main() {
  const users = yield ajax('/api/users.json')
  console.log(users)
  const posts = yield ajax('/api/posts.json')
  console.log(posts)
}
const g = main()
const result = g.next()
result.value.then(data => {
  const result2 = g.next(data)
  if (result2.done) return
  result2.value.then(data => {
    const result3 = g.next(data)
    if (result3.done) return
    result3.value.then(data => {
      g.next(data)
    })
  })
})
