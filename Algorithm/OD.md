## 字符串重新排列

给定一个字符串 s，s 包括以空格分隔的若干个单词，请对 s 进行如下处理后输出：

1. 单词内部调整：对每个单词字母重新按字典序排序
2. 单词间顺序调整：
   1. 统计每个单词出现的次数，并按次数降序排列
   2. 次数相同，按单词长度升序排列
   3. 次数和单词长度均相同，按字典升序排列

```
输入：
This is an apple
输出：
an is This aelpp

输入：
My sister is in the house not in the yard
输出：
in in eht eht My is not adry ehosu eirsst
```

**题解**

```js
function main(inputStr) {
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
```

## 最差产品奖

A 公司准备对他下面的 N 个产品评选最差奖，评选的方式是首先对每个产品进行评分，然后根据评分区间计算相邻几个产品中最差的产品。评选的标准是依次找到从当前产品开始前 M 个产品中最差的产品，请给出最差产品的评分序列

```js
输入：
3
12,3,8,6,5
输出：
3,3,5
解释：
12,3,8 最差的是3
3,8,6 中最差的是3
8,6,5 中最差的是5
```

**题解**

```js
function minSlidingWindows(N, nums) {
  const res = []
  const len = nums.length
  const dq = []
  for (let i = 0; i < len; i++) {
    // 若队列不为空，且当前元素小于等于对尾所有下标的元素，则弹出对尾
    while (dq.length && nums[dq[dq.length - 1]] >= nums[i]) {
      dq.pop()
    }
    // 入队当前元素下标
    dq.push(i)
    // 判断当前最大值是否在窗口中，若不在便将其出队
    while (dq[0] <= i - N) {
      dq.shift()
    }
    // 当达到窗口大小时便开始向结果中添加数据
    if (i >= N - 1) {
      res.push(nums[dq[0]])
    }
  }
  return res
}
```

## 租车骑绿岛

部门组织绿岛骑行团建活动。租用公共双人自行车，每辆自行车最多坐 2 人，做最大载重 M。给出部门每个人的体重，请问最多需要租用多少双人自行车。输入描述:

- 第一行两个数字 m、n，分别代表自行车限重，部门总人数
- 第二行，n 个数字，代表每个人的体重，体重都小于等于自行车限重 m

0 < m <= 200

0 < n <= 1000000

```
输入：
3 4
3 2 2 1
输出：
3
```

**题解**

```js
// 双 for 循环
function main(m, n, nums) {
  nums.sort((a, b) => a - b)
  let min = 0
  for (let i = 0; i <= n; i++) {
    for (let j = n; j >= i; j--) {
      if (nums[i] + nums[j] > m) {
        i++
        min++
      } else {
        i++
        j--
        min++
      }
    }
  }
  return min
}

// 单循环
function main(m, n, nums) {
  nums.sort((a, b) => a - b)
  let min = 0
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    if (nums[left] + nums[right] <= m) {
      left += 1
    }
    right -= 1
    min += 1
  }
  return min
}
```

## 无向图染色

给一个无向图只染色，可以填红黑两种颜色，必须保证相邻两个节点不能同时为红色，输出有多少种不同的染色方案？

输入描述:

- 第一行输入 M(图中节点数) N(边数)
- 后续 N 行格式为: V1 V2 表示一个 V1 到 V2 的边
- 数据范围: 1 <= M <= 15,0 <= N <= M3，不能保证所有节点都是连通的

输出描述:

- 输出一个数字表示染色方案的个数

说明:4 个节点，4 条边，1 号节点和 2 号节点相连，2 号节点和 4 号节点相连，3 号节点和 4 号节点相连，1 号节点和 3 号节点相连，若想必须保证相邻两个节点不能同时为红色，总共 7 种方案

```js
输入:
4 4
1 2
2 4
3 4
1 3
输出:
7
```

**题解**

```js
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
```

## 等和子数组最小和（不确定）

给定一个数组 nums,将元素分为若干个组，使得每组和相等，求出满足条件的所有分组中，组内元素和的最小值输入描述:

第一行输入 m，接着输入m个数，表示此数组，数据范围：1<=M<=50, 1<=nums[i]<=50

```js
输入:
4 3 2 3 5 2 1
输出:
5
说明: 可以等分的情况有:
4 个子集 (5)， (1,4)， (2,3) ， (2,3)
2 个子集 (5,1,4)，(2,3,2,3)
但最小的为5
```

**题解**

```js
function main(cLen, cNums) {
  cNums.sort((a, b) => a - b)
  const sum = cNums.reduce((pre, cur) => pre + cur, 0)
  for (let i = 0; i < cLen; i++) {
    if (canPartition(i, cNums)) {
      return i
    }
  }

  function canPartition(len, nums) {
    const bagSize = sum / 2
    const dp = new Array(bagSize + 1).fill(0)
    for (let i = 0; i < len; i++) {
      for (let j = bagSize; j >= nums[i]; j--) {
        dp[j] = Math.max(dp[j], dp[j - nums[i]] + nums[i])
      }
    }
    return dp[bagSize] === bagSize
  }
}
```

## 链表中间节点

求单向链表中间的节点值，如果奇数个节点取中间，偶数个取偏右边的那个值

