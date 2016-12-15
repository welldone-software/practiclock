//@flow
import Promise from 'es6-promise'
import React, {Component} from 'react'
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import Sound from 'react-native-sound'
import SoundListItem from './SoundListItem'

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
    scene: {
        marginTop: 64,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    navbar: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EFF0F0'
    },
    title: {
        color: '#6C8993',
        fontWeight: '500'
    },
    close: {
        marginTop: -1,
        marginLeft: 3,
        color: '#6C8993'
    },
    buttons: {
        position: 'absolute',
        width,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5'
    },
    button: {
        width: width / 2.5,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    play: {
        position: 'absolute',
        left: width / 2 - 75,
        bottom: -75,
        width: 150,
        height: 150,
        paddingTop: 10,
        borderRadius: 75,
        borderColor: '#eee',
        borderWidth: 1,
        backgroundColor: '#fff'
    }
})

class PlayerPage extends Component {
    state = {
        isPlaying: false,
        isLoop: true
    }
    sounds = null

    renderLeftButton = () => {
        return (
            <TouchableOpacity onPress={Actions.pop}>
                <Icon
                    name="ios-close-outline"
                    size={30}
                    style={styles.close}
                />
            </TouchableOpacity>
        )
    }

    constructor(props) {
        super(props)

        let idx = props.id.indexOf('-');
        let type = props.id.substr(idx + 1)
        let id = props.id.substr(0, idx) - 0

        let items = props[type][type].find(item => item.id === id)
        if (type === 'practices') {
            items = [items]
        } else {
            items = Object.assign([], items.data).map(sup => {
                return props.practices.practices.find(item => item.id === sup.id) || {
                    duration: sup.value,
                    isPause: true,
                    repeat: 1,
                    sound: {
                        file: '', // TODO(George): please add proper silence mp3 in here
                        name: 'silence'
                    },
                    title: 'pause'
                }
            })
        }

        this.soundPromises = Promise.all(items.map(item => ({
            duration: item.duration * item.repeat,
            realDuration: item.duration,
            repeat: item.repeat,
            file: item.sound.file,
            name: item.sound.name,
            title: item.title
        })).map(item => new Promise(resolve => {
            const s = new Sound(item.file, Sound.MAIN_BUNDLE, () => resolve({
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

        Actions.refresh({
            renderLeftButton: this.renderLeftButton,
            navigationBarStyle: styles.navbar,
            titleStyle: styles.title
        })
    }

    componentWillUnmount() {
        this.setState({isPlaying: false})
        clearInterval(this.interval)
        clearTimeout(this.timeout)
        this.onStop()
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
            clearInterval(this.interval)
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
        let idx = this.sounds.indexOf(this.sound) + (isPrev ? -1 : 1)
        if (idx > this.sounds.length - 1 || idx < 0) return
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
            console.log(this.duration, this.state.isLoop)
            if (this.state.isPlaying) {
                this.infinityPlay()
            } else if (!this.duration && this.state.isLoop) {
                this.onNext()
            }
        })
    }

    // switchIsLoop = () => {
    //     let toLoop = !this.state.isLoop;
    //     this.setState({isLoop: toLoop})
    //     if (toLoop && !this.state.isPlaying) {
    //         this.onPlay()
    //     }
    // }

    onPause = () => {
        this.duration = this.duration - (Date.now() - this.startDate)
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

    formatTime = time => Math.round(time / 1000)

    render() {
        if (!this.state.isLoaded) return <View><Text>Loading...</Text></View>

        return (
            <View style={styles.scene}>
                <ScrollView style={{flex: 10, marginBottom: 50}}>
                    {this.sounds.map((s, index) => <SoundListItem
                        onPress={() => this.playByIndex(index)}
                        key={index}
                        title={s.data.title}
                        duration={this.formatTime(s.data.realDuration)}
                        repeat={s.data.repeat}
                        name={s.data.name}
                        active={index === this.index}
                        percent={this.time/this.duration}
                        remain={this.formatTime(this.time - this.duration)}
                    />)}
                </ScrollView>
                <View style={styles.buttons}>
                    <TouchableOpacity onPress={this.onPrev} style={styles.button}>
                        <Icon name='ios-skip-backward' size={28} color='#6C8993'/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.state.isPlaying ? this.onPause : this.onPlay}
                        style={[styles.button, styles.play, this.state.isPlaying ? {} : {paddingLeft: 10}]}
                        activeOpacity={1}
                    >
                        <Icon
                            name={this.state.isPlaying ? 'ios-pause' : 'ios-play'}
                            color='#6C8993'
                            size={56}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onNext} style={styles.button}>
                        <Icon name='ios-skip-forward' size={28} color='#6C8993'/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
export default connect(
    state => {
        const {exercises, practices} = state
        return {exercises, practices}
    }
)(PlayerPage)
