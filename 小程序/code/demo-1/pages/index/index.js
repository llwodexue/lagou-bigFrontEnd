// index.js
Page({
  data: {
    pages: [
      { name: '1_注册页面', path: '/pages/01/index' },
      { name: '2_常见组件', path: '/pages/02/index' },
      { name: '3_WXSS', path: '/pages/03/index' },
      { name: '4_WXML', path: '/pages/04/index' },
      { name: '5_WXS', path: '/pages/05/index' },
      { name: '6_事件处理', path: '/pages/06/index' },
      { name: '7_组件化开发', path: '/pages/07/index' },
      { name: '8_插槽', path: '/pages/08/index' },
      { name: '9_网络请求API', path: '/pages/09/index' },
      { name: '10_系统API', path: '/pages/10/index' },
      { name: '11_页面跳转', path: '/pages/11/index' },
      { name: '12_登录', path: '/pages/12/index' }
    ]
  },
  onBtnClick(event) {
    // 1.获取item
    const item = event.target.dataset.item
    // 2.跳转路径
    wx.navigateTo({
      url: item.path
    })
  }
})
