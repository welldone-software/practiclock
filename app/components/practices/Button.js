//@flow
import React, {Component, PropTypes} from 'react'
import {
    Animated,
    Easing,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import SimpleTrackPlayer from '../SimpleTrackPlayer'

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        width: 30,
        height: 30
    },
    buttonDelete: {
        borderRadius: 15,
        borderWidth: 1,
        backgroundColor: '#FC4E54',
        borderColor: '#FC4E54',
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4
    },
    buttonDeleteIcon: {
        color: '#fff'
    }
})

class DeleteButton extends Component {
    render () {
        const {onPress, style} = this.props
        return (
            <View style={style}>
                <TouchableOpacity onPress={onPress} style={styles.buttonDelete}>
                    <Icon name="ios-trash-outline" size={20} style={styles.buttonDeleteIcon}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const DeleteButtonAnimated = Animated.createAnimatedComponent(DeleteButton)
const SimpleTrackPlayerAnimated = Animated.createAnimatedComponent(SimpleTrackPlayer)

export default class Button extends Component {
    static propTypes = {
        editMode: PropTypes.bool,
        onPlay: PropTypes.func.isRequired,
        isPlaying: PropTypes.bool
    }

    static defaultProps = {
        editMode: false,
        isPlaying: false
    }

    constructor(props) {
        super(props)
        this._editModeButtonOpacity = new Animated.Value(0)
        this._viewModeButtonOpacity = new Animated.Value(1)
        this._buttonRotation = new Animated.Value(0)
        this.toggleMode(this.props.editMode)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.editMode !== nextProps.editMode) {
            if (nextProps.editMode) {
                this.startEditModeAnimation()
            } else {
                this.endEditModeAnimation()
            }
        }
    }

    toggleMode(editMode) {
        if (editMode) {
            this.startEditModeAnimation()
        } else {
            this.endEditModeAnimation()
        }
    }

    startEditModeAnimation() {
        this._editModeButtonOpacity.setValue(0)
        this._viewModeButtonOpacity.setValue(1)
        this._buttonRotation.setValue(0)

        Animated.parallel([
            Animated.timing(this._editModeButtonOpacity, {
                duration: 300,
                easing: Easing.linear,
                toValue: 1
            }),
            Animated.timing(this._viewModeButtonOpacity, {
                duration: 300,
                easing: Easing.linear,
                toValue: 0
            }),
            Animated.timing(this._buttonRotation, {
                duration: 300,
                easing: Easing.linear,
                toValue: 100
            })
        ]).start()
    }

    endEditModeAnimation() {
        this._editModeButtonOpacity.setValue(1)
        this._viewModeButtonOpacity.setValue(0)
        this._buttonRotation.setValue(100)

        Animated.parallel([
            Animated.timing(this._editModeButtonOpacity, {
                duration: 300,
                easing: Easing.linear,
                toValue: 0
            }),
            Animated.timing(this._viewModeButtonOpacity, {
                duration: 300,
                easing: Easing.linear,
                toValue: 1
            }),
            Animated.timing(this._buttonRotation, {
                duration: 300,
                easing: Easing.linear,
                toValue: 0
            })
        ]).start()
    }

    render() {
        const {
            onPlay,
            onPause,
            isPlaying,
            onDelete
        } = this.props

        const interpolatedButtonRotateAnimation = this._buttonRotation.interpolate({
            inputRange: [0, 100],
            outputRange: ['0deg', '360deg']
        })

        return (
            <View>
                <SimpleTrackPlayerAnimated
                    style={
                        [
                            styles.button,
                            {
                                transform: [{rotate: interpolatedButtonRotateAnimation}],
                                opacity: this._viewModeButtonOpacity,
                                zIndex: this._viewModeButtonOpacity
                            }
                        ]
                    }
                    onPlay={onPlay}
                    onPause={onPause}
                    isPlaying={isPlaying}
                />
                <DeleteButtonAnimated
                    style={
                        [
                            styles.button,
                            {
                                transform: [{rotate: interpolatedButtonRotateAnimation}],
                                opacity: this._editModeButtonOpacity,
                                zIndex: this._editModeButtonOpacity
                            }
                        ]
                    }
                    onPress={onDelete}
                />
            </View>
        )
    }
}
