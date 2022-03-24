// MayBe 函子
class MayBe {
  static of(value) {
    return new MayBe(value)
  }
  constructor(value) {
    this._value = value
  }
  map(fn) {
    return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this._value))
  }
  isNothing() {
    return this._value === null || this._value === undefined
  }
}

// let r = MayBe.of('Hello World').map(x => x.toUpperCase())
let r = MayBe.of('Hello World')
  .map(x => x.toUpperCase())
  .map(x => null)
  .map(x => x.split(' '))
// 至于什么时候出现null，但是我们不知道是哪一次出现的null
console.log(r)
