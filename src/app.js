import React from 'react'
import { Provider } from 'react-redux'
import { hot } from 'react-hot-loader'

import store from './chaos/store'
import './app.css'

// import Loader from './components/Loader'
import Explorer from './components/Explorer'
import FileDialog from './components/FileDialog'
// import Test from './components/Test'

function App() {
  return (
    <div>
      <FileDialog />
      <Explorer />
    </div>
  )
}

function ReduxApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default hot(module)(ReduxApp)
