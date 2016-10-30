// @flow
import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import {persistStore, autoRehydrate} from 'redux-persist'
import {AsyncStorage} from 'react-native'
import devTools from 'remote-redux-devtools'
import {Actions} from 'react-native-router-flux';  
import {REHYDRATE} from 'redux-persist/constants'
import {navigation, practices} from './reducers'

const navigationMiddleware = store => next => action => {
    const result = next(action)
    const {type, payload} = action

    switch (type) {
      case REHYDRATE:
          Actions[payload.navigation.scene.parent]()
          break
      default:
          break
    }
    
    return result
}

const middleware = [navigationMiddleware] 

export default function configureStore() {
    const reducer = combineReducers({ navigation, practices })
    const enhancer = compose(
        applyMiddleware(...middleware),
        autoRehydrate()
        // devTools()
    )
    const store = createStore(reducer, enhancer)
    persistStore(store, {storage: AsyncStorage})
    return store
}
