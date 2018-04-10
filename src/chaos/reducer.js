import { combineReducers } from 'redux'
import explorerReducer from './explorer/reducer'

export default combineReducers({
  explorer: explorerReducer,
})
