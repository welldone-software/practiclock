//@flow
import React, {Component} from 'react'
import {
    Dimensions,
    Picker,
    StyleSheet,
    View
} from 'react-native'
import Sound from 'react-native-sound'
import ListView from '../../core/ListView'

const width = Dimensions.get('window').width

export const SOUNDS = [{
    name: 'Chime Rhythm',
    file: 'burnttoys_chime.mp3'
},
{
    name: 'Spanner Chime Damped Soft 4',
    file: 'spanner_chime_damped_soft_4.mp3'
},
{
    name: 'Fisher Price',
    file: 'fisher_price.mp3'
},
{
    name: 'Finger Cymbals Crash Choke',
    file: 'finger_cymbals_crash_choke.mp3'
},
{
    name: 'Ceramic Bell',
    file: 'ceramic_bell.mp3'
}]

const styles = StyleSheet.create({
    picker: {
        width: width

    }
})

export default class SoundPicker extends Component {
    state = {
        sound: null
    }

    constructor(props) {
        super(props)

        setTimeout(() => this.onChangeValue((props.current || SOUNDS[0]).file))
    }
    
    componentWillUnmount() {
        this.stop()
    }

    onChangeValue = (value) => {
        this.stop()
        const sound = new Sound(value, Sound.MAIN_BUNDLE, error => {
            if (!error) sound.play()
        })
        this.setState({sound})
        this.props.onChange(SOUNDS.find(sound => sound.file === value))
    }

    stop = () => {
        if (this.state.sound) this.state.sound.stop()
    }

    render() {
        const {current} = this.props

        return (
            <Picker
                style={styles.picker}
                selectedValue={current.file}
                onValueChange={this.onChangeValue}
                itemStyle={{color: '#4F5E69'}}
                mode="dropdown"
            >
                {SOUNDS.map((sound, index) => <Picker.Item label={sound.name} value={sound.file} key={index}/>)}
            </Picker>
        )
    }
}