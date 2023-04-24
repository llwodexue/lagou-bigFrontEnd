// vue2
// - http://:localhost:9080/#/
//     - energy

// vue3
// - http://:localhost:9081/#/
//     - index
//     - select
// react15
// - http://:localhost:9082/#/
//    -/information
//    -/information-last
//    -/video
//    -/video-last
// react17
// - http://:localhost:9083/#/
//     -/login
//     -/new-car
//     -/rank

// ```

// 子应用列表
export const subNavList = [
  {
    name: 'react15', //子应用名称
    activeRule: '/react15', // 激活规则
    container: '#micro-container', // 显示的容器，唯一标识
    entry: '//localhost:9082/' // 启动的入口
  },
  {
    name: 'react17',
    activeRule: '/react17',
    container: '#micro-container',
    entry: '//localhost:9083/' // 启动的入口
  },
  {
    name: 'vue2',
    activeRule: '/vue2',
    container: '#micro-container',
    entry: '//localhost:9080/'
  },
  {
    name: 'vue3',
    activeRule: '/vue3',
    container: '#micro-container',
    entry: '//localhost:9081/'
  }
]
