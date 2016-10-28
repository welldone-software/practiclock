//@flow

import React, {PropTypes as T} from 'react'
import {Text, View} from 'react-native'

import {Router, Scene, Actions} from 'react-native-router-flux';



const PageOne = () => (
  <View style={{margin: 128}}>
    <Text onPress={Actions.pageTwo}>This is PageOne!</Text>
  </View>
)

const PageTwo = () => (
  <View style={{margin: 128}}>
    <Text onPress={Actions.pageOne}>This is page 2!</Text>
  </View>
)


export default () => (
  <Router>
    <Scene key="root">
      <Scene key="pageOne" component={PageOne} title="PageOne" initial={true}/>
      <Scene key="pageTwo" component={PageTwo} title="PageTwo"/>
    </Scene>
  </Router>
)
