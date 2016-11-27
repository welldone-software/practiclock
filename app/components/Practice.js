//@flow
import React, {Component} from 'react'
import {
    Dimensions,
    Picker,
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
import Sound from 'react-native-sound'
import CustomPicker from '../core/CustomPicker'
import {practices as practicesActions} from '../store/actions'

const SCREEN_WIDTH = Dimensions.get('window').width
export const SOUNDS = ['1.mp3', '2.mp3', '3.mp3', '4.mp3']

class SoundPicker extends Component {
    state = {
        sound: null
    }
    
    componentWillUnmount() {
        this.stop()
    }

    onChangeValue = (value) => {
        this.stop()
        const sound = new Sound(value, Sound.MAIN_BUNDLE, error => {if (!error) sound.play()})
        this.setState({sound})
        this.props.onChange(value)
    }

    stop = () => {
        if (this.state.sound) this.state.sound.stop()
    }

    render() {
        const {current, items} = this.props
        return (
            <Picker
                style={styles.picker}
                selectedValue={current}
                onValueChange={this.onChangeValue}
                mode="dropdown"
            >
                {items.map(item => <Picker.Item label={item} value={item} key={item} />)}
            </Picker>
        )
    }
}

class Practice extends Component {
    onTitleChange = title => this.setState({title})
    onDurationChange = duration => this.setState({duration})
    onRepetitionChange = repeat => this.setState({repeat})
    onSoundSelected = sound => this.setState({sound, showSoundPicker: false})

    onSubmit = () => {
        const {title, duration, repeat, sound} = this.state
        this.props.add({ title, duration, repeat, sound })
        Actions.pop()
    }

    onBack = () => {
        const {title, duration, repeat, sound} = this.state
        this.props.edit(this.props.id, { title, duration, repeat, sound })
        Actions.pop()
    }

    onDelete = () => {
        const {remove, id} = this.props
        remove(id)
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
        if (this.props.id) {
            return (
                <TouchableOpacity style={styles.navBarRightButton} onPress={this.onDelete}>
                    <Ionicons name="md-trash" size={26} style={styles.buttonBack}/>
                </TouchableOpacity>
            )

        } else {
            return (
                <TouchableOpacity style={styles.navBarRightButton} onPress={this.onSubmit}>
                    <Text style={styles.navBarText}>Create</Text>
                </TouchableOpacity>
            )
        }

    }

    renderBackButton = () => {
        return (
            <TouchableOpacity onPress={this.onBack}>
                <Ionicons name="ios-arrow-back-outline" size={30} style={styles.buttonBack} />
            </TouchableOpacity>
        )
    }

    constructor(props) {
        super(props)
        const practice = props.practices.find(item => item.id === props.id) || {duration: 1, title: '', repeat: 1}
        this.state = {...practice, showSoundPicker: false}
    }

    componentDidMount() {
        Actions.refresh(Object.assign({
            renderLeftButton: this.renderLeftButton,
            renderRightButton: this.renderRightButton,
            navigationBarStyle: styles.navbar,
            titleStyle: styles.title,
            onBack: this.onBack,
        }, this.props.id ? {renderBackButton: this.renderBackButton} : {}))
    }

    render() {
        const {duration, title, repeat, sound} = this.state
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

                <View style={styles.formSection}>
                    <TouchableOpacity
                        onPress={() => this.setState({showSoundPicker: true})}
                    >
                        <View style={styles.formLableWrapper}>
                            <Text style={styles.formLabel}>Sound</Text>
                            <Text style={styles.previewValue}>{sound ? sound : 'Touch here to add sound'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <CustomPicker
                    visible={this.state.showSoundPicker}
                    onCancel={() => this.setState({showSoundPicker: false})}
                    onSelect={this.onSoundSelected}
                    current={sound}
                >
                    <SoundPicker items={SOUNDS} />
                </CustomPicker>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#E37475',
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: {
            height: 4, 
            width: 2
        },
        borderBottomWidth: 0
    },
    navBarText: {
        fontSize: 18,
        marginVertical: 5,
        color: '#b51f23'
    },
    navBarLeftButton: {
        marginTop: -2,
        paddingLeft: 10
    },
    navBarRightButton: {
        marginTop: -5,
        paddingRight: 10
    },
    title: {
        color: '#b51f23'
    },
    buttonBack: {
        color: '#b51f23'
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
        fontSize: 18,
        color: '#ccc'
    },
    titleInput: {
        height: 60
    },
    durationSlider: {
        marginTop: 16
    },
    picker: {
        width: SCREEN_WIDTH
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
