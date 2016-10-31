//@flow
import React, {Component} from 'react'
import {
    Slider,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {practices as practicesActions} from '../store/actions'

class PracticeEdit extends Component {
    onTitleChange = title => this.setState({title})
    onDurationChange = duration => this.setState({duration: Math.round(duration * 60)})
    onRepetitionChange = repeat => this.setState({repeat: Math.round(repeat * 30)})

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

    onSubmit = () => {
        const {id, edit} = this.props
        edit(id, this.state)
        Actions.pop()
    }

    renderRightButton = () => {
        return (
            <TouchableOpacity style={styles.navBarRightButton} onPress={this.onSubmit}>
                <Text style={styles.navBarText}>Save</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {duration, title, repeat} = this.state
        return (
            <View style={styles.scene}>
                <View style={styles.formSection}>
                    <Text style={styles.formLabel}>Title</Text>
                    <TextInput
                        editable
                        style={styles.titleInput}
                        placeholder="Type here to set name of practice"
                        onChangeText={this.onTitleChange}
                        value={title}
                    />
                </View>
                <View style={styles.formSection}>
                    <View style={styles.formLableWrapper}>
                        <Text style={styles.formLabel}>Duration</Text>
                        <Text style={styles.previewValue}>{duration === 60 ? '1h' : duration + 'min'}</Text>
                    </View>
                    <Slider
                        style={styles.durationSlider}
                        onValueChange={this.onDurationChange}
                        value={duration / 60}
                    />
                </View>
                <View style={styles.formSection}>
                    <View style={styles.formLableWrapper}>
                        <Text style={styles.formLabel}>Repeat</Text>
                        <Text style={styles.previewValue}>{repeat}</Text>
                    </View>
                    <Slider
                        style={styles.durationSlider}
                        onValueChange={this.onRepetitionChange}
                        value={repeat / 30}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    navBarText: {
        fontSize: 16,
        marginVertical: 5
    },
    navBarLeftButton: {
        paddingLeft: 10
    },
    navBarRightButton: {
        paddingRight: 10
    },
    formSection: {
        paddingTop: 20
    },
    formLableWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    formLabel: {
        fontSize: 18
    },
    previewValue: {
        fontSize: 18
    },
    titleInput: {
        height: 60
    },
    durationSlider: {
        marginTop: 16
    },
    scene: {
        flex: 1,
        marginTop: 60,
        padding: 10
    }
})

export default connect(
    state => state.practices,
    dispatch => bindActionCreators(practicesActions, dispatch)
)(PracticeEdit)