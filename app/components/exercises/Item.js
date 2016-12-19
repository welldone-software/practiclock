//@flow
import React, {Component} from 'react'
import {
    Alert,
    Animated,
    Dimensions,
    Easing,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import dismissKeyboard from 'dismissKeyboard'
import {Actions} from 'react-native-router-flux'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import SortableList from 'react-native-sortable-list'
import ActionButton from 'react-native-action-button'
import CustomPicker from '../../core/CustomPicker'
import {exercises as actions} from '../../store/actions'
import PracticePicker from './PracticePicker'
import IntervalPicker from './IntervalPicker'

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#fff',
        borderBottomWidth: 0
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
    scene: {
        flex: 1,
        marginTop: 70,
        backgroundColor: '#F3F6F6'
    },
    title: {
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#eff0f0',
        backgroundColor: '#fff'
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
    input: {
        width: width/2,
        color: '#4F5E69'
    },
    row: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 16,
        paddingRight: 16,
        marginVertical: 6,
        height: 70,
        width: width-20,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8
    },
    container: {
        flex: 1,
        alignItems: 'flex-start',
        marginBottom: 50
    },
    content: {
        width: width,
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    iconType: {
        paddingRight: 16,
        paddingLeft: 16,
        color: '#6C8993'
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text: {
        lineHeight: 22,
        marginRight: 5,
        color: '#6C8993'
    },
    orderButton: {
        color: '#ccc'
    },
    itemButton: {
        color: '#FC4E54'
    },
    actionButtonIcon: {
        height: 28,
        color: 'white'
    },
    buttons: {
        position: 'absolute',
        width,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5'
    },
    button: {
        width: width/2.5,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    }
})

export const Types = {
    PRACTICE: 'PRACTICE',
    INTERVAL: 'INTERVAL'
}

class Row extends Component {
    state = {
        style: {
            transform: [{scale: new Animated.Value(1)}],
        },
        intervalStyle: {
            height: 40,
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 10,
            paddingBottom: 10
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.active === nextProps.active) return

        if (nextProps.active) {
            this.startActivationAnimation()
        } else {
            this.startDeactivationAnimation()
        }
    }

    startActivationAnimation = () => {
        const {style} = this.state

        Animated.parallel([
            Animated.timing(style.transform[0].scale, {
                duration: 100,
                easing: Easing.out(Easing.quad),
                toValue: 1.1
            }),
        ]).start()
    }

    startDeactivationAnimation = () => {
        const {style} = this.state

        Animated.parallel([
            Animated.timing(style.transform[0].scale, {
                duration: 100,
                easing: Easing.out(Easing.quad),
                toValue: 1
            })
        ]).start()
    }

    render() {
        const {
            data,
            index,
            onDelete,
        } = this.props
        const duration = data.value
        const min = Math.round((duration/1000/60) << 0 || 0)
        const sec = Math.round((duration/1000)%60) || '00'

        return (
            <Animated.View
                style={[
                    styles.row,
                    this.state.style,
                    data.type === Types.PRACTICE ? null : this.state.intervalStyle
                ]}
            >
                <Icon name="md-more" size={22} style={styles.orderButton}/>
                <View style={styles.item}>
                    {data.type === Types.INTERVAL &&
                        <View style={styles.wrapper}>
                            <View style={styles.info}>
                                <Icon name="ios-clock-outline" size={22} style={[styles.iconType, {color: '#F4B03A'}]}/>
                                <Text style={styles.text}>Pause</Text>
                                <Text style={styles.text}>{min}:{sec}</Text>
                            </View>
                            <TouchableOpacity onPress={() => onDelete(index)}>
                                <Icon name="ios-trash-outline" size={20} style={styles.itemButton}/>
                            </TouchableOpacity>
                        </View>
                    }
                    {data.type === Types.PRACTICE &&
                        <View style={styles.wrapper}>
                            <View style={styles.info}>
                                <Icon name="ios-basketball-outline" size={22} style={[styles.iconType, {color: '#BD7BEE'}]}/>
                                <Text style={styles.text}>{data.title}</Text>
                            </View>
                            <TouchableOpacity onPress={() => onDelete(index)}>
                                <Icon name="ios-trash-outline" size={25} style={styles.itemButton}/>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </Animated.View>
        )
    }
}

class Exercise extends Component {
    onTitleChange = title => this.setState({title})

    onDeleteExercise = () => {
        Alert.alert(
            'Remove this exercise?',
            null,
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        const {remove, id} = this.props
                        remove(id)
                        Actions.pop()
                    }
                },
                {
                    text: 'No',
                    onPress: () => {}
                }
            ]
        )
    }

    onDelete = (index) => {
        const tmp = {...this.state.data}
        delete tmp[index]
        const data = Object.assign({}, Object.keys(tmp).map(key => tmp[key]))
        this.setState({data, shouldRerender: true}, () => this.setState({shouldRerender: false}))
    }

    onSubmit = () => {
        const {title, data} = this.state
        this.props.add({
            title: ['', null, undefined].includes(title) ? 'Exercise' : title,
            data
        })
        dismissKeyboard()
        Actions.pop()
    }

    onBack = () => {
        const {title, data} = this.state

        dismissKeyboard()

        if (Object.values(data).filter(item => item.type === Types.PRACTICE).length === 0) {
            alert('You can\'t leave exercise without practices')
        } else {
            this.props.edit(this.props.id, {
                title: ['', null, undefined].includes(title) ? 'Exercise' : title,
                data
            })
            Actions.pop()
        }
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

        if (Object.values(this.state.data).filter(item => item.type === Types.PRACTICE).length === 0) return null

        return (
            <TouchableOpacity style={styles.navBarRightButton} onPress={this.onSubmit}>
                <Icon name="ios-checkmark-outline" size={40} style={[styles.navBarIcon, {color: '#24CB58'}]}/>
            </TouchableOpacity>
        )
    }

    onPracticeSelected = (id) => {
        const data = {...this.state.data}
        const index = Object.keys(data).length

        data[index] = {
            id: id,
            type: Types.PRACTICE
        }

        this.setState({
            showPracticePicker: false,
            data,
            shouldRerender: true
        }, ()  => this.setState({shouldRerender: false}))
    }

    onIntervalSelected = (value) => {
        const data = {...this.state.data}
        const index = Object.keys(data).length

        data[index] = {
            value,
            type: Types.INTERVAL
        }

        this.setState({
            showIntervalPicker: false,
            data,
            shouldRerender: true
        }, ()  => this.setState({shouldRerender: false}))
    }

    renderRow = (data, index, active) => {
        let item

        switch (data.type) {
            case Types.INTERVAL:
                item = data
                break
            case Types.PRACTICE:
                item = this.props.practices.practices.find(item => item.id === data.id)
                break
        }

        item = Object.assign({}, item, {type: data.type})

        return (
            <Row
                data={item}
                active={active}
                index={index}
                onDelete={this.onDelete}
            />
        )
    }

    onOrderChange = () => {
        const {title, order} = this.state

        if (!order) return

        const tmp = {...this.state.data}
        const data = Object.assign({}, order.map(key => tmp[key]))
        const hasSequenceOfIntervals = Object.assign([], data).some((item, index, arr) => {
            const next = Object.assign({}, arr[index+1])
            if (item.type === Types.PRACTICE) return
            return item.type === next.type
        })

        if (hasSequenceOfIntervals) {
            alert('You can\'t put 2 pauses consistently')
            this.setState({shouldRerender: true}, () => this.setState({shouldRerender: false}))
        } else {
            this.setState({data})
        }

        if (Object.values(data).filter(item => item.type === Types.PRACTICE).length !== 0) {
            this.props.edit(this.props.id, {
                title: ['', null, undefined].includes(title) ? 'Exercise' : title,
                data
            })
        }
    }

    renderBackButton = () => (
        <TouchableOpacity onPress={this.onBack}>
            <Icon name="ios-arrow-back-outline" size={26} style={styles.navBackButton}/>
        </TouchableOpacity>
    )

    constructor(props) {
        super(props)
        const exercise = props.exercises.exercises.find(item => item.id === props.id) || {title: '', data: {}}
        this.state = {
            showPracticePicker: false,
            showIntervalPicker: false,
            title: exercise.title,
            data: exercise.data,
            scrollEnabled: true,
            mounted: false
        }
    }

    componentDidMount() {
        Actions.refresh(Object.assign({
            renderLeftButton: this.renderLeftButton,
            renderRightButton: this.renderRightButton,
            onBack: this.onBack,
            navigationBarStyle: styles.navbar,
            titleStyle: styles.navBarTitle
        }, this.props.id ? {renderBackButton: this.renderBackButton} : {}))
        this.setState({mounted: true})
    }

    render() {
        const {
            title,
            data,
            mounted,
            shouldRerender
        } = this.state

        let currentPractices = Object.assign([], data.data).filter(item => item.type === Types.PRACTICE).map((item) => {
            return practices.find(practice => practice.id === item.id)
        })

        const items = Object.values(data)
        const lastItem = items[items.length-1]
        const isIntervalLastItem = lastItem ? lastItem.type === Types.INTERVAL : false

        if (!mounted || shouldRerender) return null

        return (
            <TouchableWithoutFeedback style={styles.scene} onPress={()=> dismissKeyboard()}>
                <View style={styles.scene}>
                    <View style={styles.title}>
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

                    {items.length !== 0 &&
                        <View style={styles.wrapper}>
                            <View style={styles.container}>
                                <SortableList
                                    contentContainerStyle={styles.content}
                                    data={data}
                                    renderRow={({data, active, index}) => this.renderRow(data, index, active)}
                                    onChangeOrder={(order) => this.setState({order})}
                                    onReleaseRow={this.onOrderChange}
                                />
                            </View>
                        </View>
                    }

                    <View style={styles.buttons}>
                        {this.props.id &&
                            <TouchableOpacity
                                style={styles.button}
                                activeOpacity={1}
                                onPress={()=> Actions.playerOpen({id: this.props.id + '-exercises'})}
                            >
                                <Icon name="ios-play-outline" size={28} color="#24CB58"/>
                            </TouchableOpacity>
                        }
                        <ActionButton
                            buttonColor="#24CB58"
                            hideShadow={true}
                            spacing={10}
                            position="center"
                            offsetY={0}
                            icon={<Icon name="ios-add-outline" size={36} color="#FFF"/>}
                        >
                            <ActionButton.Item
                                buttonColor="#BD7BEE"
                                title="Practice"
                                onPress={() => this.setState({showPracticePicker: true})}
                                titleBgColor="#FFF"
                                titleColor="#6C8993"
                                textContainerStyle={{borderColor: 'transparent'}}
                                spaceBetween={2}
                            >
                                <Icon name="ios-basketball-outline" size={28} style={styles.actionButtonIcon}/>
                            </ActionButton.Item>
                            <ActionButton.Item
                                buttonColor='#F4B03A'
                                title="Pause"
                                onPress={() => this.setState({showIntervalPicker: true})}
                                disabled={isIntervalLastItem}
                                titleBgColor="#FFF"
                                titleColor="#6C8993"
                                textContainerStyle={{borderColor: 'transparent'}}
                                spaceBetween={2}
                            >
                                <Icon name="ios-clock-outline" size={28} style={styles.actionButtonIcon}/>
                            </ActionButton.Item>
                        </ActionButton>
                        {this.props.id &&
                            <TouchableOpacity
                                onPress={this.onDeleteExercise}
                                style={styles.button}
                                activeOpacity={1}
                            >
                                <Icon name="ios-trash-outline" size={28} color="#FC4E54"/>
                            </TouchableOpacity>
                        }
                    </View>

                    <CustomPicker
                        visible={this.state.showPracticePicker}
                        onCancel={() => this.setState({showPracticePicker: false})}
                        onSelect={this.onPracticeSelected}
                        current={this.props.practices.practices[0].id}
                        title="Practice"
                    >
                        <PracticePicker items={this.props.practices.practices}/>
                    </CustomPicker>

                    <CustomPicker
                        visible={this.state.showIntervalPicker}
                        onCancel={() => this.setState({showIntervalPicker: false})}
                        onSelect={this.onIntervalSelected}
                        min={10000}
                        current={10000}
                        title="Pause"
                    >
                        <IntervalPicker/>
                    </CustomPicker>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

export default connect(
    state => {
        const {exercises, practices} = state
        return {exercises, practices}
    },
    dispatch => bindActionCreators(actions, dispatch)
)(Exercise)
