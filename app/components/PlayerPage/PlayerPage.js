//@flow
import Promise from 'es6-promise'
import React, {Component} from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Switch,
    Text
} from 'react-native'
import {connect} from 'react-redux'

import Icon from 'react-native-vector-icons/Ionicons'
import Sound from 'react-native-sound'
import SvgIndicator from './SvgIndicator'
import SoundListItem from './SoundListItem'

class PlayerPage extends Component {
    state = {isPlaying: false}

    sounds = null

    constructor(props) {
        super(props)

        let idx = props.id.indexOf('-');
        let type = props.id.substr(idx + 1)
        let id = props.id.substr(0, idx) - 0

        let items = props[type][type].find(item => item.id === id)
        if (type === 'practices') {
            items = [items]
        } else {
            items = Object.assign([], items.data).map(sup => props.practices.practices.find(item => item.id === sup.id))
        }

        console.log(items)
        this.soundPromises = Promise.all(items.map(item => ({
            duration: item.duration * item.repeat,
            realDuration: item.duration,
            repeat: item.repeat,
            file: item.sound.file,
            name: item.sound.name,
            title: item.title
        })).map(item => new Promise(resolve => {
            let s = new Sound(item.file, Sound.MAIN_BUNDLE, () => resolve({
                data: item, file: s
            }))
        })))
    }

    componentWillMount() {
        this.soundPromises.then((sounds) => {
            this.sounds = sounds
            this.sound = sounds[0];
            this.index = 0;
            this.setState({isLoaded: true}, setTimeout(() => {
                if (!this.state.isPlaying) {
                    this.onPlay()
                }
            }, 3000))
        })
    }

    componentWillUnmount() {
        this.setState({isPlaying: false})
        this.soundPromises.then((sounds) => sounds.forEach(sound => sound.release))
    }

    timeout = null;
    interval = null;
    startDate = null

    onPlay = () => {
        if (!this.duration) {
            this.duration = this.sound.data.duration
        }
        if (this.timeout) {
            clearTimeout(this.timeout)
            clearTimeout(this.interval)
        }
        this.startDate = Date.now();
        this.timeout = setTimeout(() => {
            this.duration = null
            this.startDate = null;
            this.time = null;
            clearInterval(this.interval)
            this.setState({isPlaying: false})
        }, this.duration)

        this.time = Date.now() - this.startDate + this.sound.data.duration - this.duration
        this.interval = setInterval(() => {
            this.time = Date.now() - this.startDate + this.sound.data.duration - this.duration
            this.forceUpdate()
        }, 500)

        this.setState({isPlaying: true}, this.infinityPlay)
    }

    onNext = () => this.next()
    onPrev = () => this.next(true)

    next(isPrev) {
        let idx = this.sounds.indexOf(this.sound) + (isPrev ? -1 : 1);
        if (idx > this.sounds.length - 1) {
            idx = 0;
        } else if (idx < 0) {
            idx = this.sounds.length;
        }

        this.playByIndex(idx)
    }

    playByIndex(idx) {
        if (this.index !== idx) {
            this.index = idx;
            this.duration = null;
            this.sound = this.sounds[this.index]
            this.onPlay()
        } else if (this.state.isPlaying) {
            this.onPause()
        } else {
            this.onPlay()
        }
    }

    infinityPlay = () => {
        this.sound.file.play(() => {
            if (this.state.isPlaying) {
                this.infinityPlay()
            } else if (!this.duration && this.state.isLoop) {
                this.onNext()
            }
        })
    }

    switchIsLoop = () => {
        let toLoop = !this.state.isLoop;
        this.setState({isLoop: toLoop})
        if (toLoop && !this.state.isPlaying) {
            this.onPlay()
        }
    }

    onPause = () => {
        this.duration = this.duration - (Date.now() - this.startDate)
        console.log(this.duration)
        clearTimeout(this.timeout)
        clearTimeout(this.interval)
        this.sound.file.stop()
        this.setState({isPlaying: false})
    }

    onStop = () => {
        this.time = 0
        this.onPause();
        this.duration = this.sound.data.duration;
        this.startDate = null;
        this.sound.file.stop();
    }

    formatTime(time) {
        // return Math.round(Math.round(time / 100) / 10).toFixed(1)
        return Math.round(time / 1000)
    }

    render() {
        if (!this.state.isLoaded) {
            return <View><Text>Loading...</Text></View>
        }
        let iconSize = 40
        return (<View style={{marginTop: 75, flex: 1, flexDirection: 'column', justifyContent: 'flex-start'}}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableOpacity onPress={this.onPrev}>
                    <Icon name='ios-skip-backward' size={iconSize} color='#24CB58'/>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.state.isPlaying ? this.onPause : this.onPlay}>
                    <Icon name={this.state.isPlaying ? 'ios-pause' : 'ios-play'} color='#24CB58' size={iconSize * 1.3}/>
                </TouchableOpacity>
                {this.startDate && <TouchableOpacity onPress={this.onStop} style={{marginTop: 5}}>
                    <Icon name='ios-square' size={iconSize} color='#24CB58'/>
                </TouchableOpacity>}
                <TouchableOpacity onPress={this.onNext}>
                    <Icon name='ios-skip-forward' size={iconSize} color='#24CB58'/>
                </TouchableOpacity>
            </View>
            <View style={{flex: 3}}>
                <Text style={{textAlign: 'center', marginTop: 25, marginBottom: 0, fontSize: 20}}>
                    {this.startDate ? this.formatTime(this.time) + 's / ' + this.formatTime(this.sound.data.duration) + 's' : ''}
                    {'     ' + this.sound.data.name}
                </Text>
                <SvgIndicator time={this.time/this.sound.data.duration}/>
            </View>

            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                {this.sounds.length > 1 && <View style={{flex: 1, paddingLeft: 30}}>
                    <Text style={{fontSize: 20}}>{this.index + 1}/{this.sounds.length}</Text>
                </View>}
                <View style={{flex: 2, flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 20}}>
                    <Text style={{fontSize: 20}}>auto </Text>
                    <Switch
                        onValueChange={this.switchIsLoop}
                        style={{marginBottom: 10}}
                        value={this.state.isLoop}/>
                </View>
            </View>

            <View style={{flex: 10}}>
                {this.sounds.map((s, index) => <SoundListItem
                    onPress={() => this.playByIndex(index)}
                    key={index}
                    title={s.data.title}
                    duration={this.formatTime(s.data.realDuration)}
                    repeat={s.data.repeat}
                    name={s.data.name}
                    toHighlight={index === this.index}
                />)}
            </View>
        </View>)
    }
}
export default connect(
    state => {
        const {exercises, practices} = state
        return {exercises, practices}
    }
)(PlayerPage)