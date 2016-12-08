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

const SCREEN_WIDTH = Dimensions.get('window').width
export const SOUNDS = ['sound_1.mp3', 'sound_2.mp3', 'sound_3.mp3', 'sound_4.mp3']

const styles = StyleSheet.create({
    picker: {
        width: SCREEN_WIDTH
    }
})

export default class SoundPicker extends Component {
    state = {
        sound: null
    }

    constructor(props) {
        super(props)

        setTimeout(() => this.onChangeValue(props.current || SOUNDS[0]))
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
        this.props.onChange(value)
    }

    stop = () => {
        if (this.state.sound) this.state.sound.stop()
    }

    render() {
        const {current, items} = this.props
        return (
            <Picker
                style={styles.picker}
                selectedValue={current}
                onValueChange={this.onChangeValue}
                itemStyle={{color: '#4F5E69'}}
                mode="dropdown"
            >
                {items.map(item => <Picker.Item label={item} value={item} key={item} />)}
            </Picker>
        )
    }
}