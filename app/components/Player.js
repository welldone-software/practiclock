//@flow
import React, {Component, PropTypes} from 'react'
import {
    ListView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import Sound from 'react-native-sound'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Types} from './Exercise'

class Track {
    constructor(file = 'silence.mp3', callback, time) {
        this.time = time
        this.callback = callback
        this.file = new Sound(file, Sound.MAIN_BUNDLE, () => {
            this.duration = this.file.getDuration()*1000
        })
    }

    pause() {
        this.file.pause()
        this.time -= new Date() - this.start
    }

    resume() {
        this.start = new Date()
        let repeat = this.time ? Math.round(this.time/this.duration) : 1

        const play = () => {
            if (repeat) {
                repeat -= 1
                this.file.play(play)
            } else {
                this.callback()
            }
        }

        play()
    }
    
    stop() {
        this.file.stop()
    }
}

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#fff',
        borderBottomWidth: 0
    },
    navBarLeftButton: {
        marginTop: -2,
        paddingLeft: 10
    },
    navBarText: {
        fontSize: 18,
        marginVertical: 5,
        color: '#b51f23'
    },
    list: {
        marginTop: 64
    },
    row: {
        flex: 1,
        padding: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff'
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#eee',
    },
    title: {
        fontSize: 16
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20
    },
    button: {
        paddingLeft: 20,
        paddingRight: 20
    },
    closeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 12,
        left: 20
    },
    scene: {
        flex: 1,
        paddingTop: 20
    }
})

const Row = ({title, duration, repeat, sound, active, track}) => {
    return (
        <View style={styles.row}>
            <Text style={styles.title}>{title}</Text>
            {active &&
                <Ionicons name="md-musical-notes" size={18}/>
            }
        </View>
    )
}

class Player extends Component {
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const exercises = props.exercises.exercises
        const practices = props.practices.practices
        const {title, data} = props.exercises.exercises.find(exercise => exercise.id === props.id)
        const items = Object.values(data).map(item => {
            switch (item.type) {
                case Types.PRACTICE:
                    const {duration, repeat, sound, title} = practices.find(practice => practice.id === item.id)
                    return {
                        title,
                        duration,
                        repeat,
                        sound
                    }
                case Types.INTERVAL:
                    return {
                        title: 'Pause',
                        duration: item.value
                    }
            }
        })

        this.state = {
            dataSource: ds.cloneWithRows(items),
            title,
            items,
            playInProgress: false,
        }


        setTimeout(() => {
            Actions.refresh({
                title,
                navigationBarStyle: styles.navbar,
            })
            
            this.play()
        })
    }

    componentDidUpdate(prevProps, prevState) {
        const {items, index, dataSource} = this.state

        if (prevState.index === index) return

        const result = items.map((item, i) => {
            return {
                ...item,
                active: i === index,
                track: i === index ? this.state.track : null
            }
        })

        this.setState({
            items: result,
            dataSource: dataSource.cloneWithRows(result)
        })
    }

    componentWillUnmount() {
        this.stop()
    }

    play = () => {
        const {items, index = 0} = this.state
        if (items.length <= index) {
            this.setState({playInProgress: false, index: 0})
            return
        }

        const {duration, repeat = 1, sound} = items[index]
        const time = duration*repeat*60*1000
        const track = new Track(sound, this.next, time)
        setTimeout(() => this.setState({track, index}, this.resume), 500)
    }

    pause = () => {
        this.state.track.pause()
        this.setState({playInProgress: false})
    }

    stop = () => {
        this.state.track.stop()
    }

    resume = () => {
        this.state.track.resume()
        this.setState({playInProgress: true})
    }

    next = () => {
        this.stop()
        this.setState({index: this.state.index+1}, this.play)
    }

    previous = () => {
        this.stop()
        this.setState({index: this.state.index-1}, this.play)
    }

    onPressTogglePlay = () => {
        const playInProgress = !this.state.playInProgress

        if (playInProgress) {
            this.resume()
        } else {
            this.pause()
        }

        this.setState({playInProgress})
    }

    render() {
        const {
            items,
            index,
            dataSource,
            playInProgress
        } = this.state
        const isPreviousTrackButtonDisabled = index === 0 || !playInProgress
        const isNextTrackButtonDisabled = (items.length-1) <= index || !playInProgress

        return (
            <View style={styles.scene}>
                <ListView
                    style={styles.list}
                    dataSource={dataSource}
                    renderRow={(data) => <Row {...data}/>}
                    enderSeparator={(_, id) => <View key={id} style={styles.separator}/>}
                />
                <TouchableOpacity onPress={Actions.pop} style={styles.closeButton}>
                    <Ionicons name="md-close" size={40}/>
                </TouchableOpacity>
                <View style={styles.buttons}>
                    <TouchableOpacity 
                        onPress={isPreviousTrackButtonDisabled ? () => {} : this.previous}
                        style={styles.button}
                    >
                        <Ionicons 
                            name="md-skip-backward"
                            size={30}
                            style={isPreviousTrackButtonDisabled && { color: 'gray'}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onPressTogglePlay} style={styles.button}>
                        <Ionicons name={playInProgress ? 'md-pause' : 'md-play'} size={30}/>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={isNextTrackButtonDisabled ? () => {} : this.next}
                        style={styles.button}
                    >
                        <Ionicons
                            name="md-skip-forward"
                            size={30}
                            style={isNextTrackButtonDisabled && { color: 'gray'}}
                        />
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
)(Player)