- 输入描述：第一行 链表头节点地址 path 后续输入的节点数 n 后续输入每行表示一个节点

  格式: "节点地址 节点值 下一个节点地址(-1表示空指针输入保证链表不会出现环，并且可能存在一些节点不属于链表

- 输出描述：链表中间节点值

```js
输入:
  00010 4
  00000 3 -1
  00010 5 12309
  11451 6 00000
  12309 7 11451
输出:
  6
```

**题解**

```js
function main(head, n, node_infos) {
  let nodes = {}
  node_infos.forEach(node => {
    let info = node.split(' ')
    nodes[info[0]] = [info[1], info[2]]
  })
  let node_list = []
  let node = nodes[head]
  while (node) {
    node_list.push(node[0])
    node = nodes[node[1]]
  }
  const len = node_list.length
  return node_list[len % 2 === 0 ? len / 2 : Math.floor(len / 2)]
}
```

## 不含101的数

小明在学习二进制时，发现了一类不含 101 的数，也就是将数字用二进制表示，不能出现 101。

现在给定一个整数区间 [l, r] 请问这个区间包含了多少个不含 101 的数?

输入描述

- 输入的唯-行包含两个正整数 l，r (1slsrs 109)

输出描述

- 输出的唯一一行包含一个整数，表示在 [l, r] 区间内一共有几个不含 101 的数

```js
输入：1 10
输出：8
解释：
区间[1,10] 内，5 的二进制表示为 101，10的二进制表示为 1010，因此区间[1,10]内有 10-2=8 个不含 101的数

输入：10 20
输出：7
样例解释：
区间[10.201]内，满足条件的数字有[12.14.15.16.17.18.191 因此答案为 7
```

**题解**

```js
function main(left, right) {
  let count = 0
  for (let i = left; i <= right; i++) {
    const binary = Number(i).toString(2)
    if (binary.includes('101')) {
      count++
    }
  }
  return right - left + 1 - count
}
```

## 过滤组合字符串

数字 0、1、2、3、4、5、6、7、8、9 分别关联 a~z 26个英文字母

- 0 关联 "a","b","c"
- 1 关联 "d","e","f"
- 2 关联 "g","h","i"
- 3 关联 "j","k","l"
- 4 关联 "m","n","o"
- 5 关联 "p","q","r"
- 6 关联 "s","t"
- 7 关联 "u","v"
- 8 关联 "w","x
- 9 关联 "y","z"

例如 7 关联"u","v"，8关联 "x","w"，输入一个字符串例如 "78"

和一个屏蔽字符串 "ux" 那么 "78" 可以组成多个字符串例如:"uw","x”,"wQ"，过这些完全包含屏蔽字符串的每一个字符的字符串，然后输出剩下的字符串

```
输入：78 ux
输出：uw Vx Vw
说明：ux完全包含屏蔽字符串ux，因此剔除
```

**题解**

```js
function main(digits, target) {
  const res = []
  const map = {
    0: 'abc',
    1: 'def',
    2: 'ghi',
    3: 'jkl',
    4: 'mno',
    5: 'pqr',
    6: 'st',
    7: 'uv',
    8: 'wx',
    9: 'yz'
  }
  function dfs(str, i) {
    if (i >= digits.length) {
      return str !== target ? res.push(str) : null
    }
    const letters = map[digits[i]]
    for (letter of letters) {
      dfs(str + letter, i + 1)
    }
  }
  dfs('', 0)
  return res
}
```

## 最多颜色的车辆

在一个狭小的路口，每秒只能通过一辆车，假好车辆的颜色只有 3 种，找出 N 秒内经过的最多颜色的车辆数量

三种颜色编号为 0，1，2

输入描述

- 第一行输入的是通过的车辆颜色信息

  [0,1,1,2] 代表 4 秒钟通过的车辆颜色分别是 0，1，1, 2

- 第二行输入的是统计时间窗，整型，单位为秒输出描述

  输出指定时间窗内经过的最多颜色的车辆数量样例

```js
输入：
0 1 2 1
3
输出：2
样例解释
在 3 秒时间窗内，每个颜色最多出现 2 次。例为: [1,2,1]

输入：
0 1 2 1
2
输出：1
样例解释
在 2 秒时间窗内，每个颜色最多出现 1 次
```

滑动窗口就是不断地调节子序列的起始位置和终止位置，从而得出我们想要的结果

- 在暴力解法中，是一个 for 循环滑动窗口的起始位置，一个 for 循环为滑动窗口的终止位置，用两个 for 循环完成一个不断搜索区间的过程

- 滑动窗口如何用一个 for 循环来完成这个操作？

  只用一个 for 循环，那么这个循环的索引，一定是表示滑动窗口的终止位置

![209.长度最小的子数组](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/209.%E9%95%BF%E5%BA%A6%E6%9C%80%E5%B0%8F%E7%9A%84%E5%AD%90%E6%95%B0%E7%BB%84.gif)

```js
function main(cars, n) {
  const car_count = new Array(3).fill(0)
  for (let i = 0; i < n; i++) {
    car_count[cars[i]] += 1
  }
  let result = Math.max(...car_count)
  for (let i = n; i < cars.length; i++) {
    car_count[cars[i]] += 1
    car_count[cars[i - n]] -= 1
    result = Math.max(
      result,
      Math.max(Math.max(car_count[0], car_count[1]), car_count[2])
    )
  }
  return result
}
```

