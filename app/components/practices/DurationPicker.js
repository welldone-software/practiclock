//@flow
import React, {Component} from 'react'
import {
    Dimensions,
    Picker,
    StyleSheet,
    Text,
    View
} from 'react-native'
import ListView from '../../core/ListView'

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: width
    },
    title: {
        textAlign: 'center',
        fontSize: 10,
        fontWeight: '600',
        color: '#6C8993'
    },
    picker: {
        width: width/3
    },
    delimiter: {
        flexDirection: 'column',
        justifyContent: 'center'
    },
    symbol: {
        marginTop: 10,
        fontSize: 22,
        fontWeight: '600',
        color: '#6C8993'
    }
})

const minutes = [...Array(60).keys()] 
const seconds = [...Array(6).keys()].map(item => item*10) 

const convertMillisecondsToMinutesAndSeconds = (duration) => {
    const min = (duration/1000/60) << 0 || 0
    const sec = (duration/1000) % 60 || 0

    return {min, sec}
}

export default class DurationPicker extends Component {
    constructor(props) {
        super(props)
        this.state = convertMillisecondsToMinutesAndSeconds(props.current)
    }

    componentWillReceiveProps(nextProps) {
        this.setState(convertMillisecondsToMinutesAndSeconds(nextProps.current))
    }

    onChangeMinutes = (min) => {
        this.props.onChange(min*60*1000 + this.state.sec*1000)
    }

    onChangeSeconds = (sec) => {
        this.props.onChange(this.state.min*60*1000 + sec*1000)
    }

    render() {
        const {min, sec} = this.state
        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>MINUTES</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={min}
                        onValueChange={this.onChangeMinutes}
                        itemStyle={{color: '#4F5E69'}}
                        mode="dropdown"
                    >
                        {minutes.map(value => <Picker.Item label={value.toString()} value={value} key={value}/>)}
                    </Picker>
                </View>
                <View style={styles.delimiter}>
                    <Text style={styles.symbol}>:</Text>
                </View>
                <View>
                    <Text style={styles.title}>SECONDS</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={sec}
                        onValueChange={this.onChangeSeconds}
                        itemStyle={{color: '#4F5E69'}}
                        mode="dropdown"
                    >
                        {seconds.map(value => <Picker.Item label={value.toString()} value={value} key={value}/>)}
                    </Picker>
                </View>
            </View>
        )
    }
}