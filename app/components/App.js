//@flow

'use strict'

import React, {PropTypes as T} from 'react'
import {Text, View} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import {Router, Scene, Actions} from 'react-native-router-flux';

const PracticeList = () => (
  <View style={{margin: 128}}>
    <Text>PracticeList</Text>
    <Text onPress={() => Actions.practiceItem({id: 132})}>PracticeItem 1</Text>
  </View>
)

const PracticeItem = ({id}) => (
  <View style={{margin: 128}}>
    <Text>PracticeItem {id}</Text>
    <Text onPress={Actions.practiceList}>back</Text>
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
    <Text onPress={Actions.sequenceList}>back</Text>
  </View>
)


// const SoundList = () => (
//   <View style={{margin: 128}}>
//     <Text>SoundList</Text>
//     <Text onPress={() => Actions.soundItem({id: 1})}>SoundItem 1</Text>
//   </View>
// )

import SoundList from './SoundList'

const SoundItem = ({id}) => (
  <View style={{margin: 128}}>
    <Text>SoundItem {id}</Text>
    <Text onPress={Actions.soundList}>back</Text>
  </View>
)



// const TabIcon = ({ selected, title }) => {
//   return (
//     <Text style={{color: selected ? 'red' :'black'}}>{title}</Text>
//   );
// }
const title2icon = {
  Practices:  'ios-alarm-outline',
  Sequences: 'ios-albums-outline',
  Sounds: 'ios-musical-notes'
}


const TabIcon = ({ selected, title }) => (
  <View style={{alignItems: 'center'}}>
    <Ionicons style={{color: selected? 'red' : 'black'}} name={title2icon[title] || 'logo-apple'}/>
    <Text style={{fontSize: 6, color: selected? 'red' : 'black'}}>{title}</Text>
  </View>
)

const plus = () => <Ionicons name="md-add" size={20}/>

export default () => (
  <Router>
    <Scene key="root">
      <Scene key="tabbar" tabs tabBarStyle={{backgroundColor: 'white'}}>
        <Scene key="practices" title="Practices" icon={TabIcon}>
          <Scene key="practiceList" component={PracticeList} title="Practices" renderRightButton={plus} onRight={() => { onsole.log('clicked ')}}/>
          <Scene key="practiceItem" component={PracticeItem} title="PracticeItem"/>
      </Scene>
      <Scene key="sequences" title="Sequences" icon={TabIcon}>
        <Scene key="sequenceList" component={SequenceList} title="Sequences" renderRightButton={plus} onRight={() => { onsole.log('clicked ')}}/>
        <Scene key="sequenceItem" component={SequenceItem} title="SequenceItem"/>
      </Scene>
        <Scene key="sounds" title="Sounds" icon={TabIcon}>
          <Scene key="soundList" component={SoundList} title="Sounds" renderRightButton={plus} onRight={() => { onsole.log('clicked ')}}/>
          <Scene key="soundItem" component={SoundItem} title="soundItem"/>
        </Scene>
      </Scene>
    </Scene>
  </Router>
)
