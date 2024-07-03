let arr = [
  { name: 'item1', idCard: false, phone: true },
  { name: 'item2', idCard: true, phone: false },
  { name: 'item3', idCard: true, phone: true },
  { name: 'item4', idCard: false, phone: false },
  { name: 'item5', idCard: true, phone: true },
  { name: 'item6', idCard: false, phone: false }
]

arr.sort((a, b) => {
  // 比较两个字段都是true的情况，优先级最高
  if (!(a.idCard && a.phone) && b.idCard && b.phone) return -1
  if (a.idCard && a.phone && !(b.idCard && b.phone)) return 1

  // 当一个字段为true时，比较哪个对象有更多的true字段
  const aTrueCount = a.idCard + a.phone
  const bTrueCount = b.idCard + b.phone
  if (aTrueCount !== bTrueCount) return aTrueCount -bTrueCount

  // 如果true字段的数量相同，则保持原有顺序或自定义其他排序逻辑
  return 0 // 或者根据其他字段进行排序
})

console.log(arr)
