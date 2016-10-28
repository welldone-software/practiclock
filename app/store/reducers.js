// // @flow
// import {NavigationExperimental} from 'react-native'
// import update from 'immutability-helper'
//
// const {
//   StateUtils,
// } = NavigationExperimental;
//
//
// const s = {
//   tabs: {
//     index: 0,
//     routes: [
//       {key: 'practices'},
//       {key: 'sequences'},
//       {key: 'sounds'}
//     ]
//   },
//   practices: {
//     index: 0,
//     routes: [
//       {key: 'list'},
//       {key: 'item'}
//     ]
//   },
//   sequences: {
//     index: 0,
//     routes: [
//       {key: 'list'},
//       {key: 'item'}
//     ]
//   },
//   sounds: {
//     index: 0,
//     routes: [
//       {key: 'list'},
//       {key: 'item'}
//     ]
//   }
// }
//
//
// function getCurrentTabKey(state){
//   const {tabs} = state;
//   return tabs.routes[tabs.index].key
// }
// // function pushPop(state, {key, params}, action){
// //   const {tabs} = state;
// //   const tabKey = tabs.routes[tabs.index].key
// //   const tabScenes = state[tabKey]
// //   const indexOfNewScene = tabScenes.indexOf(key)
// //
// //   const nextScenes = action(scenes, route)
// //   if (scenes !== nextScenes) {
// //     return {
// //       ...state,
// //       [tabKey]: nextScenes,
// //     }
// //   }
// //   return state
// // }
//
//
// function pushPop(state, currSceneIndex, newSceneIndex){
//
// }
//
// export function navigation(state: Object = defaultNavigationState, {type, payload:{key, params}}: Object){
//   switch(type){
//     case 'NAV_POP':{
//       const tabKey = getCurrentTabKey(state)
//       const currRouteIndex = state[tabKey].index
//       const newRouteIndex = currRouteIndex - 1
//       if(newRouteIndex <= 0){
//         break;
//       }
//
//       return update(state, {
//         [tabKey]: {
//           index: {$set: newRouteIndex},
//           routes: {
//             [currRouteIndex] : {$set: {params: undefined}}
//           }
//         }
//       })
//     }
//     case 'NAV_PUSH':{
//       const tabKey = getCurrentTabKey(state)
//       const currRouteIndex = state[tabKey].index
//       const newRouteIndex = state[tabKey].routes.findIndex(r => r.key === key)
//
//       return update(state, {
//         [tabKey]: {
//           index: {$set: newRouteIndex},
//           routes: {
//             [newRouteIndex] : {$set: {params}}
//           }
//         }
//       })
//
//     }
//     case 'NAV_SET_TAB':{
//       const tabKey = payload
//       const tabs = StateUtils.jumpTo(state.tabs, tabKey)
//       if(tabs !== state.tabs){
//         return {
//           ...state,
//           tabs,
//           [tabKey]: {...state[tabKey], index: 0}
//         }
//       }
//     }
//   }
//
// }
