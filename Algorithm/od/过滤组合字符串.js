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

console.log(main('78', 'ux'))
