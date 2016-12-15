//@flow
import React, {Component} from 'react'
import {
    Alert,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import ListView from '../../core/ListView'
import {exercises as actions} from '../../store/actions'
import Empty from './Empty'
import NoPractice from './NoPractice'
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

class ExerciseList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mounted: true,
            editMode: false,
            exercises: props.exercises,
            practices: props.practices
        }
    }

    componentDidMount() {
        const {exercises, practices} = this.props
        this.setState({mounted: false}, () => {
            this.refresh(
                !Boolean(exercises.length) || !Boolean(practices.length)
            )
        })
    }

    componentWillReceiveProps(nextProps) {
        const {exercises, practices, navigation} = nextProps

        if (navigation.sceneKey !== 'exerciseList') {
            this.setState({editMode: false})
        }

        this.setState({practices})
        const nextExercises = [...nextProps.exercises]
                                  .sort((a, b) => a.id - b.id)
        const currentExercises = [...this.props.exercises]
                                    .sort((a, b) => a.id - b.id)
        if (JSON.stringify(nextExercises) === JSON.stringify(currentExercises)) return
        if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
            this.setState({mounted: false, exercises}, () => {
                this.refresh(
                    !Boolean(exercises.length) || !Boolean(practices.length)
                )
            })
        }
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
            <TouchableOpacity onPress={() => Actions.exerciseCreate({id: null})}>
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
                        size={24}
                        style={styles.leftButton}
                    />
                }
            </TouchableOpacity>
        )
    }

    renderRow = ({data, active, swipe}) => {
        return (<Row
            {...data}
            practices={this.state.practices}
            active={active}
            onSwipe={this.onSwipe}
            onDelete={id => this.props.remove(id)}
            swipe={swipe}
        />)
    }

    onOrderChange = (exercises) => {
        this.setState({exercises}, () => this.props.order(exercises))
    }

    onDelete = id => {
        Alert.alert(
            'Remove this exercise?',
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
            exercises,
            practices,
            editMode
        } = this.state

        if (!mounted) return null
        if (!practices.length) return <NoPractice/>

        const data = Object.assign({}, exercises)

        return (
            <View style={styles.container}>
                <ListView
                    editMode={editMode}
                    mounted={mounted}
                    items={exercises}
                    emptyView={<Empty/>}
                    onOrderChange={this.onOrderChange}
                >
                    <Row onDelete={this.onDelete} practices={practices}/>
                </ListView>
            </View>
        )
    }
}

export default connect(
    state => {
        const {exercises, practices, navigation} = state
        const {sceneKey, parent} = navigation.scene
        return {
            exercises: exercises.exercises,
            practices: practices.practices,
            navigation: {sceneKey, parent}
        }
    },
    dispatch => bindActionCreators(actions, dispatch)
)(ExerciseList)
