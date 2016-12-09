//@flow
import React from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7F7F7'
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
        color: '#6C8993'
    },
    text: {
        marginTop: 20,
        color: '#6C8993',
        fontSize: 10
    }
})

export default (props) => {
    return (
        <View style={styles.scene}>
            <TouchableOpacity onPress={Actions.practiceCreate} style={styles.button}>
                <Icon name="md-add" size={34} style={styles.icon}/>
            </TouchableOpacity>
            <Text style={styles.text}>CREATE YOUR FIRST PRACTICE</Text>
        </View>
    )
}