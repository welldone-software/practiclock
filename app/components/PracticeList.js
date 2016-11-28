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
    View
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SortableList from 'react-native-sortable-list'
import {practices as practicesActions} from '../store/actions'

const SCREEN_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#66bb6a',
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: {
            height: 4, 
            width: 2
        },
        borderBottomWidth: 0
    },
    title: {
        color: '#108043'
    },
    buttonCreate: {
        color: '#108043'
    },
    list: {
        marginTop: 64,
        flex: 1
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
    button: {
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 26,
        paddingRight: 26,
        color: '#fff'
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
            <TouchableOpacity onPress={Actions.practiceCreate} style={styles.button}>
                <Ionicons name="md-add" size={34} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.text}>CREATE YOUR FIRST PRACTICE</Text>
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
            duration,
            repeat,
            sound
        } = this.props

        return (
            <Animated.View 
                style={[
                    styles.row,
                    this.state.style,
                ]}
            >
                <View style={styles.rowContent}>
                    <Ionicons name="md-more" size={20} style={styles.rowOrderButton}/>
                    <TouchableOpacity onPress={() => Actions.practiceView({id})} style={styles.rowButton}>
                        <Text style={styles.rowTitle}>{title}</Text>
                        <View style={styles.rowInfoContainer}>
                            <View style={styles.rowInfoGroup}>
                                <Text style={styles.rowInfoLable}>Duration:</Text>
                                <Text style={styles.rowInfoText}>{duration === 60 ? '1 h' : duration + ' min' }</Text>
                            </View>
                            <View style={styles.rowInfoGroup}>
                                <Text style={styles.rowInfoLable}>Repeat:</Text>
                                <Text style={styles.rowInfoText}>{repeat}</Text>
                            </View>
                            <View style={styles.rowInfoGroup}>
                                <Text style={styles.rowInfoLable}>Sound:</Text>
                                <Text style={styles.rowInfoText}>{sound}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )
    }
}

class PracticeList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isMounted: false,
            practices: props.practices
        }
    }

    componentDidMount() {
        Actions.refresh({
            renderRightButton: this.renderRightButton,
            navigationBarStyle: styles.navbar,
            titleStyle: styles.title,
            hideNavBar: !Boolean(this.props.practices.length)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({practices: nextProps.practices})

        if (JSON.stringify(nextProps) === JSON.stringify(this.props)) return
        this.setState({isMounted: false}, () => {
            Actions.refresh({
                renderRightButton: this.renderRightButton,
                navigationBarStyle: styles.navbar,
                titleStyle: styles.title,
                hideNavBar: !Boolean(nextProps.practices.length)
            })
            this.setState({isMounted: true})
        })
    }

    renderRightButton = () => {
        return (
            <TouchableOpacity onPress={Actions.practiceCreate}>
                <Ionicons name="md-add" size={20} style={styles.buttonCreate}/>
            </TouchableOpacity>
        )
    }

    onOrderChange = () => {
        const order = this.state.order
        if (!order) return
        const tmp = {...this.props.practices}
        const practices = Object.assign([], order.map(key => tmp[key]))
        this.setState({order: null}, () => {
            setTimeout(() => this.props.order(practices), 300)
        })
    }

    render() {
        const {
            isMounted,
            practices
        } = this.state

        if (!isMounted) return null 

        if (practices.length) {
            const data = Object.assign({}, practices)
            return (
                <View style={styles.container}>
                    <SortableList
                            contentContainerStyle={styles.contentContainer}
                            data={data}
                            renderRow={({data}) => (<Row {...data}/>)}
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
    state => state.practices,
    dispatch => bindActionCreators(practicesActions, dispatch)
)(PracticeList)
