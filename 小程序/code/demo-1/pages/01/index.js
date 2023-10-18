// pages/01/index.js
Page({
  data: {
    banners: [],
    recommends: [],
    counter: 100,
    btns: ['red', 'blue', 'green', 'orange']
  },
  onLoad() {
    wx.request({
      url: 'http://123.207.32.32:8000/home/multidata',
      success: res => {
        const data = res.data.data
        const banners = data.banner.list
        const recommends = data.recommend.list
        this.setData({ banners, recommends })
      }
    })
  },
  onBtnClick(event) {
    console.log('onBtnClick', event.target.dataset.color)
  },
  onPullDownRefresh() {},
  onReachBottom() {},
  onPageScroll() {}
  // 生命周期函数
})
