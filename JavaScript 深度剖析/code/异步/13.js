const { ajax } = require('./ajax')

async function main() {
  try {
    const users = await ajax('/api/users.json')
    console.log(users)
    const posts = await ajax('/api/posts.json')
    console.log(posts)
  } catch (e) {
    console.log(e)
  }
}
const promise = main()
promise.then(() => {
  console.log('all completed')
})
