// @flow
import {createStore, combineReducers} from 'redux'
import {persistStore, autoRehydrate} from 'redux-persist'
import {AsyncStorage} from 'react-native'
import devTools from 'remote-redux-devtools'
import {navigation, practices} from './reducers'

export default function configureStore() {
  const reducer = combineReducers({ navigation, practices })
  const store = createStore(reducer, undefined, autoRehydrate(), devTools())
  persistStore(store, {storage: AsyncStorage})
  return store;
};
