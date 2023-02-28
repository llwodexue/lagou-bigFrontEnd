/**
 * 考虑如下几种情况：
 * 1. 属性是基本类型
 * 2. 属性是对象
 * 3. 属性是数组
 * 4. 循环引用的情况 obj.prop = obj
 */
function deepCloneV1(originObj, map = new WeakMap()) {
  if (typeof originObj === 'object') {
    if (map.get(originObj)) {
      return map.get(originObj)
    }
    const cloneObj = Array.isArray(originObj) ? [] : {}
    map.set(originObj, cloneObj)

    for (const prop in originObj) {
      cloneObj[prop] = deepCloneV1(originObj[prop], map)
    }
    return cloneObj
  } else {
    return originObj
  }
}

/**
 * 还存在一些问题
 * 1. 一些特殊类型的对象，比如：Date、RegExp、Set、Map
 * 2. 使用 typeof 来判断是否是对象有问题，typeof null -> 'object'
 */
function deepCloneV2(originObj, map = new Map()) {
  if (isObject) {
    if (map.get(originObj)) {
      return map.get(originObj)
    }
    const descObj = Object.getOwnPropertyDescriptors(originObj)
    const cloneObj = Object.create(Object.getPrototypeOf(originObj), descObj)
    map.set(originObj, cloneObj)

    const type = [Map, WeakMap, Set, WeakSet, Date, RegExp]
    if (type.includes(originObj.constructor)) {
      return new originObj.constructor(originObj)
    }

    for (const prop of Reflect.ownKeys(originObj)) {
      cloneObj[prop] =
        isObject(originObj[prop]) && typeof originObj[prop] !== 'function'
          ? deepCloneV2(originObj[prop], map)
          : originObj[prop]
    }
    return cloneObj
  } else {
    return originObj
  }
}

function isObject(obj) {
  return (typeof obj === 'object' || typeof obj === 'function') && obj !== null
}

let obj = {
  fun: function () {},
  syb: Symbol('foo'),
  a: undefined,
  b: NaN,
  c: Infinity,
  reg: /^abc$/,
  date: new Date(),
  set: new Set([1, 2, 3, 4, 4]),
  map: new Map([
    ['name', '张三'],
    ['title', 'Author']
  ]),
  text: 'aaa'
}
let cloneObj = deepCloneV2(obj)
console.log(cloneObj)
