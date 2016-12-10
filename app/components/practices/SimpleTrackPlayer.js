//@flow
import React, {Component} from 'react'
import {
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const styles = StyleSheet.create({
    playerButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#24CB58',
        paddingLeft: 10,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4
    },
    playerIcon: {
        color: '#24CB58'
    }
})

export default class SimpleTrackPlayer extends Component {
    render() {
        let cb = this.props.isPlaying ? this.props.onPause : this.props.onPlay
        let icon = this.props.isPlaying ? 'ios-pause-outline' : 'ios-play-outline'
        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={cb} style={styles.playerButton}>
                    <Icon name={icon} size={20} style={styles.playerIcon}/>
                </TouchableOpacity>
            </View>
        )
    }
}