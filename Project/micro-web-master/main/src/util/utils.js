import { MicroStart } from '../../micro'
import { loading } from '../store'
const { registerMicroApps, start } = MicroStart
// 注册子应用
export const registerApp = list => {
  // 注册到微前端框架
  registerMicroApps(list, {
    beforeLoad: [
      () => {
        loading.changeLoading(true)
        console.log('开始加载')
      }
    ],
    mounted: [
      () => {
        loading.changeLoading(false)
        console.log('渲染完成')
      }
    ],
    destoryed: [
      () => {
        console.log('卸载完成')
      }
    ]
  })

  // 启动微前端框架
  start()
}
