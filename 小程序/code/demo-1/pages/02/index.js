// pages/02/index.js
Page({
  data: {
    message: 'Hello World',
    chooseImageUrl: '',
    viewColors: ['red', 'blue', 'green', 'skyblue', 'purple']
  },
  getUserInfo(event) {
    // 调用API，获取用户信息
    // 早期小程序的API，基本上都是不支持Promise
    // 后期小程序的API，基本上都支持Promise
    wx.getUserProfile({
      desc: 'desc'
    }).then(res => {
      console.log(res)
    })
  },
  getPhoneNumber(event) {
    console.log(event)
  },
  onChooseImage() {
    wx.chooseMedia({
      mediaType: 'image'
    }).then(res => {
      const imagePath = res.tempFiles[0].tempFilePath
      this.setData({ chooseImageUrl: imagePath })
    })
  },
  onScrollToUppeer() {
    console.log('滚动到最顶部、左部')
  },
  onScrollToLower() {
    console.log('滚动到最底部、右部')
  }
})
