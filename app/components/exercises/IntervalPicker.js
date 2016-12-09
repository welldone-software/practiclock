//@flow
import React, {Component} from 'react'
import {
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native'
import Slider from 'react-native-slider'

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    slider: {
        marginTop: 10,
        width: width-40
    },
    preview: {
        fontSize: 18,
        color: '#6C8993'
    },
    track: {
        height: 2,
        borderRadius: 1,
        backgroundColor: '#CBD3D8',
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#6C8993'
    }
})

export default ({current = 0, onChange}) => {
    const min = Math.round((current/1000/60) << 0 || 0)
    const sec = Math.round((current/1000)%60) || '00'
    return (
        <View>
            <View style={styles.wrapper}>
                <Text style={styles.preview}>{min}:{sec}</Text>
            </View>
            <View  style={styles.slider}>
                <Slider
                    value={current/5/1000}
                    onValueChange={value => onChange(value*5*1000)}
                    minimumValue={0}
                    maximumValue={180}
                    step={1}
                    trackStyle={styles.track}
                    thumbStyle={styles.thumb}
                    minimumTrackTintColor='#6C8993'
                />
            </View>
        </View>
    )
}
