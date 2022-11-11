export function isPlainObject(val) {
  return toString.call(val) === '[object Object]';
}
