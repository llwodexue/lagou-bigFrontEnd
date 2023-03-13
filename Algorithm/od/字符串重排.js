// an is This aelpp
console.log(strSort('This is an apple'))
// in in eht eht My is not adry ehosu eirsst
console.log(strSort('My sister is in the house not in the yard'))

/**
 * 1. 单词内部调整：对每个单词字母重新按字典序排序
 * 2. 单词间顺序调整：
 *    1. 统计每个单词出现的次数，并按次数降序排列
 *    2. 次数相同，按单词长度升序排列
 *    3. 次数和单词长度均相同，按字典升序排列
 */
function strSort(inputStr) {
  const strList = inputStr.split(' ').map(str => [...str].sort().join(''))

  const countMap = strList.reduce((pre, cur) => {
    pre[cur] ? pre[cur]++ : (pre[cur] = 1)
    return pre
  }, {})

  strList.sort((a, b) => {
    // 次数多的在前面
    if (countMap[a] > countMap[b]) {
      return -1
    // 次数多的在后面
    } else if (countMap[a] < countMap[b]) {
      return 1
    // 次数相同的
    } else {
      // 长度长的在后面
      if (a.length > b.length) {
        return 1
      // 长度相同的按字典升序排列
      } else if (a.length === b.length) {
        return a - b
      // 长度低的在前面
      } else {
        return -1
      }
    }
  })

  return strList.join(' ')
}

// 统计词频直接用 reduce 即可
// console.log(
//   'abcbcbcbcbc'.split('').reduce((pre, cur) => {
//     pre[cur] ? pre[cur]++ : (pre[cur] = 1)
//     return pre
//   }, {})
// )

function main(input_str) {
  let str_list = input_str.split(' ').map(str => [...str].sort().join(''))

  const str_count = str_list.reduce((a, b) => {
    a[b] ? a[b]++ : (a[b] = 1)
    return a
  }, {})

  str_list.sort((a, b) =>
    str_count[a] !== str_count[b]
      ? str_count[b] - str_count[a]
      : a.length !== b.length
      ? a.length - b.length
      : a > b
      ? 1
      : -1
  )

  console.log(str_list.join(' '))
}

main('My sister is in the house not in the yard')
