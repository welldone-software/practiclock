// @flow

import { createStore, combineReducers } from 'redux'
import devTools from 'remote-redux-devtools'
//import {navigation} from './reducers'


const reducer = combineReducers({
  //navigation
})

export default function configureStore(initialState?: Object){
  return createStore(reducer, initialState, devTools())
}




