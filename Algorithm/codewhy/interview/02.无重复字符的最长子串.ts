function lengthOfLongestSubstring(s: string): number {
  const n = s.length
  const map = new Map<string, number>()
  let left = 0
  let maxLength = 0
  for (let right = 0; right < n; right++) {
    const rightChar = s[right]
    // 保留最新的索引之前，先判断之前是否出现过这个字符
    if (map.has(rightChar) && map.get(rightChar)! >= left) {
      left = map.get(rightChar)! + 1
    }
    map.set(rightChar, right)
    const currLength = right - left + 1
    maxLength = Math.max(currLength, maxLength)
  }
  return maxLength
}

console.log(lengthOfLongestSubstring('abcabcbb'))
// console.log(lengthOfLongestSubstring('bbbbb'))
// console.log(lengthOfLongestSubstring('pwwkew'))

export {}
