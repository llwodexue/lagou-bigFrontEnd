import { isTurnChild } from '../utils'
// 每次路由切换打印事件
export const turnApp = () => {
  if (isTurnChild()) {
    console.log('路由切换了')
  }
}
