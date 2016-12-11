//@flow
import React, {Component} from 'react'
import {
    Animated,
    AsyncStorage,
    Easing,
    Text,
    View,
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
import {connect, Provider} from 'react-redux'
import {persistStore} from 'redux-persist'
import Practice from './practices/Item'
import PracticeList from './practices/List'
import Exercise from './exercises/Item'
import ExerciseList from './exercises/List'
import Player from './Player'
import configureStore from '../store'

const RouterWithRedux = connect()(Router)
const store = configureStore()

const IconAnimated = Animated.createAnimatedComponent(Icon)

class TabIcon extends Component {
    static title2icon = {
        Practices: 'ios-basketball-outline',
        Exercises: 'ios-list-box-outline'
    }

    constructor(props) {
        super(props)
        this._scale = new Animated.Value(1)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selected === nextProps.selected) return
        if (nextProps.selected) {
            this.startSelectedAnimation()
        } else {
            this.startUnselectedAnimation()
        }
    }

    startSelectedAnimation() {
        this._scale.setValue(1)

        Animated.timing(this._scale, {
            duration: 300,
            easing: Easing.linear,
            toValue: 1.1
        }).start()
    }

    startUnselectedAnimation() {
        Animated.timing(this._scale, {
            duration: 300,
            easing: Easing.linear,
            toValue: 1
        }).start()
    }

    render() {
        const {selected, title} = this.props

        return (
            <View style={{alignItems: 'center'}}>
                <IconAnimated
                    style={{
                        color: '#75949A',
                        transform: [
                            {
                                scale: this._scale,
                            }
                        ]
                    }}
                    size={28}
                    name={TabIcon.title2icon[title]}
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
    }
}

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rehydrated: false
        }
    }

    componentWillMount() {
        persistStore(
            store,
            {storage: AsyncStorage},
            () => this.setState({rehydrated: true})
        )
    }

    render() {
        if (!this.state.rehydrated) return null

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
}
