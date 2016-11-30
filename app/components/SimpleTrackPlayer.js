//@flow
import React, { Component } from 'react'
import { View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PseudoSyncSound from './PseudoSyncSound'

export default class SimpleTrackPlayer extends Component {
    static CollectionCallback = (array, context) => {
        array.forEach(item => item.onPlay = item => {
            array.forEach(() => item.isPlaying = false)
            console.log(array)
            item.isPlaying = true;
            context.forceUpdate()
        })
    }

    constructor (props) {
        super(props)
        this.state = {isPlaying: props.file.isPlaying}
        this.file = new PseudoSyncSound(this.props.file.sound, this.setAsNotPlaying);
    }

    componentWillReceiveProps (nextProps) {
        if ( this.state.isPlaying !== nextProps.file.isPlaying ) {
            if ( nextProps.isPlaying ) {
                this.start();
            } else {
                this.setAsNotPlaying();
                this.file.stop();
            }
        }
    }

    setAsNotPlaying = () => this.setState({isPlaying: false})

    play = () => {
        if ( !this.state.isPlaying ) {
            this.setState({isPlaying: true})
            this.file.play();
            this.props.onPlay(this.props.file);
        }
    }

    pause = () => {
        if ( this.state.isPlaying ) {
            this.setAsNotPlaying();
            this.file.pause();
        }
    }

    componentWillUnmount () {
        this.file.stop();
    }

    render () {
        return (
            <View style={{position: 'absolute', right: 20}}>
                {!this.state.isPlaying && <Ionicons name="md-play" size={20} onPress={this.play.bind(this)}/>}
                {this.state.isPlaying && <Ionicons name="md-pause" size={20} onPress={this.pause.bind(this)}/>}
            </View>
        )
    }
}