// pages/10/index.js
Page({
  onShowToast() {
    wx.showToast({
      title: '购买成功！',
      icon: 'success',
      mask: true,
      duration: 3000
    })
    // wx.showLoading({
    //   title: '加载中ing'
    // })
  },
  onShowModal() {
    wx.showModal({
      title: '确定购买吗？',
      content: '确定是否有钱',
      confirmColor: '#f00',
      complete: res => {
        if (res.cancel) {
          console.log('Modal cancel')
        }
        if (res.confirm) {
          console.log('Modal confirm')
        }
      }
    })
  },
  onShowAction() {
    wx.showActionSheet({
      itemList: ['衣服', '鞋子', '书包']
    })
  },
  // 2.内容分享
  onShareAppMessage() {
    return {
      title: '旅途的内容',
      path: '/pages/favor/favor',
      imageUrl: '/assets/nhlt.jpg'
    }
  },
  onGetSystemInfo() {
    // 3.获取手机的基本信息
    wx.getSystemInfo({
      success: res => {
        console.log(res)
      }
    })
    // 3.获取手机位置信息
    wx.getLocation({
      success: res => {
        console.log(res)
      }
    })
  },
  // 4.本地存储
  onLocalStorage() {
    // 1.存储一些键值对
    wx.setStorageSync('name', 'why')
    wx.setStorageSync('age', 18)
    wx.setStorageSync('friends', ['abc', 'cba', 'nba'])
    // 2.获取storage中内容
    const name = wx.getStorageSync('name')
    const age = wx.getStorageSync('age')
    const friends = wx.getStorageSync('friends')
    console.log(name, age, friends)
    // 3.删除storage中内容
    // wx.removeStorageSync('name')
    // 4.清空storage中内容
    // wx.clearStorageSync()

    wx.setStorage({
      key: 'books',
      data: '哈哈哈',
      encrypt: true,
      success: res => {
        wx.getStorage({
          key: 'books',
          encrypt: true,
          success: res => {
            console.log(res)
          }
        })
      }
    })
  }
})
