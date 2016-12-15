// @flow
import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import {persistStore, autoRehydrate} from 'redux-persist'
import thunk from 'redux-thunk'
import {AsyncStorage} from 'react-native'
import {REHYDRATE} from 'redux-persist/constants'
import {Actions} from 'react-native-router-flux'
import {navigation, practices, exercises} from './reducers'

const navigationMiddleware = store => next => action => {
    const result = next(action)
    const {type, payload} = action

    switch (type) {
      case REHYDRATE:
        //   if (payload.navigation) Actions[payload.navigation.scene.parent]()
          break
      default:
          break
    }

    return result
}

const middleware = [thunk, navigationMiddleware]

export default function configureStore() {
    const reducer = combineReducers({ navigation, practices, exercises })
    const enhancer = compose(
        applyMiddleware(...middleware),
        autoRehydrate()
    )
    const store = createStore(reducer, enhancer)
    return store
}
