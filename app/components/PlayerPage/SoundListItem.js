//@flow
import React from 'react'
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native'

export default props => {

    let color = props.toHighlight ? 'white' : 'black';
    let backgroundColor = props.toHighlight ? '#24CB58' : '#EAFFFC';
    let durationText = props.toHighlight ? {color: 'white', fontWeight: 'bold'} : {}

    const styles = StyleSheet.create({
        TouchableOpacity: {
            marginBottom: 3,
            paddingLeft: 15,
            paddingRight: 15,
            height: 60,
            flexDirection: 'column',
            justifyContent: 'space-around',
            backgroundColor
        },
        nameText: {fontSize: 18, fontWeight: 'bold', color},
        durationText: Object.assign({fontSize: 16}, durationText),
        subText: Object.assign({fontSize: 14, marginTop: -25}, durationText)
    })

    return (
        <TouchableOpacity onPress={ props.onPress } style={ styles.TouchableOpacity }>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={ styles.nameText }>{ props.title }</Text>
                <Text style={ styles.durationText }>{ props.duration }s x { props.repeat }</Text>
            </View>
            <Text style={ styles.subText }>{ props.name }</Text>
        </TouchableOpacity>
    )
}