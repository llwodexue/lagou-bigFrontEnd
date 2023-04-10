function _new(constructor, ...arg) {
  const obj = Object.create(null)
  obj.__proto__ = constructor.prototype
  const result = constructor.apply(obj, arg)
}
