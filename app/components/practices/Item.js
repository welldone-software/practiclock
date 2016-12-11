//@flow
import React, {Component} from 'react'
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import Slider from 'react-native-slider'
import CustomPicker from '../../core/CustomPicker'
import SoundPicker, {SOUNDS} from './SoundPicker'
import DurationPicker from './DurationPicker'
import MediaLibrary from '../MediaLibrary'
import {practices as actions} from '../../store/actions'

const width = Dimensions.get('window').width

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
    navBarButtonText: {
        fontSize: 18,
        marginVertical: 5,
        color: '#6C8993'
    },
    navBarLeftButton: {
        marginTop: -6
    },
    navBarRightButton: {
        marginTop: -7
    },
    navBarIcon: {
        height: 39
    },
    navBackButton: {
        marginLeft: 2,
        color: '#6C8993'
    },
    navBarTitle: {
        fontWeight: '500',
        color: '#6C8993'
    },
    removeButton: {
        marginTop: 2,
        paddingLeft: 4,
    },
    section: {
        paddingRight: 10,
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eff0f0',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    icon: {
        width: 50,
        color: '#6C8993',
        paddingLeft: 15,
        paddingRight: 10,
    },
    iconText: {
        textDecorationLine: 'underline',
        fontSize: 22,
        fontWeight: '200',
        textAlign: 'center'
    },
    label: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 18,
        lineHeight: 26,
        color: '#6C8993'
    },
    preview: {
        fontSize: 18,
        lineHeight: 26,
        color: '#CBD3D8'
    },
    input: {
        width: width/2,
        color: '#4F5E69'
    },
    repeat: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width-10
    },
    buttons: {
        position: 'absolute',
        width,
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    button: {
        width: width/2.5,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    slider: {
        paddingLeft: 20,
        paddingRight: 10,
        paddingTop: 20
    },
    track: {
        height: 2,
        borderRadius: 1,
        backgroundColor: '#CBD3D8',
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#6C8993'
    },
    scene: {
        flex: 1,
        marginTop: 70
    }
})

class Practice extends Component {
    onTitleChange = title => this.setState({title})
    onDurationChange = duration => this.setState({duration, showDurationPicker: false})
    onRepetitionChange = repeat => this.setState({repeat})
    onSoundSelected = sound => this.setState({sound, showSoundPicker: false})

    onSubmit = () => {
        const {title, duration, repeat, sound} = this.state
        this.props.add({
            title: ['', null, undefined].includes(title) ? `Practice ${this.props.practices.length+1}` : title,
            duration,
            repeat,
            sound
        })
        Actions.pop()
    }

    onBack = () => {
        const {title, duration, repeat, sound} = this.state
        this.props.edit(this.props.id, {
            title: ['', null, undefined].includes(title) ? `Practice ${this.props.practices.length+1}` : title,
            duration,
            repeat,
            sound
        })
        Actions.pop()
    }

    onDelete = () => {
        const {remove, id} = this.props
        remove(id)
        Actions.pop()
    }

    onPlay = () => {
        MediaLibrary.play(this.state.sound.file, null, this.state.repeat)
    }

    renderLeftButton = () => {
        if (this.props.id) return null
        return (
            <TouchableOpacity style={styles.navBarLeftButton} onPress={Actions.pop}>
                <Icon name="ios-close-outline" size={40} style={[styles.navBarIcon, {color: '#FC4E54'}]}/>
            </TouchableOpacity>
        )
    }

    renderRightButton = () => {
        if (this.props.id) return null
        return (
            <TouchableOpacity style={styles.navBarRightButton} onPress={this.onSubmit}>
                <Icon name="ios-checkmark-outline" size={40} style={[styles.navBarIcon, {color: '#24CB58'}]}/>
            </TouchableOpacity>
        )
    }

    renderBackButton = () => (
        <TouchableOpacity onPress={this.onBack}>
            <Icon name="ios-arrow-back-outline" size={26} style={styles.navBackButton}/>
        </TouchableOpacity>
    )

    constructor(props) {
        super(props)
        const practice = props.practices.find(item => item.id === props.id) || {duration: 10*1000, title: '', repeat: 1, sound: SOUNDS[0]}
        this.state = {
            ...practice,
            showSoundPicker: false,
            showDurationPicker: false
        }

        this._sliderHeight = new Animated.Value(0)
        this._sliderOpacity = new Animated.Value(0)
    }

    componentDidMount() {
        Actions.refresh(Object.assign({
            renderLeftButton: this.renderLeftButton,
            renderRightButton: this.renderRightButton,
            navigationBarStyle: styles.navbar,
            titleStyle: styles.navBarTitle,
            onBack: this.onBack,
        }, this.props.id ? {renderBackButton: this.renderBackButton} : {}))
    }

