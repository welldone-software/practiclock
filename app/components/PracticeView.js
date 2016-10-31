//@flow
import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {practices as practicesActions} from '../store/actions'

class PracticeView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...props.practices.find(item => item.id === props.id)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({...nextProps.practices.find(item => item.id === nextProps.id)})
    }

    componentDidMount() {
        Actions.refresh({renderRightButton: this.renderRightButton})
    }

    onEdit = () => {
        Actions.practiceEdit({id: this.state.id})
    }

    renderRightButton = () => {
        return (
            <TouchableOpacity style={styles.navBarRightButton} onPress={this.onEdit}>
                <Text style={styles.navBarText}>Edit</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {duration, title, repeat} = this.state
        return (
            <View style={styles.scene}>
                <Text style={[styles.title, styles.section]}>{title}</Text>
                <Text style={[styles.label, styles.section]}>Duration {duration === 60 ? '1h' : duration + 'min'}</Text>
                <Text style={[styles.label, styles.section]}>Repeat: {repeat}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        marginTop: 60,
        padding: 10
    },
    section: {
        marginBottom: 20
    },
    title: {
        fontSize: 26
    },
    label: {
        fontSize: 18
    }
})

export default connect(
    state => state.practices,
    dispatch => bindActionCreators(practicesActions, dispatch)
)(PracticeView)