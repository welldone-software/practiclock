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
import Icon from 'react-native-vector-icons/Ionicons'
import Button from './Button'

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
    children: {
        height: 80,
        paddingTop: 16,
        paddingRight: 16,
        paddingBottom: 16,
        width: width-20
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


export default ({data, editMode, onDelete}) => {
    const {
        id,
        title,
        onPlay,
        duration,
        repeat,
        isPlaying
    } = data

    const Wrapper = editMode ? View : TouchableOpacity

    return (
        <Wrapper 
            onPress={() => {
                if (!editMode) Actions.practiceView({id}) 
            }} 
            activeOpacity={1}
            style={styles.children}
        >

         <Text style={styles.title}>{title}</Text>
            <View style={styles.info}>
                <View style={styles.group}>
                    <Text style={styles.label}>DURATION:</Text>
                    <Text style={styles.text}>{duration} MIN</Text>
                </View>
                <View style={styles.group}>
                    <Text style={styles.label}>REPEAT:</Text>
                    <Text style={styles.text}>{repeat}</Text>
                </View>
            </View>
            <View style={styles.button}>
                <Button 
                    editMode={editMode}
                    file={data}
                    onPlay={onPlay}
                    isPlaying={isPlaying}
                    onDelete={() => onDelete(id)}
                />
            </View>
        </Wrapper>
    )
}