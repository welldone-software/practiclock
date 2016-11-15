//@flow
import React, {Component, PropTypes} from 'react'
import {
    Dimensions,
    ListView,
    Modal,
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
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SwipeOut from 'react-native-swipeout'
import CustomPicker from '../core/CustomPicker'
import {exercises as exercisesActions} from '../store/actions'

const SCREEN_WIDTH = Dimensions.get('window').width

const Types = {
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

const Item = ({index, data, onDeleteButtonPress, onSwipe, close, onScroll}) => {
    const styles = StyleSheet.create({
        wrapper: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        buttons: {
            paddingTop: 24,
            paddingBottom: 24,
            paddingLeft: 26,
            paddingRight: 26,
            color: '#FFF'
        }
    })

    const buttons = [
        {
            component: <FontAwesome name="trash" size={25} style={styles.buttons} />,
            color: '#FC3D39',
            backgroundColor: 'red',
            onPress: () => onDeleteButtonPress(index)
        }
    ]

    return (
        <SwipeOut
            right={buttons}
            autoClose
            backgroundColor="#FFF"
            onOpen={() => onSwipe(index)}
            close={close}
            scroll={onScroll}
        >
            <View styles={styles.item}>
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
        </SwipeOut>
    )
}

class Exercise extends Component {
    onTitleChange = title => this.setState({title})

    _data = []

    onSwipeItem = (index) => {
        this.setState({
            swipeActiveIndex: index,
            data: this.state.data.cloneWithRows(this._data)
        })
    }

    onDeleteButtonPress = (index) => {
        this._data = this._data.filter((_, i) => i !== index)

        this.setState({
            swipeActiveIndex: null,
            scrollEnabled: true,
            data: this.state.data.cloneWithRows(this._data)
        })
    }

    onSwipe = (index) => {
        this.setState({
            swipeActiveIndex: index,
            data: this.state.data.cloneWithRows(this._data)
        })
    }

    onScroll = (scrollEnabled) => {
        this.setState({scrollEnabled})
    }

    onSubmit = () => {
        const {title} = this.state
        this.props.add({title, data: this._data})
        Actions.pop()
    }

    onBack = () => {
        const {title} = this.state
        this.props.edit(this.props.id, {title, data: this._data})
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

    onPracticeSelected = (id) => {
        this._data = this._data.concat({
            id: id,
            type: Types.PRACTICE
        })

        this.setState({
            showPracticePicker: false, 
            data: this.state.data.cloneWithRows(this._data)
        })
    }

    onIntervalSelected = (value) => {
        this._data = this._data.concat({
            value,
            type: Types.INTERVAL
        })

        this.setState({
            showIntervalPicker: false, 
            data: this.state.data.cloneWithRows(this._data)
        })
    }

    renderRow = (data, index) => {
        let item

        switch (data.type) {
            case Types.INTERVAL:
                item = data
                break
            case Types.PRACTICE:
                item = this.props.practices.practices.find(item => item.id === data.id)
                break
        }

        item = Object.assign({}, item, { type: data.type })
        
        return (
            <Item
                index={index}
                data={item}
                onSwipe={this.onSwipe}
                onScroll={this.onScroll}
                onDeleteButtonPress={this.onDeleteButtonPress}
                close={this.state.swipeActiveIndex !== index}
            />
        )
    }

    constructor(props) {
        super(props)

        const exercise = props.exercises.exercises.find(item => item.id === props.id)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 || this.state.scrollEnabled})
        this.state = {
            showPracticePicker: false,
            showIntervalPicker: false,
            title: exercise ? exercise.title : '',
            data: ds.cloneWithRows(exercise ? exercise.data : this._data),
            scrollEnabled: true
        }
    }

    componentDidMount() {
        Actions.refresh({
            renderLeftButton: this.renderLeftButton,
            renderRightButton: this.renderRightButton,
            onBack: this.onBack
        })
    }

    render() {
        const {title, selectedPractice, data} = this.state
        return (
            <View style={styles.scene}>
                <View style={styles.formSection}>
                    <TextInput
                        editable
                        style={styles.titleInput}
                        placeholder="Type here to set name of exercise"
                        onChangeText={this.onTitleChange}
                        value={title}
                    />
                </View>
                <View style={styles.formSection}>
                    <ListView
                        enableEmptySections={true}
                        style={styles.list}
                        dataSource={data}
                        renderRow={(data, _, index) => this.renderRow(data, Number(index))}
                    />
                </View>
                <View style={styles.formSection}>
                    <TouchableOpacity onPress={() => this.setState({showPracticePicker: true})}>
                        <Text>Add practice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({showIntervalPicker: true})}>
                        <Text>Add pause</Text>
                    </TouchableOpacity>
                </View>

                <CustomPicker
                    visible={this.state.showPracticePicker}
                    onCancel={() => this.setState({showPracticePicker: false})}
                    onSelect={this.onPracticeSelected}
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
    titleInput: {
        height: 60
    },
    list: {
        // flex: 1
    },
    scene: {
        flex: 1,
        marginTop: 60,
        padding: 10
    },
    picker: {
        width: SCREEN_WIDTH
    },
    item: {
        flex: 1,
        padding: 25,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF'
    }
})

export default connect(
    state => {
        const {exercises, practices} = state
        return {exercises, practices}
    },
    dispatch => bindActionCreators(exercisesActions, dispatch)
)(Exercise)