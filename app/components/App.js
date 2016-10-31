//@flow
import React, {PropTypes as T, Component} from 'react'
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
    ActionConst,
    Modal
} from 'react-native-router-flux'
import { connect, Provider } from 'react-redux'
import SoundList from './SoundList'
import PracticeCreate from './PracticeCreate'
import configureStore from '../store'
import {practices} from '../store/actions'

const RouterWithRedux = connect()(Router)
const store = configureStore()

const Plus = () => <Ionicons name="md-add" size={20} />

class PracticeList extends Component {    
    static renderRightButton() {
        return <TouchableOpacity onPress={Actions.practiceCreate}><Plus /></TouchableOpacity>
    }

    render() {
        return (
                <View style={{margin: 128}}>
                      <Text>PracticeList</Text>
                      <Text onPress={() => Actions.practiceItem({id: 132})}>PracticeItem 1</Text>
                </View>
              )
    }
}

const PracticeItem = ({id}) => (
  <View style={{margin: 128}}>
    <Text>PracticeItem {id}</Text>
    <Text onPress={Actions.pop}>back</Text>
  </View>
)

const SequenceList = () => (
  <View style={{margin: 128}}>
    <Text>SequenceList</Text>
    <Text onPress={() => Actions.sequenceItem({id: 111})}>SequenceItem 1</Text>
  </View>
)

const SequenceItem = ({id}) => (
  <View style={{margin: 128}}>
    <Text>SequenceItem {id}</Text>
    <Text onPress={Actions.pop}>back</Text>
  </View>
)

const SoundItem = ({id}) => (
  <View style={{margin: 128}}>
    <Text>SoundItem {id}</Text>
    <Text onPress={Actions.pop}>back</Text>
  </View>
)

const title2icon = {
  Practices:  'ios-alarm-outline',
  Sequences: 'ios-albums-outline',
  Sounds: 'ios-musical-notes'
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
                    <Scene key="sounds" title="Sounds" icon={TabIcon}>
                        <Scene key="soundList" component={SoundList} title="Sounds" renderRightButton={Plus} onRight={() => { console.log('clicked ')}}/>
                        <Scene key="soundItem" component={SoundItem} title="soundItem"/>
                    </Scene>
                    <Scene key="practices" title="Practices" icon={TabIcon}>
                        <Scene key="practiceList" component={PracticeList} title="Practices"/>
                        <Scene key="practiceItem" component={PracticeItem} title="PracticeItem"/>
                    </Scene>
                    <Scene key="sequences" title="Sequences" icon={TabIcon}>
                        <Scene key="sequenceList" component={SequenceList} title="Sequences" renderRightButton={Plus} onRight={() => { console.log('clicked ')}}/>
                        <Scene key="sequenceItem" component={SequenceItem} title="SequenceItem"/>
                    </Scene>
                </Scene>
                <Scene key="practiceCreate" direction="vertical">
                    <Scene key="practiceNew" component={PracticeCreate} title="New Practice" hideTabBar />
                </Scene>
            </Scene>
            </Scene>
        </RouterWithRedux>
    </Provider>
)
}