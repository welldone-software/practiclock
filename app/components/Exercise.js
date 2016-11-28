//@flow
import React, {Component, PropTypes} from 'react'
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    ListView,
    Modal,
    Picker,
    ScrollView,
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
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SortableList from 'react-native-sortable-list'
import ActionButton from 'react-native-action-button'
import CustomPicker from '../core/CustomPicker'
import {exercises as exercisesActions} from '../store/actions'

const SCREEN_WIDTH = Dimensions.get('window').width

export const Types = {
    PRACTICE: 'PRACTICE',
    INTERVAL: 'INTERVAL'
}

const PracticePicker = ({items, current, onChange}) => {
    const styles = StyleSheet.create({
        picker: {
            width: SCREEN_WIDTH
        }
    })

    return (
        <Picker
            style={styles.picker}
            selectedValue={current}
            onValueChange={onChange}
            mode="dropdown"
        >
            {items.map(item => <Picker.Item label={item.title} value={item.id} key={item.id} />)}
        </Picker>
    )
}

const IntervalPicker = ({current = 0, onChange}) => {
    const styles = StyleSheet.create({
        wrapper: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        slider: {
            marginTop: 16,
            width: SCREEN_WIDTH
        },
        preview: {
            fontSize: 18
        }
    })

    return (
         <View>
            <View style={styles.wrapper}>
                <Text style={styles.preview}>Pause</Text>
                <Text style={styles.preview}>{current === 60 ? '1h' : current + 'min'}</Text>
            </View>
            <View>
                <Slider 
                    style={styles.slider} 
                    onValueChange={(value) => onChange(Math.round(value * 60))}
                />
            </View>
        </View>
    )
}

class Row extends Component {
    state = {
        style: {
            transform: [{scale: new Animated.Value(1)}],
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

        return (
            <Animated.View 
                style={[
                    styles.row,
                    this.state.style,
                ]}
            >
                <View style={styles.item}>
                    <View>
                        {data.type === Types.INTERVAL &&
                            <View style={styles.wrapper}>
                                <Text>Pause</Text>
                                <Text>{data.value === 60 ? '1h' : data.value + 'min'}</Text>
                            </View>
                        }
                        
                        {data.type === Types.PRACTICE &&
                            <Text>{data.title}</Text>
                        }
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => onDelete(index)}
                        >
                            <FontAwesome name="trash" size={25} style={styles.itemButton} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        )
    }
}

class Exercise extends Component {
    onTitleChange = title => this.setState({title})

    onDelete = (index) => {
        const tmp = {...this.state.data}
        delete tmp[index]

        const data = Object.assign({}, 
            Object.keys(tmp).map(key => tmp[key])
        )

        this.setState({data, shouldRerender: true}, () => this.setState({shouldRerender: false}))
    }

    onSubmit = () => {
        const {title, data} = this.state
        this.props.add({ 
            title: title === null || title === undefined ? 'Name' : title, 
            data
        })
        Actions.pop()
    }

    onBack = () => {
        const {title, data} = this.state
        this.props.edit(this.props.id, { 
            title: title === null || title === undefined ? 'Name' : title, 
            data
        })
        Actions.pop()
    }

    onPressPlayButton = () => {
        const {title, data} = this.state
        this.props.edit(this.props.id, {title, data})
        Actions.playerOpen({id: this.props.id})
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
                <TouchableOpacity onPress={this.onPressPlayButton}>
                    <Ionicons name="md-play" size={22} style={styles.playButton}/>
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

    onPracticeSelected = (id) => {
        const data = {...this.state.data} 
        const index = Object.keys(data).length;

        data[index] = {
            id: id,
            type: Types.PRACTICE
        }

        this.setState({
            showPracticePicker: false, 
            data,
            shouldRerender: true
        }, () => this.setState({ shouldRerender: false }))
    }

    onIntervalSelected = (value) => {
        const data = {...this.state.data} 
        const index = Object.keys(data).length;

        data[index] = {
            value,
            type: Types.INTERVAL
        }

        this.setState({
            showIntervalPicker: false,
            data,
            shouldRerender: true
        }, () => this.setState({shouldRerender: false}))
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
        const order = this.state.order

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
        } else {
            this.setState({data})
        }

        this.setState({isMounted: false}, () => this.setState({isMounted: true}))
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
        const exercise = props.exercises.exercises.find(item => item.id === props.id) || {title: '', data: {}}
        this.state = {
            showPracticePicker: false,
            showIntervalPicker: false,
            title: exercise.title,
            data: exercise.data,
            scrollEnabled: true,
            isMounted: false
        }
    }

