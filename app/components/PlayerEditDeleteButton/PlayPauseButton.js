//@flow
import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {Actions} from 'react-native-router-flux'

const styles = StyleSheet.create({
    playerButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#24CB58',
        paddingLeft: 10,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4
    },
    playerIcon: {
        color: '#24CB58'
    }
})

export default class PlayPauseButton extends Component {
    render() {
        return (
            <View style={ this.props.style }>
                <TouchableOpacity onPress={ () => {
                    Actions.playerOpen({id: this.props.id + '-' + this.props.type})
                } } style={ styles.playerButton }>
                    <Icon name='ios-play-outline' size={ 20 } style={ styles.playerIcon }/>
                </TouchableOpacity>
            </View>
        )
    }
}
    