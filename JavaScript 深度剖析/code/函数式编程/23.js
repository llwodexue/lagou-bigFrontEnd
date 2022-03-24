// Functor函子
class Container {
  // 静态方法可以直接通过类名调用
  static of(value) {
    return new Container(value)
  }
  constructor(value) {
    // 盒子里面有一个值
    this._value = value
  }
  // 对外公布一个 map 方法，接收一个处理值的纯函数
  map(fn) {
    // 返回一个新盒子（函子）
    return Container.of(fn(this._value))
  }
}

// 调用 map 方法时需要传递一个函数来处理 Container 里的值
// let r = new Container(5).map(x => x + 1).map(x => x * x)
// 每次创建一个函子都需要调用 new 来创建，可以对 new 进行封装
// console.log(r)

// TypeError: Cannot read property 'toUpperCase' of null
Container.of(null).map(x => x.toUpperCase())
