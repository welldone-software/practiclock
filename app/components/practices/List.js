//@flow
import React, {Component} from 'react'
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import {practices as actions} from '../../store/actions'
import SimpleTrackPlayer from '../SimpleTrackPlayer'
import ListView from '../../core/ListView'
import Empty from './Empty'
import Row from './Row'

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
    constructor (props) {
        super(props)
        this.state = {
            mounted: false,
            practices: props.practices,
            editMode: false
        }
    }

    componentDidMount() {
        this.refresh()
    }

    componentWillReceiveProps(nextProps) {
        SimpleTrackPlayer.CollectionCallback(nextProps.practices, this)
        const nextPractices = [...nextProps.practices].sort((a,b) => a.id-b.id)
        const currentPractices = [...this.props.practices].sort((a,b) => a.id-b.id)
        if (JSON.stringify(nextPractices) === JSON.stringify(currentPractices)) return
        this.setState({mounted: false, practices: nextProps.practices}, () => {
            Actions.refresh({
                renderRightButton: this.renderRightButton,
                renderLeftButton: this.renderLeftButton,
                navigationBarStyle: styles.navbar,
                titleStyle: styles.title,
                hideNavBar: !Boolean(nextProps.practices.length)
            })
            this.setState({mounted: true})
        })
    }

    refresh = () => {
        Actions.refresh({
            renderRightButton: this.renderRightButton,
            renderLeftButton: this.renderLeftButton,
            navigationBarStyle: styles.navbar,
            titleStyle: styles.title,
            hideNavBar: !Boolean(this.props.practices.length)
        })
    }

    onLeftButtonTouch = () => {
        this.setState({editMode: !this.state.editMode})
        this.refresh()
    }

    renderRightButton = () => {
        const {editMode} = this.state
        if (editMode) return null
        return (
            <TouchableOpacity onPress={Actions.practiceCreate}>
                <Icon name="ios-add-outline" size={30} style={styles.rightButton}/>
            </TouchableOpacity>
        )
    }

    renderLeftButton = () => {
        const {editMode} = this.state
        return (
            <TouchableOpacity onPress={this.onLeftButtonTouch}>
                {editMode &&
                    <Icon name="ios-close-outline" size={30} style={[styles.leftButton, styles.closeButton]}/>
                }
                {!editMode &&
                    <Icon name="ios-settings-outline" size={24} style={styles.leftButton}/>
                }
            </TouchableOpacity>
        )
    }

    onOrderChange = (practices) => {
        this.setState({practices}, () => this.props.order(practices))
    }

    onDelete = (id) => this.props.remove(id)

    render () {
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
                <Row onDelete={this.onDelete}/>
            </ListView>
        )
    }
}

export default connect(
    state => state.practices,
    dispatch => bindActionCreators(actions, dispatch)
)(List)
