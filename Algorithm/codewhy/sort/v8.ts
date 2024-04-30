const arr = [0, 1, 10, 2, 3, 5]

/**
 * Timsort 是一种混合稳定的排序算法，源自合并排序(Merge Sort)和插入排序(Insertion Sort)
 * V8:合并排序(Merge Sort)和插入排序(Binary Insertion Sort)
 */
arr.sort((a, b) => {
  console.log(a, b)
  if (a > b) {
    return 1
  } else if (a < b) {
    return -1
  } else {
    return 0
  }
})

console.log(arr)
