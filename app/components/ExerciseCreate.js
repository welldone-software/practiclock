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
import {exercises as exercisesActions} from '../store/actions'

const SCREEN_WIDTH = Dimensions.get('window').width

class PracticePicker extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
        selected: PropTypes.number,
        visible: PropTypes.bool,
        onCancel: PropTypes.func,
        onSelect: PropTypes.func
    }

    onSelectValue = selected => this.setState({selected})

    constructor(props) {
        super(props)
        this.state = {
            selected: props.selected
        }
    }

    componentWillReceiveProps(props) {
        this.setState({selected: props.selected})
    }

    render() {
        const {items, visible, onCancel, onSelect} = this.props
        const {selected} = this.state
        return (
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={visible}>
                <View style={styles.pickerContainer}>
                    <View style={styles.pickerWrapper}>
                        <View style={styles.pickerButtons}>
                            <TouchableOpacity onPress={onCancel}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onSelect(selected)}>
                                <Text>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Picker
                                style={styles.picker}
                                selectedValue={selected}
                                onValueChange={(value) => this.onSelectValue(value)}
                                mode="dropdown"
                            >
                                {items.map(item => <Picker.Item label={item.title} value={item.id} key={item.id}/>)}
                            </Picker>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const ItemComponent = ({data}) => {
    console.log(1)
    return <Text>Test</Text>
}

class ExerciseCreate extends Component {
    onTitleChange = title => this.setState({title})

    onSubmit = () => {
        const {title} = this.state
        this.props.exercises.add({title})
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

    onPracticeSelected = (id) => {
        // const practice = this.props.practices.practices.find(item => item.id === id)
        this._data = [...this._data, id]
        this.setState({
            showPracticePicker: false, 
            data: this.state.data.cloneWithRows([...this.state.data, id])
        })
    }

    onAddPause = () => {}

    _data = [1, 2]

    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {
            showPracticePicker: false,
            title: '',
            data: ds.cloneWithRows([1,2])
        }
    }

    componentDidMount() {
        Actions.refresh({
            renderLeftButton: this.renderLeftButton,
            renderRightButton: this.renderRightButton
        })
    }

    render() {
        const {title, selectedPractice, data} = this.state
        return (
            <View style={styles.scene}>
                <View style={styles.formSection}>
                    <Text style={styles.formLabel}>Title</Text>
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
                        style={styles.list}
                        dataSource={data}
                        renderRow={row => <ItemComponent data={row}/>}
                    />
                </View>
                <View style={styles.formSection}>
                    <TouchableOpacity onPress={() => this.setState({showPracticePicker: true})}>
                        <Text>Add practice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onAddPause}>
                        <Text>Add pause</Text>
                    </TouchableOpacity>
                </View>
                <PracticePicker 
                    items={this.props.practices.practices}
                    visible={this.state.showPracticePicker}
                    onCancel={() => this.setState({showPracticePicker: false})}
                    onSelect={this.onPracticeSelected}
                />
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
    titleInput: {
        height: 60
    },
    list: {
        // flex: 1
    },
    picker: {
        width: SCREEN_WIDTH
    },
    pickerContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    pickerWrapper: {
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0
    },
    pickerButtons: {
        width: SCREEN_WIDTH,
        padding: 8,
        borderTopWidth: 0.5,
        borderTopColor: 'lightgrey',
        justifyContent: 'space-between',
        flexDirection:'row'
    },
    scene: {
        flex: 1,
        marginTop: 60,
        padding: 10
    }
})

export default connect(
    state => {
        const {exercises, practices} = state
        return {exercises, practices}
    },
    dispatch => bindActionCreators(exercisesActions, dispatch)
)(ExerciseCreate)