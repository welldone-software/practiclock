//@flow
import React, {Component, PropTypes} from 'react'
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    wrapper: {
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        backgroundColor: '#fff'
    },
    buttons: {
        width: SCREEN_WIDTH,
        padding: 8,
        borderTopWidth: 0.5,
        borderTopColor: 'lightgrey',
        justifyContent: 'space-between',
        flexDirection:'row'
    }
})

export default class CustomPicker extends Component {
    static propTypes = {
        current: PropTypes.any,
        visible: PropTypes.bool,
        onCancel: PropTypes.func,
        onSelect: PropTypes.func
    }

    onChange = (current) => {
        this.setState({current})
    }

    constructor(props) {
        super(props)
        this.state = {
            current: props.current
        }
    }

    componentWillReceiveProps(props) {
        this.setState({current: props.current})
    }

    render() {
        const {visible, onCancel, onSelect, children, ...props} = this.props
        const {current} = this.state
        return (
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={visible}>
                <View style={styles.container}>
                    <View style={styles.wrapper}>
                        <View style={styles.buttons}>
                            <TouchableOpacity onPress={onCancel}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onSelect(current)}>
                                <Text>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            {React.Children.map(children, item => React.cloneElement(item, { ...props, current, onChange: this.onChange }))}
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}
