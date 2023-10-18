// pages/09/index.js
import { myReqInstance } from '../../service/index'
Page({
  data: {
    allCities: {},
    houselist: [],
    currentPage: 1
  },
  onLoad() {
    this.getCityData()
    this.getHouseData()
  },
  async getCityData() {
    const cityRes = await myReqInstance.get({
      url: '/api/city/all'
    })
    this.setData({ allCities: cityRes.data })
  },
  async getHouseData() {
    const houseRes = await myReqInstance.get({
      url: '/api/home/houselist',
      data: {
        page: this.data.currentPage
      }
    })
    const finalHouseList = [...this.data.houselist, ...houseRes.data]
    this.setData({ houselist: finalHouseList })
    this.data.currentPage++
  },
  onReachBottom() {
    this.getHouseData()
  }
})
