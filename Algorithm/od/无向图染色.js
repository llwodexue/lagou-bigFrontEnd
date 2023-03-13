/**
 *
 * 输入:
 *  4 4
 *  1 2
 *  2 4
 *  3 4
 *  1 3
 * 输出:
 *  7
 */

function main(edgeArrayList, m) {
  let count = 0
  //遍历所有可能的组合 举例： 10001 -> i 的二进制表达
  for (let i = 0; i < 1 << m; i++) {
    let flag = true
    for (let j = 0; j < edgeArrayList.length; j++) {
      // 检测所有的边相连的是否同为红颜色
      if (
        ((i >> (m - edgeArrayList[j][0])) & 1) == 1 &&
        ((i >> (m - edgeArrayList[j][1])) & 1) == 1
      ) {
        flag = false
        break
      }
    }
    if (flag) {
      count++
    }
  }
  return count
}

function main(edgeArr, m) {
  let count = 0
  const iLen = 1 << m
  const jLen = edgeArr.length
  for (let i = 0; i < iLen; i++) {
    let flag = true
    for (let j = 0; j < jLen; j++) {
      if (
        ((i >> (m - edgeArr[j][0])) & 1) == 1 &&
        ((i >> (m - edgeArr[j][1])) & 1) == 1
      ) {
        flag = false
        break
      }
    }
    if (flag) {
      count++
    }
  }
  return count
}

main(
  [
    [1, 2],
    [2, 4],
    [1, 3],
    [3, 4]
  ],
  4
)

console.log(
  main(
    [
      [1, 2],
      [2, 4],
      [1, 3],
      [3, 4]
    ],
    4
  )
)
