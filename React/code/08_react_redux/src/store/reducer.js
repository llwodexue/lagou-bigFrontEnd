const initialState = {
  counter: 100
}

function reducer(state = initialState, action) {
  switch(state.type) {
    case '': 
      return
    default:
      return state 
  }
}

export default reducer
