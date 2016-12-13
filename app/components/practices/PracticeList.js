//@flow
import React, {Component} from 'react'
import {
    Alert,
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
    container: {
        flex: 1,
        alignItems: 'flex-start',
        marginBottom: 50
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
        })
    }

    componentWillReceiveProps(nextProps) {
        const {practices, navigation} = nextProps

        if (navigation.sceneKey !== 'practiceList') {
            this.setState({editMode: false})
        }

        const nextPractices = [...practices]
                                .sort((a, b) => a.id - b.id)
        const currentPractices = [...this.props.practices]
                                    .sort((a, b) => a.id - b.id)

        if (JSON.stringify(nextPractices) === JSON.stringify(currentPractices)) return
        this.setState({mounted: false, practices}, () => {
            this.refresh(!Boolean(practices.length))
        })
    }

    refresh = (hideNavBar = false) => {
        setTimeout(() => {
            Actions.refresh({
                renderRightButton: this.renderRightButton,
                renderLeftButton: this.renderLeftButton,
                navigationBarStyle: StyleSheet.flatten([styles.navbar, {opacity: hideNavBar ? 0 : 1}]),
                titleStyle: styles.title,
                hideNavBar: false
            })
            this.setState({mounted: true})
        })
    }

    onLeftButtonTouch = () => {
        this.setState({editMode: !this.state.editMode}, () => {
            this.refresh(!Boolean(this.props.practices.length))
        })
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

    onDelete = id => {
        Alert.alert(
            'Remove this practice?',
            null,
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        this.props.remove(id)
                    }
                },
                {
                    text: 'No',
                    onPress: () => {}
                }
            ]
        )
    }

    render() {
        const {
            mounted,
            practices,
            editMode
        } = this.state

        return (
            <View style={styles.container}>
                <ListView
                    editMode={editMode}
                    mounted={mounted}
                    items={practices}
                    emptyView={<Empty/>}
                    onOrderChange={this.onOrderChange}
                >
                    <Row onDelete={this.onDelete}/>
                </ListView>
            </View>
        )
    }
}

export default connect(
    state => {
        const {practices, navigation} = state
        const {sceneKey, parent} = navigation.scene
        return {
            practices: practices.practices,
            navigation: {sceneKey, parent}
        }
    },
    dispatch => bindActionCreators(actions, dispatch)
)(List)
