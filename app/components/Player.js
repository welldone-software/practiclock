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
import Sound from 'react-native-sound'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Types} from './Exercise'

class AudioFile {
    constructor(file = 'silence.mp3', callback, time) {
        this.time = time
        this.callback = callback
        this.file = new Sound(file, Sound.MAIN_BUNDLE, () => {
            this.duration = this.file.getDuration()*1000
        })
    }

    pause() {
        this.file.pause()
        this.duration -= new Date() - this.start
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
}

class Player {
    constructor(items = [], index = 0, callback = () => {}) {
        this.items = items
        this.index = index
        this.callback = callback
        this.play()
        this.pause()
    }

    play = () => {
        if (this.items.length <= this.index) {
            this.callback()
            return
        }

        const {duration, repeat = 1, sound} = this.items[this.index]
        const time = duration*repeat*60*1000
        this.index += 1
        this.current = new AudioFile(sound, this.play, time)
    }

    pause() {
        this.current.pause()
    }

    resume() {
        this.current.resume()
    }

    next() {
        this.index += 1
        this.play()
    }

    previous() {
        this.index -= 1
        this.play()
    }
}

const styles = StyleSheet.create({
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
    text: {
        marginLeft: 12,
        fontSize: 16,
    }
})

const Row = ({title, duration, repeat = 1, sound}) => {
    return (
        <View style={styles.row}>
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.duration}>{duration * repeat} min</Text>
        </View>
    )
}

class PlayerComponent extends Component {
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
            player: new Player(items, 0, () => this.setState({playInProgress: false})),
            dataSource: ds.cloneWithRows(items),
            title,
            items,
            playInProgress: false
        }
    }

    onPressTogglePlay = () => {
        const playInProgress = !this.state.playInProgress
        if (playInProgress) {
            this.state.player.resume()
        } else {
            this.state.player.pause()
        }
        this.setState({playInProgress})
    }

    render() {
        return (
            <View>
                <ListView
                    style={styles.list}
                    dataSource={this.state.dataSource}
                    renderRow={(data) => <Row {...data} />}
                    enderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator}/>}
                />
                <TouchableOpacity onPress={this.onPressTogglePlay}>
                    <Ionicons name={this.state.playInProgress ? 'md-pause' : 'md-play'} size={30}/>
                </TouchableOpacity>
            </View>
        )
    }
}

export default connect(
    state => {
        const {exercises, practices} = state
        return {exercises, practices}
    }
)(PlayerComponent)