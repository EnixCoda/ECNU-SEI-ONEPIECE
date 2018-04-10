import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleWare from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'

import reducer from './reducer'
import Saga from './sagas'

const sagaMiddleware = createSagaMiddleWare()
const store = createStore(reducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))
let sagaTask = sagaMiddleware.run(Saga)

export default store

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducer', () => {
    const nextRootReducer = require('./reducer')
    store.replaceReducer(nextRootReducer)
  })
  module.hot.accept('./sagas', () => {
    sagaTask.cancel()
    sagaTask.done.then(() => {
      const Saga = require('./sagas').default
      sagaTask = sagaMiddleware.run(function* () {
        yield Saga()
      })
    })
  })
}
