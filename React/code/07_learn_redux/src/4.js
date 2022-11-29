/**
 * 优化：
 *  1.将派发的 action 生成的过程放到一个 actionCreators 函数中
 *  2.将定义的所有 actionCreators 的函数，放到一个独立的文件中
 *  3.actionCreators 和 reducer 函数中使用的字符串常量是一致的，所以将常量抽取到一个独立 constant 文件中
 *  4.将 reducer 和默认值（initialState）放到一个独立的 reducer 文件中，而不是在 index.js
 */


const store = require('./store')
const { changeNameAction, addCountAction } = require('./store/actionCreators')


const unsubscribe = store.subscribe(() => {
  console.log('订阅数据变化', store.getState())
})

// 修改 store 中的数据，必须用 action
store.dispatch(changeNameAction('why'))
store.dispatch(changeNameAction('cat'))
store.dispatch(addCountAction(1))

unsubscribe()
