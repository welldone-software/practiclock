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

const Row = (props) => {
    const swipeButtons = [
        {
            component: <FontAwesome name="edit" size={25} style={styles.button} />,
            color: '#157EFB',
            backgroundColor: 'blue',
            onPress: () => Actions.exerciseEdit({id: props.id})
        },
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
    static renderRightButton() {
        return (
            <TouchableOpacity onPress={Actions.exerciseCreate}>
                <Ionicons name="md-add" size={20} />
            </TouchableOpacity>
        )
    }

    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 || this.state.scrollEnabled
        })
        this.state = {
            dataSource: ds.cloneWithRows(this.props.exercises),
            scrollEnabled: true
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ dataSource: this.state.dataSource.cloneWithRows(nextProps.exercises) })
    }

    onSwipe = (id) => {
        this.setState({
            swipeActiveID: id,
            dataSource: this.state.dataSource.cloneWithRows(this.props.exercises)
        })
    }

    onScroll = (scrollEnabled) => {
        this.setState({scrollEnabled})
    }

    renderRow = (data) => {
        console.log(this.props)
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
    }
}

export default connect(
    state => state.exercises,
    dispatch => bindActionCreators(exercisesActions, dispatch)
)(ExerciseList)

