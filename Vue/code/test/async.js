import axios from 'axios'
// const axios = require('axios')

export function getPosts(callback) {
  return axios.get('https://jsonplaceholder.typicode.com/posts').then(res => {
    callback(res.data)
  })
}

export function getPosts2() {
  return axios.get('https://jsonplaceholder.typicode.com/posts').then(res => {
    return res.data.length
  })
}
