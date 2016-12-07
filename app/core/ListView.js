//@flow
import React, {Component, PropTypes} from 'react'
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import SortableList from 'react-native-sortable-list'

const SCREEN_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60
    },
    container: {
        width: SCREEN_WIDTH
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        width: SCREEN_WIDTH,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    activeRow: {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: {
            height: 1,
            width: 0
        }
    },
    content: {
        width: SCREEN_WIDTH,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    orderButton: {
        height: 80,
        paddingTop: 30,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 30,
        color: '#ccc'
    },
    orderButtonContainer: {
        height: 80
    }
})

class Row extends Component {
    static propTypes = {
        editMode: PropTypes.bool,
        active: PropTypes.bool,
        content: PropTypes.element.isRequired
    }

    static defaultProps = {
        editMode: false,
        active: false
    }

    state = {
        row: {
            shadowRadius: new Animated.Value(2),
            transform: [{scale: new Animated.Value(1)}]
        },
        orderButtonContainer: {
            width: new Animated.Value(0),
            opacity: new Animated.Value(0)
        }
    }

    constructor(props) {
        super(props)
        if (props.editMode) this.toggleMode(props.editMode)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.active !== nextProps.active) {
            if (nextProps.active) {
                this.startDragAnimation()
            } else {
                this.startDropAnimation()
            }
        }

        if (this.props.editMode !== nextProps.editMode) {
            this.toggleMode(nextProps.editMode)
        }
    }

    toggleMode(editMode) {
        if (editMode) {
            this.startEditModeAnimation()
        } else {
            this.endEditModeAnimation()
        }
    }

    startEditModeAnimation = () => {
        const {width, opacity} = this.state.orderButtonContainer
        width.setValue(0)
        Animated.parallel([
            Animated.sequence([
                Animated.timing(width, {
                    duration: 200,
                    easing: Easing.out(Easing.quad),
                    toValue: 30
                }),
                Animated.timing(opacity, {
                    duration: 200,
                    easing: Easing.out(Easing.quad),
                    toValue: 1
                })
            ])
        ]).start()
    }

    endEditModeAnimation = () => {
        const {width, opacity} = this.state.orderButtonContainer
        Animated.parallel([
            Animated.sequence([
                Animated.timing(opacity, {
                    duration: 200,
                    easing: Easing.out(Easing.quad),
                    toValue: 0
                }),
                Animated.timing(width, {
                    duration: 200,
                    easing: Easing.out(Easing.quad),
                    toValue: 0
                })
            ])
        ]).start()
    }

    startDragAnimation = () => {
        const {transform, shadowRadius} = this.state.row

        Animated.parallel([
            Animated.timing(transform[0].scale, {
                duration: 100,
                easing: Easing.out(Easing.quad),
                toValue: 1.1
            }),
            Animated.timing(shadowRadius, {
                duration: 100,
                easing: Easing.out(Easing.quad),
                toValue: 10
            })
        ]).start()
    }

    startDropAnimation = () => {
        const {transform, shadowRadius} = this.state.row

        Animated.parallel([
            Animated.timing(transform[0].scale, {
                duration: 100,
                easing: Easing.out(Easing.quad),
                toValue: 1
            }),
            Animated.timing(shadowRadius, {
                duration: 100,
                easing: Easing.out(Easing.quad),
                toValue: 2
            })
        ]).start()
    }

    render() {
        const {
            active,
            content,
            data,
            editMode
        } = this.props

        return (
            <Animated.View style={[styles.row, this.state.row, active ? styles.activeRow : {}]}>
                <View style={styles.content}>
                    <Animated.View style={[styles.orderButtonContainer, this.state.orderButtonContainer]}>
                        <Icon name="md-more" size={20} style={styles.orderButton}/>
                    </Animated.View>
                    {React.Children.map(content, child => React.cloneElement(child, {data, editMode}))}
                </View>
            </Animated.View>
        )
    }
}

export default class ListView extends Component {
    static propTypes = {
        editMode: PropTypes.bool,
        mounted: PropTypes.bool,
        items: PropTypes.array,
        emptyView: PropTypes.element,
        onOrderChange: PropTypes.func.isRequired
    }

    static defaultProps = {
        editMode: false,
        mounted: false,
        items: [],
        emptyView: null,
    }

    constructor(props) {
        super(props)
        this.state = {
            order: null
        }
    }

    onOrderChange = () => {
        const order = this.state.order
        if (!order) return
        const tmp = {...this.props.items}
        const items = Object.assign([], order.map(key => tmp[key]))
        this.setState({order: null})
        this.props.onOrderChange(items)
    }

    renderRow = ({data, active}) => {
        const {
            children,
            editMode,
        } = this.props

        return (
            <Row 
                data={data} 
                active={active}
                editMode={editMode}
                content={children}
            />
        )
    }

    render () {
        const {
            items,
            emptyView,
            editMode,
            mounted
        } = this.props

        if (!mounted) return null
        if (!items.length) return emptyView

        const data = Object.assign({}, items)

        return (
            <View style={styles.wrapper}>
                <SortableList
                    contentContainerStyle={styles.container}
                    sortingEnabled={editMode}
                    data={data}
                    renderRow={this.renderRow}
                    onChangeOrder={order => this.setState({order})}
                    onReleaseRow={this.onOrderChange}
                    enableEmptySections
                />
            </View>
        )
    }
}
