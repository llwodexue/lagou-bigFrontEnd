function _new(constructor, ...arg) {
  const obj = {}
  obj.__proto__ = constructor.prototype
  const result = constructor.apply(obj, arg)
}
