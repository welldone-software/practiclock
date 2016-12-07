//@flow
import React, {Component} from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Navigator
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {
    Actions,
    ActionConst,
    Modal,
    Router,
    Scene
} from 'react-native-router-flux'
import { connect, Provider } from 'react-redux'
import Practice from './Practice'
import PracticeList from './practices/List'
import Exercise from './Exercise'
import ExerciseList from './ExerciseList'
import Player from './Player'
import configureStore from '../store'

const RouterWithRedux = connect()(Router)
const store = configureStore()

const SequenceItem = ({id}) => (
    <View style={{margin: 128}}>
        <Text>SequenceItem {id}</Text>
        <Text onPress={Actions.pop}>back</Text>
    </View>
)

const title2icon = {
    Practices: 'ios-alarm-outline',
    Exercises: 'ios-list-box-outline'
}

const TabIcon = ({ selected, title }) => (
    <View style={{alignItems: 'center'}}>
        <Icon 
            style={{
                color: '#75949A'
            }}
            size={28} 
            name={title2icon[title] || 'logo-apple'}
        />
        <Text 
            style={{
                fontSize: 12,
                color: '#75949A',
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
                            tabBarStyle={{
                                backgroundColor: '#fff',
                                borderTopWidth: 1,
                                borderTopColor: '#f5f5f5'
                            }}
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
                        <Scene key="playerOpen" direction="vertical">
                            <Scene key="play" component={Player} title="Player" hideTabBar/>
                        </Scene>
                    </Scene>
                </Scene>
            </RouterWithRedux>
        </Provider>
    )
}
