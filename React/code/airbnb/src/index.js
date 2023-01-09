import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import theme from './assets/theme'
import 'normalize.css'
// import 'antd/dist/antd.less'
import './assets/css/index.less'
import { ThemeProvider } from 'styled-components'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Suspense fallback='loading'>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <HashRouter>
          <App />
        </HashRouter>
      </ThemeProvider>
    </Provider>
  </Suspense>
)
