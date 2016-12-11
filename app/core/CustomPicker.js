//@flow
import React, {Component, PropTypes} from 'react'
import {
    ART,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {BlurView} from 'react-native-blur'
import {Actions} from 'react-native-router-flux'
import Morph from 'art/morph/path'

const {
  Surface,
  Shape,
} = ART

const paths = [
    {
        d: 'M0,200 Q80,100 400,200 V150 H0 V50',
        time: 0.15
    },
    {
        d: 'M0,50 Q80,100 400,50 V150 H0 V50',
        time: 0.1
    },
    {
        d: 'M0,50 Q80,0 400,50 V150 H0 V50',
        time: 0.15
    },
    {
        d: 'M0,50 Q80,80 400,50 V150 H0 V50',
        time: 0.15
    },
    {
        d: 'M0,50 Q80,45 400,50 V150 H0 V50',
        time: 0.1
    },
    {
        d: 'M0,50 Q80,50 400,50 V150 H0 V50',
        time: 0.05
    }
].map(({d, time}) => ({time, d: Morph.Path(d)}))

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    wrapper: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        backgroundColor: '#fff',
        zIndex: 3
    },
    buttons: {
        width: width,
        padding: 8,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    icon: {
        color: '#6C8993',
        paddingLeft: 10,
        paddingRight: 10
    },
    title: {
        color: '#6C8993',
        fontSize: 20,
        lineHeight: 40
    },
    blur: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    line: {
        position: 'relative',
        top: 70,
        zIndex: 2
    }
})

export default class CustomPicker extends Component {
    static propTypes = {
        current: PropTypes.any,
        visible: PropTypes.bool,
        onCancel: PropTypes.func,
        onSelect: PropTypes.func,
        title: PropTypes.string
    }

    onChange = (current) => {
        this.setState({current})
    }

    constructor(props) {
        super(props)
        this.state = {
            current: props.current,
            transition: Morph.Tween(paths[0].d, paths[1].d)
        }
    }

    componentWillUnmount() {
        this.current = paths.length
        Actions.refresh({hideNavBar: false})
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.visible !== nextProps.visible) {
            Actions.refresh({hideNavBar: nextProps.visible})

            this._current = 1
            this.animate(null, this.nextAnimation)
        }
        this.setState({current: nextProps.current})
    }

    nextAnimation = () => {
        this._current += 1
        if (this._current >= paths.length) return
        this.setState({
            transition: Morph.Tween(paths[this._current-1].d, paths[this._current].d)
        }, () => this.animate(null, this.nextAnimation))
    }

    animate = (start, cb) => {
        requestAnimationFrame(timestamp => {
            if (!start) start = timestamp
            const path = paths[this._current]
            const time = path ? path.time : 0
            const delta = (timestamp-start)/1000
            if (delta >= time) {
                return cb()
            }
            this.state.transition.tween(delta)
            this.setState(this.state)
            this.animate(start, cb)
        })
    }

    render() {
        const {
            visible,
            onCancel,
            onSelect,
            children,
            title,
            ...props
        } = this.props
        const {current} = this.state

        if (!visible) return null

        return (
            <BlurView blurType="light" blurAmount={10} style={styles.blur}>
                <Modal
                    onRequestClose={function(){}}
                    animationType={'slide'}
                    transparent={true}
                    visible={visible}
                >
                    <View style={styles.container}>
                        <Surface width={width} height="120" style={styles.line}>
                            <Shape
                                x={0}
                                y={0}
                                d={this.state.transition}
                                stroke="#E9E9E9"
                                strokeWidth={1}
                            />
                            <Shape
                                x={0}
                                y={50}
                                d={this.state.transition}
                                stroke="#fff"
                                strokeWidth={50}
                            />
                        </Surface>
                        <View style={styles.wrapper}>
                            <View style={styles.buttons}>
                                <TouchableOpacity onPress={onCancel}>
                                    <Icon
                                        name="ios-close-outline"
                                        size={40}
                                        style={[styles.icon, {color: '#FC4E54'}]}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.title}>{title}</Text>
                                <TouchableOpacity
                                    onPress={() => onSelect(current)}
                                >
                                    <Icon
                                        name="ios-checkmark-outline"
                                        size={40}
                                        style={[styles.icon, {color: '#24CB58'}]}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View>
                                {
                                  React.Children.map(children, item => {
                                      return React.cloneElement(item, {
                                          ...props,
                                          current,
                                          onChange: this.onChange
                                      })
                                  })
                                }
                            </View>
                        </View>
                    </View>
                </Modal>
            </BlurView>
        )
    }
}
