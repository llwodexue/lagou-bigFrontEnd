// pages/07/index.js
Page({
  data: {
    digitalTitles: ['电脑', '手机', 'iPad']
  },
  onSectionTitleClick(event) {
    console.log('区域title发生了点击', event.detail)
  },
  onTabIndexChange(event) {
    const index = event.detail
    console.log('tabControl索引改变', index, this.data.digitalTitles[index])
  },
  onExecTCMethod() {
    const tabControl = this.selectComponent('.tab-control')
    tabControl.test()
  }
})
