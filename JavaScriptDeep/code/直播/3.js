class Functor {
  static of(value) {
    return new Functor(value)
  }
  constructor(value) {
    this._value = value
  }
  map(fn) {
    return Functor.of(fn(this._value))
  }
  value(f) {
    return f(this._value)
  }
}
