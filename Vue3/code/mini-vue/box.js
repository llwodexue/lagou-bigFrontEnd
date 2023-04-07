/**
 * 在⼆维平⾯内计算：
 * 左上⻆为0，0, 右⽅为x轴正⽅向，下⽅为y轴正⽅向
 * @param startPos ⼩球运动起点，例如：[5,10]
 * @param direction 运动初始⽅向，例如：[[0,0],[5,5]]代表从[0,0]指向[5,5]
 * @param box 外围框，例如：[[0,0],[100,0],[100,100],[0,100]]
 * @param obstacle 障碍物位置，例如：[[70,20],[70, 35]] 代表障碍物线段两端位置
 * @returns endPos 返回结束位置，例如：[20,32]
 */
function getEndPos(startPos, direction, box, obstacle) {
  box = box.flat()
  const width = box[2] - box[0]
  const height = box[5] - box[1]

  const sp = [...startPos]
  let vx = 1
  let vy = direction.reduce((pre, cur) => cur[1] - pre[1] / cur[0] - pre[0])

  function directionPath() {
    sp[0] = sp[0] + vx
    sp[1] = sp[1] + vy
    if (sp[0] >= width) {
      vx = -vx
    }
    if (sp[0] <= 0) {
      vx = Math.abs(vx)
    }
    if (sp[1] >= height) {
      vy = -vy
    }
    if (sp[1] <= 0) {
      vy = Math.abs(vy)
    }
    return [sp[0], sp[1]]
  }

  let dir = true // 横向
  obstacle = obstacle.flat()
  let max = Math.max(obstacle[2], obstacle[0])
  let min = Math.min(obstacle[2], obstacle[0])
  if (obstacle[2] === obstacle[0]) {
    dir = false // 竖向
    max = Math.max(obstacle[3], obstacle[1])
    min = Math.min(obstacle[3], obstacle[1])
  }
  while (true) {
    const path = directionPath(sp)
    if (dir) {
      if (path[1] === obstacle[1] && max >= path[1] && path[1] >= min) {
        return path
      }
    } else {
      if (path[0] === obstacle[0] && max >= path[1] && path[1] >= min) {
        return path
      }
    }
  }
}
getEndPos(
  [5, 30],
  [
    [0, 0],
    [5, 5]
  ],
  [
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100]
  ],
  [
    [70, 20],
    [70, 50]
  ]
)
