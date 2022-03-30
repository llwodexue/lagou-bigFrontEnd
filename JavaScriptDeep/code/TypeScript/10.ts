export {} // 确保跟其它示例没有成员冲突

/* interface Post {
  title: string
  content: string
}
function printPost(post: Post) {
  console.log(post.title)
  console.log(post.content)
}
printPost({
  title: 'Hello TypeScript',
  content: 'A javascript superset',
})*/

interface Post {
  title: string
  content: string
  subtitle?: string
  readonly summary: string
}
const hello: Post = {
  title: 'Hello TypeScript',
  content: 'A javascript superset',
  summary: 'A javascript',
}

interface Cache {
  [prop: string]: string
}
const cache: Cache = {}
cache.foo = 'value1'
cache.bar = 'value2'