    toggleRepeatSlider(showRepeatSlider) {
        if (showRepeatSlider) {
            this._sliderHeight.setValue(0)
            this._sliderOpacity.setValue(0)

            this.setState({showRepeatSlider}, () => {
                Animated.sequence([
                    Animated.timing(this._sliderHeight, {
                        duration: 200,
                        easing: Easing.linear,
                        toValue: 60
                    }),
                    Animated.timing(this._sliderOpacity, {
                        duration: 100,
                        easing: Easing.linear,
                        toValue: 1
                    })
                ]).start()
            })
        } else {
            this._sliderHeight.setValue(60)
            this._sliderOpacity.setValue(1)
            Animated.sequence([
                Animated.timing(this._sliderOpacity, {
                    duration: 100,
                    easing: Easing.linear,
                    toValue: 0
                }),
                Animated.timing(this._sliderHeight, {
                    duration: 200,
                    easing: Easing.linear,
                    toValue: 0
                })
            ]).start(() => this.setState({showRepeatSlider}))
        }
    }

    render() {
        const {duration, title, repeat, sound} = this.state
        const min = (duration/1000/60) << 0 || 0
        const sec = (duration/1000) % 60 || '00'

        return (
            <View style={styles.scene}>
                <View style={styles.section}>
                    <View style={styles.label}>
                        <Text style={[styles.icon, styles.iconText]}>A</Text>
                        <TextInput
                            style={styles.input}
                            editable
                            placeholder="Type here to set name of practice"
                            placeholderTextColor="#CBD3D8"
                            onChangeText={this.onTitleChange}
                            value={title}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => this.setState({showDurationPicker: true})}
                    activeOpacity={1}
                >
                    <View style={styles.section}>
                        <View style={styles.label}>
                            <Icon name="ios-clock-outline" size={26} style={styles.icon}/>
                            <Text style={styles.text}>Duration</Text>
                        </View>
                        <Text style={styles.preview}>{min}:{sec}</Text>
                    </View>
                </TouchableOpacity>

                <View style={[styles.section, {flexDirection: 'column'}]}>
                    <TouchableOpacity
                        onPress={() => this.toggleRepeatSlider(!this.state.showRepeatSlider)}
                        style={styles.repeat}
                        activeOpacity={1}
                    >
                        <View style={styles.label}>
                            <Icon name="ios-sync-outline" size={26} style={styles.icon}/>
                            <Text style={styles.text}>Repeat</Text>
                        </View>
                        <Text style={styles.preview}>{repeat}</Text>
                    </TouchableOpacity>
                    {this.state.showRepeatSlider &&
                        <Animated.View style={[styles.slider, {opacity: this._sliderOpacity, height: this._sliderHeight}]}>
                            <Slider
                                value={repeat}
                                onValueChange={this.onRepetitionChange}
                                onSlidingComplete={() => this.toggleRepeatSlider(false)}
                                minimumValue={1}
                                maximumValue={30}
                                step={1}
                                trackStyle={styles.track}
                                thumbStyle={styles.thumb}
                                minimumTrackTintColor='#6C8993'
                            />
                        </Animated.View>
                    }
                </View>

                <TouchableOpacity
                    onPress={() => this.setState({showSoundPicker: true})}
                    activeOpacity={1}
                >
                    <View style={styles.section}>
                        <View style={styles.label}>
                            <Icon name="ios-musical-notes-outline" size={26} style={styles.icon}/>
                            <Text style={styles.text}>Sound</Text>
                        </View>
                        <Text style={styles.preview}>{sound.name}</Text>
                    </View>
                </TouchableOpacity>

                {this.props.id &&
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            onPress={this.onPlay}
                            style={styles.button}
                            activeOpacity={1}
                        >
                            <Icon name="ios-play-outline" size={20} color="#24CB58"/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.onDelete}
                            style={styles.button}
                            activeOpacity={1}
                        >
                            <Icon name="ios-trash-outline" size={20} color="#FC4E54"/>
                        </TouchableOpacity>
                    </View>
                }

                <CustomPicker
                     visible={this.state.showDurationPicker}
                     onCancel={() => this.setState({showDurationPicker: false})}
                     onSelect={this.onDurationChange}
                     current={duration}
                     title="Duration"
                 >
                     <DurationPicker />
                 </CustomPicker>

                <CustomPicker
                     visible={this.state.showSoundPicker}
                     onCancel={() => this.setState({showSoundPicker: false})}
                     onSelect={this.onSoundSelected}
                     current={sound}
                     title="Sound"
                 >
                     <SoundPicker/>
                 </CustomPicker>
            </View>
        )
    }
}

export default connect(
    state => state.practices,
    dispatch => bindActionCreators(actions, dispatch)
)(Practice)
