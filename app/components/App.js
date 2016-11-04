//@flow
import React, {Component} from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Navigator
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
    Router,
    Scene,
    Actions,
    Modal
} from 'react-native-router-flux'
import { connect, Provider } from 'react-redux'
import PracticeCreate from './PracticeCreate'
import PracticeList from './PracticeList'
import PracticeView from './PracticeView'
import PracticeEdit from './PracticeEdit'
import ExerciseCreate from './ExerciseCreate'
import ExerciseList from './ExerciseList'
import configureStore from '../store'

const RouterWithRedux = connect()(Router)
const store = configureStore()

const Plus = () => <Ionicons name="md-add" size={20} />

const SequenceItem = ({id}) => (
  <View style={{margin: 128}}>
    <Text>SequenceItem {id}</Text>
    <Text onPress={Actions.pop}>back</Text>
  </View>
)

const title2icon = {
    Practices:  'ios-alarm-outline',
    Exercises: 'ios-albums-outline',
}

const TabIcon = ({ selected, title }) => (
    <View style={{alignItems: 'center'}}>
        <Ionicons style={{color: selected? 'red' : 'black'}} size={20} name={title2icon[title] || 'logo-apple'}/>
        <Text style={{fontSize: 12, color: selected? 'red' : 'black'}}>{title}</Text>
    </View>
)

export default () => {
    return (
        <Provider store={store}>
            <RouterWithRedux>
                  <Scene key="modal" component={Modal}>
                      <Scene key="root">
                          <Scene key="tabbar" tabs tabBarStyle={{backgroundColor: 'white'}}>
                              <Scene key="practices" title="Practices" icon={TabIcon}>
                                  <Scene key="practiceList" component={PracticeList} title="Practices"/>
                                  <Scene key="practiceView" component={PracticeView} title="Practice"/>
                                  <Scene key="practiceEdit" component={PracticeEdit} title="Practice"/>
                              </Scene>
                              <Scene key="exercises" title="Exercises" icon={TabIcon}>
                                  <Scene key="exerciseList" component={ExerciseList} title="Exercises"/>
                                  <Scene key="exerciseItem" component={SequenceItem} title="Exercise"/>
                              </Scene>
                          </Scene>
                          <Scene key="practiceCreate" direction="vertical">
                              <Scene key="practiceNew" component={PracticeCreate} title="New Practice" hideTabBar/>
                          </Scene>
                          <Scene key="exerciseCreate" direction="vertical">
                              <Scene key="exerciseNew" component={ExerciseCreate} title="New Exercise" hideTabBar/>
                          </Scene>
                      </Scene>
                  </Scene>
            </RouterWithRedux>
        </Provider>
    )
}
