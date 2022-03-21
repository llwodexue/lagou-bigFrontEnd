// 把函数赋值给变量
let fn = function () {
  console.log('Hello First-class Function')
}
fn()

const BlogController = {
  // index 方法和 Views.index 方法调用形式一样
  index(posts) {
    return Views.index(posts)
  },
  show(post) {
    return Views.show(post)
  },
  create(attrs) {
    return Db.create(attrs)
  },
  update(post, attrs) {
    return Db.update(post, attrs)
  },
  destroy(post) {
    return Db.destroy(post)
  },
}

// 优化
const BlogController = {
  // 把 Views.index 方法赋值给 index 方法（不是把方法返回值赋值）
  index: Views.index,
  show: Views.show,
  create: Db.create,
  update: Db.update,
  destroy: Db.destroy,
}