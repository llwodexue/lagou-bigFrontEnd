function createPatch(obj) {
  return function patch(vdom1, vdom2) {}
}
const patch = createPatch()

function isType(type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`
  }
}
const isObject = isType('Object')

Function.prototype.myBind = function (context, ...args) {
  return (...rest) => this.call(context, ...args, ...rest)
}

