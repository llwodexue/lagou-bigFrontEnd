// //JSRUN引擎2.0,支持多达30种语言在线运行,全仿真在线交互输入输出。
// function main(head, n, node_infos) {
//   let nodes = {}

//   node_infos.forEach(node_info => {
//     let info = node_info.split(' ')
//     nodes[info[0]] = [info[1], info[2]]
//   })

//   let node_list = []

//   let node = nodes[head]
//   while (node) {
//     node_list.push(node[0])
//     node = nodes[node[1]]
//   }

//   let len = node_list.length
//   console.log(node_list[len % 2 === 0 ? len / 2 : Math.floor(len / 2)])
// }

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

main('00010', 4, ['00000 3 -1', '00010 5 12309', '11451 6 00000', '12309 7 11451'])
