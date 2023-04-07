/**
 * 以center为中⼼的N⻆星的边缘路径。
 * @param center: N⻆星的中⼼点x,y坐标，例如：[100, 100]
 * @param starNum: N⻆星的⻆的数量，五⻆星starNum为5
 * @returns path 输出的路径值，示例：[[30, 30], [60, 30], ....]
 */
function createNStarPathByCenter(center, starNum) {
  const R = 70
  const r = R / 2

  const cor = 180 / starNum
  const path = []

  for (let i = 0; i < starNum; i++) {
    const x1 = R * Math.sin(((2 * i * cor) / 180) * Math.PI)
    const y1 = R * Math.cos(((2 * i * cor) / 180) * Math.PI)

    const x2 = r * Math.sin((((2 * i + 1) * cor) / 180) * Math.PI)
    const y2 = r * Math.cos((((2 * i + 1) * cor) / 180) * Math.PI)

    path.push([center[0] + Math.floor(x1), center[1] + Math.floor(y1)])
    path.push([center[0] + Math.floor(x2), center[1] + Math.floor(y2)])
  }
  return path
}
createNStarPathByCenter([100, 100], 5)
