class Graph<T> {
  // 顶点
  vertices: T[] = []
  // 边：邻接表
  adjoinList: Map<T, T[]> = new Map()
  /** 添加顶点 */
  addVertex(vertex: T) {
    // 将顶点添加数组中保存
    this.vertices.push(vertex)
    // 创建一个邻接表的数组
    this.adjoinList.set(vertex, [])
  }
  /** 添加边 */
  addEdge(v1: T, v2: T) {
    this.adjoinList.get(v1)?.push(v2)
    this.adjoinList.get(v2)?.push(v1)
  }
  /** 遍历边 */
  traverse() {
    console.log('Graph:')
    this.vertices.forEach(vertex => {
      const edges = this.adjoinList.get(vertex)
      console.log(`${vertex} -> ${edges?.join(' ')}`)
    })
  }
  /** 广度优先搜索 */
  bfs() {
    // 1.判断是否有顶点
    if (this.vertices.length === 0) return
    // 2.创建队列结构访问每一个顶点
    const queue: T[] = []
    queue.push(this.vertices[0])
    // 3.创建Set结构，记录每一个顶点是否访问过
    const visited = new Set<T>()
    visited.add(this.vertices[0])
    // 4.遍历队列中每一个顶点
    while (queue.length) {
      // 访问队列中第一个顶点
      const vertex = queue.shift()!
      console.log(vertex)
      // 相邻的顶点
      const neighbors = this.adjoinList.get(vertex)
      if (!neighbors) continue
      for (const nei of neighbors) {
        if (!visited.has(nei)) {
          visited.add(nei)
          queue.push(nei)
        }
      }
    }
  }
  /** 深度优先搜索 */
  dfs() {
    // 1.判断是否有顶点
    if (this.vertices.length === 0) return
    // 2.创建栈结构
    const stack: T[] = []
    stack.push(this.vertices[0])
    // 3.创建Set结构
    const visited = new Set<T>()
    visited.add(this.vertices[0])
    // 4.从第一个顶点开始访问
    while (stack.length) {
      const vertex = stack.pop()!
      console.log(vertex)
      const neighbors = this.adjoinList.get(vertex)
      if (!neighbors) continue
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const nei = neighbors[i]
        if (!visited.has(nei)) {
          visited.add(nei)
          stack.push(nei)
        }
      }
    }
  }
}

const graph = new Graph()
graph.addVertex('A')
graph.addVertex('B')
graph.addVertex('C')
graph.addVertex('D')
graph.addVertex('E')
graph.addVertex('F')
graph.addVertex('G')
graph.addVertex('H')
graph.addVertex('I')
graph.addEdge('A', 'B')
graph.addEdge('A', 'C')
graph.addEdge('A', 'D')
graph.addEdge('C', 'D')
graph.addEdge('C', 'G')
graph.addEdge('D', 'G')
graph.addEdge('D', 'H')
graph.addEdge('B', 'E')
graph.addEdge('B', 'F')
graph.addEdge('E', 'I')
// graph.traverse()
// graph.bfs()
graph.dfs()

export {}
