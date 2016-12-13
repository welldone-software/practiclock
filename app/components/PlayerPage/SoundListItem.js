//@flow
import React from 'react'
import {TouchableOpacity, Text, StyleSheet} from 'react-native'

export default props => {

    let color = props.toHighlight ? 'white' : 'black';
    let backgroundColor = props.toHighlight ? '#24CB58' : '#EAFFFC';
    let durationText = props.toHighlight ? {color: 'white', fontWeight: 'bold'} : {}

    const styles = StyleSheet.create({
        TouchableOpacity: {
            marginBottom: 3,
            paddingLeft: 15,
            paddingRight: 15,
            height: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor
        },
        nameText: {fontSize: 18, fontWeight: 'bold', color},
        durationText: Object.assign({fontSize: 16}, durationText)
    })

    return (
        <TouchableOpacity onPress={ props.onPress } style={ styles.TouchableOpacity }>
            <Text style={ styles.nameText }>{ props.name }</Text>
            <Text style={ styles.durationText }>
                { props.duration }s x { props.repeat }
            </Text>
        </TouchableOpacity>
    )
}