const { createStore } = require('redux')
const reducer = require('./reducer')

// 创建的 store
const store = createStore(reducer)

module.exports = store
