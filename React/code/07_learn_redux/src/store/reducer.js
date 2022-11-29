const { CHANGE_NAME, ADD_COUNT } = require('./constants')

// 初始化的数据
const initialState = {
  name: 'bird',
  count: 12
}

// 定义 reducer 函数，纯函数
function reducer(state = initialState, action) {
  // 有新数据进行更新，那么返回一个新的 state
  switch (action.type) {
    case CHANGE_NAME:
      return { ...state, name: action.name }
    case ADD_COUNT:
      return { ...state, count: state.count + action.num }
    default:
      return state
  }
}

module.exports = reducer
