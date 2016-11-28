//@flow
import React, {Component} from 'react'
import {
    Animated,
    Dimensions,
    Easing,
    ListView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SortableList from 'react-native-sortable-list'
import moment from 'moment'
import {exercises as exercisesActions} from '../store/actions'
import {Types} from './Exercise'

require('moment-duration-format')

const SCREEN_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#34b6f2',
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: {
            height: 4, 
            width: 2
        },
        borderBottomWidth: 0
    },
    title: {
        color: '#0c5999'
    },
    buttonCreate: {
        color: '#0c5999'
    },
    list: {
        marginTop: 64
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        width: SCREEN_WIDTH,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: '600'
    },
    rowContent: {
        width: SCREEN_WIDTH,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowOrderButton: {
        width: 20,
        height: 90,
        paddingTop: 30,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 30,
        color: '#ccc'
    },
    rowButton: {
        height: 90,
        paddingTop: 16,
        paddingRight: 16,
        paddingBottom: 16,
        width: SCREEN_WIDTH - 20
    },
    rowInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowInfoGroup: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    rowInfoLable: {
        fontSize: 14,
        fontWeight: '400'
    },
    rowInfoText: {
        marginLeft: 2,
        fontSize: 14,
        color: '#ccc'
    },
    text: {
        marginLeft: 12,
        fontSize: 16,
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#eee',
    },
    button: {
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 26,
        paddingRight: 26,
        color: '#FFF'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60
    },
    contentContainer: {
        width: SCREEN_WIDTH
    }
})

const NoPracticeScreen = (props) => {
    const styles = StyleSheet.create({
         scene: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#eee'
        },
        text: {
            marginTop: 20,
            color: '#6d6d6d',
            fontSize: 10
        }
    })

    return (
        <View style={styles.scene}>
            <Text style={styles.text}>PLEASE CREATE AT LEAST ONE PRACTICE FIRST</Text>
        </View>
    )
}

const Empty = (props) => {
    const styles = StyleSheet.create({
         scene: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#eee'
        },
        button: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            maxHeight: 80,
            borderRadius: 40,
            backgroundColor: '#fff',
            shadowColor: 'rgba(0,0,0,0.2)',
            shadowOpacity: 1,
            shadowOffset: {
                height: 2, 
                width: 0
            },
            shadowRadius: 5 
        },
        icon: {
            color: '#6d6d6d'
        },
        text: {
            marginTop: 20,
            color: '#6d6d6d',
            fontSize: 10
        }
    })

    return (
        <View style={styles.scene}>
            <TouchableOpacity onPress={Actions.exerciseCreate} style={styles.button}>
                <Ionicons name="md-add" size={34} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.text}>CREATE YOUR FIRST EXERCISE</Text>
        </View>
    )
}

class Row extends Component {
    state = {
        style: {
            shadowRadius: new Animated.Value(2),
            transform: [{scale: new Animated.Value(1)}],
            shadowColor: 'rgba(0,0,0,0.2)',
            shadowOpacity: 1,
            shadowOffset: {
                height: 1,
                width: 0
            }
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
            Animated.timing(style.shadowRadius, {
                duration: 100,
                easing: Easing.out(Easing.quad),
                toValue: 10
            })
        ]).start()
    }

    startDeactivationAnimation = () => {
        const {style} = this.state

        Animated.parallel([
            Animated.timing(style.transform[0].scale, {
                duration: 100,
                easing: Easing.out(Easing.quad),
                toValue: 1
            }),
            Animated.timing(style.shadowRadius, {
                duration: 100,
                easing: Easing.out(Easing.quad),
                toValue: 2
            })
        ]).start()
    }

    render() {
        const {
            id,
            title,
            data,
            practices
        } = this.props

        const amountOfPractices = Object.assign([], data).filter(item => item.type === Types.PRACTICE).length
        const duration = moment.duration(
            Object.assign([], data).map(item => {
                switch(item.type) {
                    case Types.PRACTICE:
                        const practice = practices.find(practice => practice.id === item.id)
                        return practice.duration*practice.repeat
                    case Types.INTERVAL:
                        return item.value
                }
            }).reduce((a, b) => a+b, 0),
        'minutes')

        return (
            <Animated.View 
                style={[
                    styles.row,
                    this.state.style,
                ]}
            >
                <View style={styles.rowContent}>
                    <Ionicons name="md-more" size={20} style={styles.rowOrderButton}/>
                    <TouchableOpacity onPress={() => Actions.exerciseView({id})} style={styles.rowButton}>
                        <Text style={styles.rowTitle}>{title}</Text>
                        <View style={styles.rowInfoContainer}>
                            <View style={styles.rowInfoGroup}>
                                <Text style={styles.rowInfoLable}>Practicies:</Text>
                                <Text style={styles.rowInfoText}>{amountOfPractices}</Text>
                            </View>
                            <View style={styles.rowInfoGroup}>
                                <Text style={styles.rowInfoLable}>Duration:</Text>
                                <Text style={styles.rowInfoText}>{duration.format('hh:mm', {forceLength: true, trim: false})}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )
    }
}

class ExerciseList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isMounted: false,
            exercises: props.exercises.exercises,
            practices: props.practices.practices
        }
    }

    componentWillReceiveProps(nextProps) {
        const {exercises, practices} = nextProps
        this.setState({exercises: exercises.exercises, practices: practices.practices})
        if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
            this.setState({isMounted: false}, () => {
                Actions.refresh({
                    renderRightButton: this.renderRightButton,
                    navigationBarStyle: styles.navbar,
                    titleStyle: styles.title,
                    hideNavBar: !Boolean(exercises.exercises.length) || !Boolean(practices.practices.length)
                })
                this.setState({isMounted: true})
            })
        }
    }

    componentDidMount() {
        const {exercises, practices} = this.props
        this.setState({isMounted: false}, () => {
            Actions.refresh({
                renderRightButton: this.renderRightButton,
                navigationBarStyle: styles.navbar,
                titleStyle: styles.title,
                hideNavBar: !Boolean(exercises.exercises.length) || !Boolean(practices.practices.length)
            })
            this.setState({isMounted: true})
        })
    }

    renderRightButton = () => {
        return (
            <TouchableOpacity onPress={Actions.exerciseCreate}>
                <Ionicons name="md-add" size={20} style={styles.buttonCreate} />
            </TouchableOpacity>
        )
    }

    onOrderChange = () => {
        const order = this.state.order
        if (!order) return
        const tmp = {...this.props.exercises.exercises}
        const exercises = Object.assign([], order.map(key => tmp[key]))
        this.setState({order: null}, () => {
            setTimeout(() => this.props.order(exercises), 300)
        })
    }

    render() {
        const {
            exercises,
            practices,
            isMounted
        } = this.state

        if (!isMounted) return null

        if (!practices.length) {
            return <NoPracticeScreen />
        }

        if (exercises.length) {
            const data = Object.assign({}, exercises)
            return (
                <View style={styles.container}>
                    <SortableList
                            contentContainerStyle={styles.contentContainer}
                            data={data}
                            renderRow={({data}) => (<Row {...data} practices={practices}/>)}
                            onChangeOrder={(order) => this.setState({order})}
                            onReleaseRow={() => this.onOrderChange()}
                            enableEmptySections
                        />
                </View>
            )
        } else {
            return <Empty />
        }
    }
}

export default connect(
    state => {
        const {exercises, practices} = state
        return {exercises, practices}
    },
    dispatch => bindActionCreators(exercisesActions, dispatch)
)(ExerciseList)
