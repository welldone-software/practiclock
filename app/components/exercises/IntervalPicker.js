//@flow
import React, {Component} from 'react'
import {
    Dimensions,
    Slider,
    StyleSheet,
    Text,
    View
} from 'react-native'

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: width
    },
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    slider: {
        marginTop: 16,
        width: width
    },
    preview: {
        fontSize: 18
    }
})

export default ({current = 0, onChange}) => (
    <View>
        <View style={styles.wrapper}>
            <Text style={styles.preview}>Pause</Text>
            <Text style={styles.preview}>{current}</Text>
        </View>
        <View>
            <Slider
                style={styles.slider}
                onValueChange={value => onChange(value)}
            />
        </View>
    </View>
)
