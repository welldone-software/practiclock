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

class PracticeCreate extends Component {
    state = {
        titile: '',
        duration: 0,
        repeat: 0
    }

    onTitleChange = title => this.setState({title})
    onDurationChange = duration => this.setState({duration: Math.round(duration * 60)})
    onRepetitionChange = repeat => this.setState({repeat: Math.round(repeat * 30)})

    onSubmit = () => {
        const {title, duration, repeat} = this.state
        this.props.add({ title, duration, repeat })
        Actions.pop()
    }

    renderLeftButton = () => {
        return (
            <TouchableOpacity style={styles.navBarLeftButton} onPress={Actions.pop}>
                <Text style={styles.navBarText}>Cancel</Text>
            </TouchableOpacity>
        )
    }

    renderRightButton = () => {
        return (
            <TouchableOpacity style={styles.navBarRightButton} onPress={this.onSubmit}>
                <Text style={styles.navBarText}>Create</Text>
            </TouchableOpacity>
        )
    }

    componentDidMount() {
        Actions.refresh({
            renderLeftButton: this.renderLeftButton,
            renderRightButton: this.renderRightButton
        })
    }

    render() {
        return (
            <View style={styles.scene}>
                <View style={styles.formSection}>
                    <Text style={styles.formLabel}>Title</Text>
                    <TextInput
                        editable
                        style={styles.titleInput}
                        placeholder="Type here to set name of practice"
                        onChangeText={this.onTitleChange}
                        value={this.state.title}
                    />
                </View>
                <View style={styles.formSection}>
                    <View style={styles.formLableWrapper}>
                        <Text style={styles.formLabel}>Duration</Text>
                        <Text style={styles.previewValue}>{this.state.duration === 60 ? '1h' : this.state.duration + 'min'}</Text>
                    </View>
                    <Slider 
                        style={styles.durationSlider} 
                        onValueChange={this.onDurationChange}
                    />
                </View>
                <View style={styles.formSection}>
                    <View style={styles.formLableWrapper}>
                        <Text style={styles.formLabel}>Repeat</Text>
                        <Text style={styles.previewValue}>{this.state.repeat}</Text>
                    </View>
                    <Slider 
                        style={styles.durationSlider} 
                        onValueChange={this.onRepetitionChange}
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
)(PracticeCreate)