//@flow
import React, {Component} from 'react'
import {
    ListView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SwipeOut from 'react-native-swipeout'
import {exercises as exercisesActions} from '../store/actions'

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#34b6f2',
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: {
            height: 4, 
            width: 2
        },
        borderBottomWidth: 0
    },
    title: {
        color: '#0c5999'
    },
    buttonCreate: {
        color: '#0c5999'
    },
    list: {
        marginTop: 64
    },
    row: {
        flex: 1,
        padding: 25,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    text: {
        marginLeft: 12,
        fontSize: 16,
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#eee',
    },
    button: {
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 26,
        paddingRight: 26,
        color: '#FFF'
    }
})

const NoPracticeScreen = (props) => {
    const styles = StyleSheet.create({
         scene: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#eee'
        },
        text: {
            marginTop: 20,
            color: '#6d6d6d',
            fontSize: 10
        }
    })

    return (
        <View style={styles.scene}>
            <Text style={styles.text}>PLEASE CREATE AT LEAST ONE PRACTICE FIRST</Text>
        </View>
    )
}

const Empty = (props) => {
    const styles = StyleSheet.create({
         scene: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#eee'
        },
        button: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            maxHeight: 80,
            borderRadius: 40,
            backgroundColor: '#fff',
            shadowColor: 'rgba(0,0,0,0.2)',
            shadowOpacity: 1,
            shadowOffset: {
                height: 2, 
                width: 0
            },
            shadowRadius: 5 
        },
        icon: {
            color: '#6d6d6d'
        },
        text: {
            marginTop: 20,
            color: '#6d6d6d',
            fontSize: 10
        }
    })

    return (
        <View style={styles.scene}>
            <TouchableOpacity onPress={Actions.exerciseCreate} style={styles.button}>
                <Ionicons name="md-add" size={34} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.text}>CREATE YOUR FIRST EXERCISE</Text>
        </View>
    )
}

const Row = (props) => {
    const swipeButtons = [
        {
            component: <FontAwesome name="trash" size={25} style={styles.button} />,
            color: '#FC3D39',
            backgroundColor: 'red',
            onPress: () => props.onDeleteButtonPress(props.id)
        }
    ]

    return (
        <SwipeOut
            right={swipeButtons}
            autoClose
            backgroundColor="#FFF"
            onOpen={props.onSwipe.bind(props, props.id)}
            close={props.close}
            scroll={props.onScroll}
        >
            <TouchableHighlight onPress={() => Actions.exerciseView({id: props.id})}>
                <View style={styles.row}>
                    <Text style={styles.text}>
                        {props.title}
                    </Text>
                </View>
            </TouchableHighlight>
        </SwipeOut>
    )
}

class ExerciseList extends Component {
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 || this.state.scrollEnabled
        })
        this.state = {
            dataSource: ds.cloneWithRows(this.props.exercises.exercises),
            scrollEnabled: true
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({dataSource: this.state.dataSource.cloneWithRows(nextProps.exercises.exercises)})
        if (nextProps.exercises.exercises !== this.props.exercises.exercises || nextProps.from !== null) {
            Actions.refresh({
                renderRightButton: this.renderRightButton,
                navigationBarStyle: styles.navbar,
                titleStyle: styles.title,
                hideNavBar: !Boolean(nextProps.exercises.exercises.length)
            })
        }
    }

    componentDidMount() {
        Actions.refresh({
            renderRightButton: this.renderRightButton,
            navigationBarStyle: styles.navbar,
            titleStyle: styles.title,
            hideNavBar: !Boolean(this.props.exercises.exercises.length)
        })
    }

    renderRightButton = () => {
        if (this.props.exercises.exercises.length) {
            return (
                <TouchableOpacity onPress={Actions.exerciseCreate}>
                    <Ionicons name="md-add" size={20} style={styles.buttonCreate} />
                </TouchableOpacity>
            )
        } else {
            return null
        }
    }

    onSwipe = (id) => {
        this.setState({
            swipeActiveID: id,
            dataSource: this.state.dataSource.cloneWithRows(this.props.exercises.exercises)
        })
    }

    onScroll = (scrollEnabled) => {
        this.setState({scrollEnabled})
    }

    renderRow = (data) => {
        return (
            <Row {...data}
                 onSwipe={this.onSwipe}
                 onScroll={this.onScroll}
                 onDeleteButtonPress={id => this.props.remove(id)}
                 close={this.state.swipeActiveID !== data.id}
            />
        )
    }

    renderSeparator = (sectionId, rowId) => <View key={rowId} style={styles.separator} />

    render() {
        const {
            dataSource,
            scrollEnabled
        } = this.state

        if (!this.props.practices.practices.length) {
            return <NoPracticeScreen />
        }

        if (this.props.exercises.exercises.length) {
            return (
                <ListView
                    style={styles.list}
                    dataSource={dataSource}
                    scrollEnabled={scrollEnabled}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    enableEmptySections
                />
            )
        } else {
            return <Empty />
        }
    }
}

export default connect(
    state => {
        const {exercises, practices} = state
        return {exercises, practices}
    },
    dispatch => bindActionCreators(exercisesActions, dispatch)
)(ExerciseList)

