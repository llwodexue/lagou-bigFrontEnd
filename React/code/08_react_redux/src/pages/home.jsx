import React, { PureComponent } from 'react'
import store from '../store'
import { subNumberAction } from '../store/actionCreators'

export class Home extends PureComponent {
  constructor() {
    super()
    this.state = {
      counter: store.getState().counter
    }
  }
  componentDidMount() {
    store.subscribe(() => {
      const state = store.getState()
      this.setState({ counter: state.counter })
    })
  }
  subNumber(num){
    store.dispatch(subNumberAction(num))
  }
  render() {
    const { counter } = this.state
    return (
      <div>
        <h2>Home {counter}</h2>
        <button onClick={e => this.subNumber(1)}>count-1</button>
        <button onClick={e => this.subNumber(5)}>count-5</button>
        <button onClick={e => this.subNumber(8)}>count-8</button>
      </div>
    )
  }
}

export default Home
