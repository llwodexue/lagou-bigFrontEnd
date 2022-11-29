const store = require('./store')

const nameAction = { type: 'change_name', name: 'why' }
store.dispatch(nameAction)

const countAction = { type: 'add_count', num: 1 }
store.dispatch(countAction)

console.log(store.getState())
