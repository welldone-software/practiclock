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
import Ionicons from 'react-native-vector-icons/Ionicons'
import {practices as practicesActions} from '../store/actions'

class Practice extends Component {
    onTitleChange = title => this.setState({title})
    onDurationChange = duration => this.setState({duration})
    onRepetitionChange = repeat => this.setState({repeat})

    onSubmit = () => {
        const {title, duration, repeat} = this.state
        this.props.add({ title, duration, repeat })
        Actions.pop()
    }

    onBack = () => {
        const {title, duration, repeat} = this.state
        this.props.edit(this.props.id, { title, duration, repeat })
        Actions.pop()
    }

    renderLeftButton = () => {
        if (this.props.id) return null

        return (
            <TouchableOpacity style={styles.navBarLeftButton} onPress={Actions.pop}>
                <Text style={styles.navBarText}>Cancel</Text>
            </TouchableOpacity>
        )
    }

    renderRightButton = () => {
        if (this.props.id) return null

        return (
            <TouchableOpacity style={styles.navBarRightButton} onPress={this.onSubmit}>
                <Text style={styles.navBarText}>Create</Text>
            </TouchableOpacity>
        )
    }

    renderBackButton = () => {
        return (
            <TouchableOpacity onPress={this.onBack}>
                <Ionicons name="ios-arrow-back-outline" size={30} />
            </TouchableOpacity>
        )
    }

     constructor(props) {
        super(props)
        const practice = props.practices.find(item => item.id === props.id) || {duration: 1, title: '', repeat: 1}
        this.state = {
            title: practice.title,
            duration: practice.duration,
            repeat: practice.repeat
        }
    }

    componentDidMount() {
        Actions.refresh(Object.assign({
            renderLeftButton: this.renderLeftButton,
            renderRightButton: this.renderRightButton,
            onBack: this.onBack,
        }, this.props.id ? {renderBackButton: this.renderBackButton} : {}))
    }

    render() {
        const {duration, title, repeat} = this.state
        return (
            <View style={styles.scene}>
                <View style={styles.formSection}>
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
                        <Text style={styles.previewValue}>{duration === 60 ? '1 h' : duration + ' min'}</Text>
                    </View>
                    <Slider 
                        style={styles.durationSlider} 
                        onValueChange={this.onDurationChange}
                        minimumValue={1}
                        maximumValue={60}
                        step={1}
                        value={duration}
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
                        minimumValue={1}
                        maximumValue={30}
                        step={1}
                        value={repeat}
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
)(Practice)