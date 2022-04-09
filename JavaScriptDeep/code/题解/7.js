const data = [
  { id: 0, parentId: null, text: '一级文本' },
  { id: 1, parentId: 0, text: '二级文本' },
  { id: 2, parentId: 0, text: '三级文本' },
  { id: 3, parentId: null, text: '四级文本' },
  { id: 4, parentId: 3, text: '五级文本' },
  { id: 5, parentId: 3, text: '六级文本' },
]

// 方案1：双filter
const list2Tree = function (data) {
  let arr = data.filter(item => item.parentId === null)
  arr.forEach(item => {
    let children = data.filter(cur => cur.parentId === item.id)
    if (children.length > 0) item.children = children
  })
  return arr
}

// 方案2：map结构
const list2Tree = function (data) {
  let map = new Map()
  let result = []
  data.forEach(item => map.set(item.id, item))
  data.forEach(item => {
    let { parentId } = item
    let parent
    if (parentId === null) {
      result.push(item)
      return
    }
    parent = map.get(parentId)
    parent.children ? parent.children.push(item) : (parent.children = [item])
  })
  return result
}

console.log(list2Tree(data))
