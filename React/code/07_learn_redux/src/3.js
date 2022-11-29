const store = require('./store')

const unsubscribe = store.subscribe(() => {
  console.log('订阅数据变化', store.getState())
})

// 修改 store 中的数据，必须用 action
store.dispatch({ type: 'change_name', name: 'why' })
store.dispatch({ type: 'add_count', num: 1 })

unsubscribe()
store.dispatch({ type: 'add_count', num: 1 })
