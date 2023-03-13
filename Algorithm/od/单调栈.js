// 单调栈：通常是一维数组，要寻找任一个元素的右边或者左边第一个比自己大或者小的元素的位置，此时我们就要想到可以用单调栈了。时间复杂度为O(n)。

/**
 * 单调栈的本质是空间换时间，因为在遍历的过程中需要用一个栈来记录右边第一个比当前元素高的元素，优点是整个数组只需要遍历一次。
 * 更直白来说，就是用一个栈来记录我们遍历过的元素，因为我们遍历数组的时候，我们不知道之前都遍历了哪些元素，以至于遍历一个元素找不到是不是之前遍历过一个更小的，所以我们需要用一个容器（这里用单调栈）来记录我们遍历过的元素。
 */

function dailyTemperatures(temperatures) {
  const n = temperatures.length
  const res = new Array(n).fill(0)
  const stack = []
  stack.push(0)
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const top = stack.pop()
      res[top] = i - top
    }
    stack.push(i)
  }
  return res
}

console.log(dailyTemperatures([73, 74, 75, 71, 71, 72, 76, 73]))
