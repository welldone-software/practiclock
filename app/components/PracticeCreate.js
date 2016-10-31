import React, {Component} from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import {Actions} from 'react-native-router-flux'

var styles = StyleSheet.create({
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
    scene: {
        flex: 1,
        paddingTop: 20,
    }
})

export default class PracticeCreate extends Component {
    static renderLeftButton() {
        return (
            <TouchableOpacity style={styles.navBarLeftButton} onPress={Actions.practices}>
                <Text style={styles.navBarText}>Cancel</Text>
            </TouchableOpacity>
        )
    }

    static renderRightButton() {
        return (
            <TouchableOpacity style={styles.navBarRightButton} onPress={Actions.practices}>
                <Text style={styles.navBarText}>Create</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.scene}>
                <Text>FORM</Text>
            </View>
        )
    }
}