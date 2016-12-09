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
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    slider: {
        marginTop: 16,
        width: width-40
    },
    preview: {
        fontSize: 18,
        color: '#6C8993'
    }
})

export default ({current = 0, onChange}) => {
    const min = Math.round((current/1000/60) << 0 || 0)
    const sec = Math.round((current/1000)%60) || '00'
    return (
        <View>
            <View style={styles.wrapper}>
                <Text style={styles.preview}>Pause</Text>
                <Text style={styles.preview}>{min}:{sec}</Text>
            </View>
            <View>
                <Slider
                    minimumValue={0}
                    maximumValue={180}
                    step={1}
                    style={styles.slider}
                    onValueChange={value => onChange(value*5*1000)}
                />
            </View>
        </View>
    )
}
