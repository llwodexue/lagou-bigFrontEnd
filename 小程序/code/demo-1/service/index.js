export function myReqeest(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success: res => {
        resolve(res.data)
      },
      fail: reject
    })
  })
}
class MYRequest {
  constructor(baseURL) {
    this.baseURL = baseURL
  }
  request(options) {
    const { url } = options
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        url: this.baseURL + url,
        success: res => {
          resolve(res.data)
        },
        fail: reject
      })
    })
  }
  get(options) {
    return this.request({ ...options, method: 'get' })
  }
  post(options) {
    return this.request({ ...options, method: 'post' })
  }
}
export const myReqInstance = new MYRequest('http://codercba.com:1888')
export const myLoginInstance = new MYRequest('http://123.207.32.32:3000')
