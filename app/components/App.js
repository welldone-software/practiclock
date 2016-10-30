//@flow
import React, {PropTypes as T} from 'react'
import {Text, View} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Router, Scene, Actions} from 'react-native-router-flux'
import { connect, Provider } from 'react-redux'
import SoundList from './SoundList'
import configureStore from '../store'
import {practices} from '../store/actions'

const RouterWithRedux = connect()(Router)
const store = configureStore()

const PracticeList = () => (
  <View style={{margin: 128}}>
    <Text>PracticeList</Text>
    <Text onPress={() => Actions.practiceItem({id: 132})}>PracticeItem 1</Text>
  </View>
)

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


// const SoundList = () => (
//   <View style={{margin: 128}}>
//     <Text>SoundList</Text>
//     <Text onPress={() => Actions.soundItem({id: 1})}>SoundItem 1</Text>
//   </View>
// )

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

const Plus = () => <Ionicons name="md-add" size={20} />

export default () => {
  return (
    <Provider store={store}>
        <RouterWithRedux>
            <Scene key="root">
                <Scene key="tabbar" tabs tabBarStyle={{backgroundColor: 'white'}}>
                    <Scene key="sounds" title="Sounds" icon={TabIcon}>
                        <Scene key="soundList" component={SoundList} title="Sounds" renderRightButton={Plus} onRight={() => { console.log('clicked ')}}/>
                        <Scene key="soundItem" component={SoundItem} title="soundItem"/>
                    </Scene>
                    <Scene key="practices" title="Practices" icon={TabIcon}>
                        <Scene key="practiceList" component={PracticeList} title="Practices" renderRightButton={Plus} onRight={() => { console.log('clicked ')}}/>
                        <Scene key="practiceItem" component={PracticeItem} title="PracticeItem"/>
                    </Scene>
                    <Scene key="sequences" title="Sequences" icon={TabIcon}>
                        <Scene key="sequenceList" component={SequenceList} title="Sequences" renderRightButton={Plus} onRight={() => { console.log('clicked ')}}/>
                        <Scene key="sequenceItem" component={SequenceItem} title="SequenceItem"/>
                    </Scene>
                </Scene>
            </Scene>
        </RouterWithRedux>
    </Provider>
)
}