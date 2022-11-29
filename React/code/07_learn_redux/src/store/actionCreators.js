const { CHANGE_NAME, ADD_COUNT } = require('./constants')

const changeNameAction = name => ({
  type: CHANGE_NAME,
  name
})
const addCountAction = num => ({
  type: ADD_COUNT,
  num
})

module.exports = {
  changeNameAction,
  addCountAction
}
