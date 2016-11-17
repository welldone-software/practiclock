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
    Actions,
    ActionConst,
    Modal,
    Router,
    Scene
} from 'react-native-router-flux'
import { connect, Provider } from 'react-redux'
import Practice from './Practice'
import PracticeList from './PracticeList'
import Exercise from './Exercise'
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
        <Ionicons 
            style={{
                color: '#fff'
            }} 
            size={20} 
            name={title2icon[title] || 'logo-apple'}
        />
        <Text 
            style={{
                fontSize: 12,
                color: '#fff',
                fontWeight: selected ? '900' : 'normal'
            }}
        >
            {title}
        </Text>
    </View>
)

export default () => {
    return (
        <Provider store={store}>
            <RouterWithRedux>
                <Scene key="modal" component={Modal}>
                    <Scene key="root">
                        <Scene
                            key="tabbar"
                            tabs
                            tabBarStyle={{backgroundColor: '#79909b'}}
                          >
                            <Scene 
                                key="practices"
                                title="Practices"
                                icon={TabIcon} 
                                onPress={()=> Actions.practiceList({type: ActionConst.REFRESH, timestamp: Date.now()})}
                            >
                                <Scene key="practiceList" component={PracticeList} title="Practices"/>
                                <Scene key="practiceView" component={Practice} title="Practice" hideTabBar/>
                            </Scene>
                            <Scene 
                                key="exercises"
                                title="Exercises"
                                icon={TabIcon}
                                onPress={()=> Actions.exerciseList({type: ActionConst.REFRESH, timestamp: Date.now()})}
                            >
                                <Scene key="exerciseList" component={ExerciseList} title="Exercises"/>
                                <Scene key="exerciseView" component={Exercise} title="Exercise" hideTabBar/>
                            </Scene>
                        </Scene>
                        <Scene key="practiceCreate" direction="vertical">
                            <Scene key="practiceNew" component={Practice} title="New Practice" hideTabBar/>
                        </Scene>
                        <Scene key="exerciseCreate" direction="vertical">
                            <Scene key="exerciseNew" component={Exercise} title="New Exercise" hideTabBar/>
                        </Scene>
                    </Scene>
                </Scene>
            </RouterWithRedux>
        </Provider>
    )
}
