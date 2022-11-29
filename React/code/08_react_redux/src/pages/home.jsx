import React, { PureComponent } from 'react'
import store from '../store'

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
  render() {
    const { counter } = this.state
    return (
      <div>
        <h2>Home {counter}</h2>
        <button>count+1</button>
        <button>count+5</button>
        <button>count-1</button>
      </div>
    )
  }
}

export default Home
