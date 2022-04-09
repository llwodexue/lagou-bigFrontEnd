const compare = function compare(a, b) {
  let reg = /^\d+(\.\d+){2}(-(alpha|beta|rc)\.\d+)?$/i
  let n = -1
  let flag
  if (!reg.test(a) || !reg.test(b)) throw new Error('请输入正确的版本号')
  a = a.split(/(?:\.|-)/g)
  b = b.split(/(?:\.|-)/g)
  // 基于递归进行比较版本号
  const recur = () => {
    n++
    let item1 = a[n]
    let item2 = b[n]
    if (!item1 || !item2) {
      // 有任意一项不存在
      flag = !item1 && !item2 ? 0 : !item1 ? 1 : -1
      return
    }
    let diff = isNaN(item1) || isNaN(item2) ? item1.localCompare(item2) : item1 - item2
    if (diff === 0) {
      // 当前比较是相同的；基于递归连续比较后面的
      recur()
      return
    }
    flag = diff > 0 ? 1 : -1
  }
  recur()
  return flag
}

console.log(compare('1.3.0-rc.1', '1.3.0'))
