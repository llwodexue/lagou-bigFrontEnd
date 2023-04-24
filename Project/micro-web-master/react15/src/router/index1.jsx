import React from 'react'
import { Router, Route, hashHistory } from 'react-router';

import App from '../pages/App/index.jsx'

class BasicMap extends React.Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={App}/>
      </Router>
    )
  }
}

export default BasicMap
