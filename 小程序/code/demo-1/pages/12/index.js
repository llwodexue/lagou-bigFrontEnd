import { getCode } from '../../service/login'
import { myLoginInstance } from '../../service/index'

// pages/12/index.js
Page({
  async onLoad() {
    // 1.获取token，判断token是否有值
    const token = wx.getStorageSync('token') || ''

    // 2.判断token是否过期
    const res = await myLoginInstance.post({
      url: '/auth',
      header: {
        token
      }
    })
    if (token && res.message === '已登录') {
      console.log('登录成功！')
    } else {
      this.handleLogin()
    }
  },
  async handleLogin() {
    // 1.获取code
    const code = await getCode()
    // 2.将这个code发送给自己的服务端
    const res = await myLoginInstance.post({ url: '/login', data: { code } })
    const token = res.token
    wx.setStorageSync('token', token)
  }
})
