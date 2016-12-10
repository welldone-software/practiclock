import {Text, View} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import React, {Component, PropTypes} from 'react'

export default class PlayerRow extends Component {
    constructor (props) {
        super(props)
        this.interval = null
    }

    _stopInterval () {
        if ( this.interval ) {
            clearInterval(this.interval)
            this.interval = null
        }
    }

    _startInterval () {
        if ( !this.interval ) {
            this.interval = setInterval(() => this._calculatePlayed(), 500)
        }
    }

    _calculatePlayed () {
        var played = Math.min((Date.now() - this.props.track.start) / this.props.track.time, 1)
        if (played === this.played || played === 1 ) { // pause or end
            this._stopInterval()
        }
        this.played = played
        this.forceUpdate()
    }

    componentWillUnmount () {
        this._stopInterval()
    }

    render () {
        const { title, sound, active, track } = this.props
        if ( active && track ) {
            this._startInterval()
            return (
                <View>
                    <View style={styles.row}>
                        <Text style={styles.title}>
                            {title} <Text style={{ color: '#ccc' }}> {sound}</Text>
                        </Text>
                        <Ionicons name="md-musical-notes" size={18}/>
                    </View>
                    <View style={styles.timeLineWrapper}>
                        <View style={{ backgroundColor: '#fc0', height: 5, flex: this.played }}/>
                        <View style={{ backgroundColor: '#ccc', height: 5, flex: 1 - this.played }}/>
                    </View>
                </View>
            )
        } else {
            this._stopInterval()
            return (
                <View style={styles.row}>
                    <Text style={styles.title}>{title}</Text>
                </View>
            )
        }
    }
}

const styles = {
    title: {
        fontSize: 16
    },
    row: {
        flex: 1,
        padding: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff'
    },
    timeLineWrapper: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 25,
        paddingRight: 25,
        marginTop: -20
    }
}