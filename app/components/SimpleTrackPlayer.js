//@flow
import React, { Component } from 'react'
import { 
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import PseudoSyncSound from './PseudoSyncSound'

const styles = StyleSheet.create({
    button: {
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
    icon: {
        color: '#24CB58'
    }
})

export default class SimpleTrackPlayer extends Component {
    // TODO: REMOVE THIS PART OF CODE
    static CollectionCallback = (array, context) => {
        array.forEach(item => item.onPlay = item => {
            array.forEach((item) => item.isPlaying = false)
            item.isPlaying = true
            context.forceUpdate()
        })
    }

    constructor (props) {
        super(props)
        this.state = {isPlaying: props.file.isPlaying}
        this.file = new PseudoSyncSound(this.props.file.sound, this.setAsNotPlaying)
    }

    componentWillReceiveProps (nextProps) {
        if ( this.state.isPlaying !== nextProps.file.isPlaying ) {
            if ( nextProps.isPlaying ) {
                this.file.play()
            } else {
                this.setAsNotPlaying()
                this.file.stop()
            }
        }
    }


    setAsNotPlaying = () => this.setState({isPlaying: false})

    play = () => {
        if (this.state.isPlaying) return
        this.setState({isPlaying: true})
        this.file.play()
        this.props.onPlay(this.props.file)
    }

    pause = () => {
        if (!this.state.isPlaying) return
        this.setAsNotPlaying()
        this.file.pause()
    }

    componentWillUnmount () {
        this.file.stop()
    }

    render () {
        return (
            <View style={this.props.style}>
                {!this.state.isPlaying && 
                    <TouchableOpacity onPress={this.play.bind(this)} style={styles.button}>
                        <Icon name="ios-play-outline" size={20} style={styles.icon}/>
                    </TouchableOpacity>
                }
                {this.state.isPlaying && 
                    <TouchableOpacity onPress={this.pause.bind(this)} style={styles.button}>
                        <Icon name="ios-pause-outline" size={20} style={styles.icon}/>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}