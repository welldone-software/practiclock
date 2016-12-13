//@flow
import React, {Component} from 'react'
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import PlayEditDeleteButton from '../PlayerEditDeleteButton/PlayEditDeleteButton'
import {Types} from './Item'

require('moment-duration-format')

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
    children: {
        height: 80,
        paddingTop: 16,
        paddingRight: 16,
        paddingBottom: 16,
        width: width - 20
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6C8993'
    },
    info: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    group: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        color: '#75949A'
    },
    text: {
        marginLeft: 2,
        fontSize: 10,
        fontWeight: '600',
        color: '#75949A'
    },
    button: {
        position: 'absolute',
        top: 30,
        right: 10,
        width: 30,
        height: 30
    }
})

export default ({data, editMode, practices, onDelete}) => {
    const {
        id,
        title
    } = data

    let currentPractices = Object.assign([], data.data).filter(item => item.type === Types.PRACTICE).map((item) => {
        return practices.find(practice => practice.id === item.id)
    })
    const amountOfPractices = currentPractices.length
    const duration = Object.assign([], data.data).map(item => {
        switch (item.type) {
            case Types.PRACTICE:
                const practice = practices.find(practice => practice.id === item.id)
                return practice.duration * practice.repeat
            case Types.INTERVAL:
                return item.value
        }
    }).reduce((a, b) => a + b, 0)
    const min = Math.round((duration / 1000 / 60) << 0 || 0)
    const sec = Math.round((duration / 1000) % 60) || '00'
    const Wrapper = editMode ? View : TouchableOpacity

    return (
        <Wrapper
            onPress={() => {
                if (!editMode) Actions.exerciseView({id})
            }}
            activeOpacity={1}
            style={styles.children}
        >

            <Text style={styles.title}>{title}</Text>
            <View style={styles.info}>
                <View style={styles.group}>
                    <Text style={styles.label}>PRACTICES:</Text>
                    <Text style={styles.text}>{amountOfPractices}</Text>
                </View>
                <View style={styles.group}>
                    <Text style={styles.label}>DURATION:</Text>
                    <Text style={styles.text}>{min}:{sec}</Text>
                </View>
            </View>
            <View style={styles.button}>
                <PlayEditDeleteButton
                    editMode={editMode}
                    onDelete={() => onDelete(id)} type='exercises' id={id}
                />
            </View>
        </Wrapper>
    )
}