    componentDidMount() {
        Actions.refresh(Object.assign({
            renderLeftButton: this.renderLeftButton,
            renderRightButton: this.renderRightButton,
            onBack: this.onBack,
            navigationBarStyle: styles.navbar
        }, this.props.id ? {renderBackButton: this.renderBackButton} : {}))
        this.setState({isMounted: true})
    }

    render() {
        const {
            title,
            data,
            isMounted,
            shouldRerender
        } = this.state

        const items = Object.assign([], data)
        const lastItem = items[items.length-1]
        const isIntervalLastItem = lastItem ? lastItem.type === Types.INTERVAL : false

        if (!isMounted || shouldRerender) return null 

        return (
            <View style={styles.scene}>
                <View style={styles.title}>
                    <TextInput
                        editable
                        style={styles.input}
                        placeholder="Type here to set name of exercise"
                        onChangeText={this.onTitleChange}
                        value={title}
                    />
                </View>

                {Object.keys(data).length !== 0 &&
                    <View style={styles.wrapper}>
                        <View style={styles.container}>
                            <SortableList
                                contentContainerStyle={styles.content}
                                data={data}
                                renderRow={({data, active, index}) => this.renderRow(data, index, active)}
                                onChangeOrder={(order) => this.setState({order})}
                                onReleaseRow={() => this.onOrderChange()}
                            />
                        </View>
                    </View>
                }

                <ActionButton buttonColor="rgba(231,76,60,1)">
                    <ActionButton.Item buttonColor='#9b59b6' title="Practice" onPress={() => this.setState({showPracticePicker: true})}>
                        <Ionicons name="ios-body" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item 
                        buttonColor='#3498db'
                        title="Pause"
                        onPress={() => this.setState({showIntervalPicker: true})}
                        disabled={isIntervalLastItem}>
                        <Ionicons name="md-pause" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
                
                <CustomPicker
                    visible={this.state.showPracticePicker}
                    onCancel={() => this.setState({showPracticePicker: false})}
                    onSelect={this.onPracticeSelected}
                    current={this.props.practices.practices[0].id}
                >
                    <PracticePicker items={this.props.practices.practices} />
                </CustomPicker>
                
                <CustomPicker
                    visible={this.state.showIntervalPicker}
                    onCancel={() => this.setState({showIntervalPicker: false})}
                    onSelect={this.onIntervalSelected}
                >
                    <IntervalPicker />
                </CustomPicker>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#f9bb2d',
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
        marginVertical: 5
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
        flex: 1,
        maxHeight: 60
    },
    input: {
        height: 60
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    content: {
        width: SCREEN_WIDTH - 10,
    },
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    scene: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 60,
        padding: 5
    },
    itemButton: {
        color: '#fc3d39'
    },
    playButton: {
        marginTop: 2,
        paddingLeft: 4
    },
    picker: {
        width: SCREEN_WIDTH
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    row: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 16,
        marginVertical: 1,
        height: 80,
        width: SCREEN_WIDTH - 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#eee',
        borderBottomColor: '#eee'
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white'
    }
})

export default connect(
    state => {
        const {exercises, practices} = state
        return {exercises, practices}
    },
    dispatch => bindActionCreators(exercisesActions, dispatch)
)(Exercise)
