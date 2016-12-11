//@flow
import React, {Component} from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import {practices as actions} from '../../store/actions'
import ListView from '../../core/ListView'
import Empty from './Empty'
import Row from './Row'
import MediaLibrary from '../MediaLibrary'

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#fff',
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOpacity: 1,
        shadowOffset: {
            height: 1,
            width: 1
        },
        borderBottomWidth: 0
    },
    title: {
        color: '#6C8993',
        fontWeight: '500'
    },
    rightButton: {
        marginTop: -4,
        color: '#6C8993'
    },
    leftButton: {
        marginTop: 2,
        color: '#6C8993'
    },
    closeButton: {
        marginTop: -1,
        marginLeft: 3
    }
})

class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mounted: true,
            practices: props.practices,
            editMode: false
        }
    }

    componentDidMount() {
        this.setState({mounted: false}, () => {
            this.refresh(!Boolean(this.props.practices.length))
            this.setState({mounted: true})
        })
    }

    componentWillReceiveProps(nextProps) {
        const {practices, navigation} = nextProps

        if (navigation.sceneKey !== 'practiceList') {
            this.setState({editMode: false})
            return
        }

        const nextPractices = [...practices]
                                .sort((a, b) => a.id - b.id)
        const currentPractices = [...this.props.practices]
                                    .sort((a, b) => a.id - b.id)
        if (JSON.stringify(nextPractices) === JSON.stringify(currentPractices)) return
        this.setState({mounted: false, practices}, () => {
            this.refresh(!Boolean(practices.length))
            this.setState({mounted: true})
        })
    }

    refresh = (hideNavBar = false) => {
        Actions.refresh({
            renderRightButton: this.renderRightButton,
            renderLeftButton: this.renderLeftButton,
            navigationBarStyle: styles.navbar,
            titleStyle: styles.title,
            hideNavBar
        })
    }

    onLeftButtonTouch = () => {
        this.setState({editMode: !this.state.editMode})
    }

    renderRightButton = () => {
        const {editMode} = this.state
        if (editMode) return null
        return (
            <TouchableOpacity onPress={Actions.practiceCreate}>
                <Icon
                    name="ios-add-outline"
                    size={30}
                    style={styles.rightButton}
                />
            </TouchableOpacity>
        )
    }

    renderLeftButton = () => {
        const {editMode} = this.state
        return (
            <TouchableOpacity onPress={this.onLeftButtonTouch}>
                {editMode &&
                    <Icon
                        name="ios-close-outline"
                        size={30}
                        style={[styles.leftButton, styles.closeButton]}
                    />
                }
                {!editMode &&
                    <Icon
                        name="ios-settings-outline"
                        size={24} style={styles.leftButton}
                    />
                }
            </TouchableOpacity>
        )
    }

    onOrderChange = practices => {
        this.setState({practices}, () => this.props.order(practices))
    }

    onDelete = id => this.props.remove(id + 1)
    onPlayFn = (id, repeat) => {
        return MediaLibrary.play(id, this.refresh, repeat).then(this.refresh)
    }
    onPause = () => MediaLibrary.stop().then(this.refresh)
    isPlayingFn = name => MediaLibrary.isPlaying(name)

    render() {
        const {
            mounted,
            practices,
            editMode
        } = this.state

        return (
            <ListView
                editMode={editMode}
                mounted={mounted}
                items={practices}
                emptyView={<Empty/>}
                onOrderChange={this.onOrderChange}
            >
                <Row onDelete={this.onDelete}
                     isPlayingFn={this.isPlayingFn}
                     onPlayFn={this.onPlayFn}
                     onPause={this.onPause}/>
            </ListView>
        )
    }
}

export default connect(
    state => {
        const {practices, navigation} = state
        return {
            practices: practices.practices,
            navigation: navigation.scene
        }
    },
    dispatch => bindActionCreators(actions, dispatch)
)(List)
