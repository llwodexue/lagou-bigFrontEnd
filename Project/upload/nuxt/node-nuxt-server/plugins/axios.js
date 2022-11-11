import Vue from 'vue'
import axios from 'axios'

const service = axios.create({
  baseURL: '/api'
})

export default ({ store, redirect }) => {
  //请求拦截器
  service.interceptors.request.use(async config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.common['Authorization'] = 'Hope ' + token
    return config
  })

  //响应拦截器
  service.interceptors.response.use(async response => {
    let { data } = response
    // 只需要返回data数据给前端

    //return data;
    return response
  })
}

Vue.prototype.$http = service

export const http = service
