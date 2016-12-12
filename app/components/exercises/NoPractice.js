//@flow
import React from 'react'
import {
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native'

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
    scene: {
        width,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7F7F7'
    },
    text: {
        marginTop: 20,
        color: '#6C8993',
        fontSize: 10
    }
})

export default () => (
    <View style={styles.scene}>
        <Text style={styles.text}>PLEASE CREATE AT LEAST ONE PRACTICE FIRST</Text>
    </View>
)
