// @flow
import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import {persistStore, autoRehydrate} from 'redux-persist'
import {AsyncStorage} from 'react-native'
import devTools from 'remote-redux-devtools'
import {REHYDRATE} from 'redux-persist/constants'
import {Actions} from 'react-native-router-flux'
import {navigation, practices, exercises} from './reducers'

const navigationMiddleware = store => next => action => {
    const result = next(action)
    const {type, payload} = action

    switch (type) {
      case REHYDRATE:
          if (payload.navigation) Actions[payload.navigation.scene.parent]()
          break
      default:
          break
    }
    
    return result
}

const middleware = [navigationMiddleware] 

export default function configureStore() {
    const reducer = combineReducers({ navigation, practices, exercises })
    const enhancer = compose(
        applyMiddleware(...middleware),
        autoRehydrate()
        // devTools()
    )
    const store = createStore(reducer, enhancer)
    persistStore(store, {storage: AsyncStorage})
    return store
}
