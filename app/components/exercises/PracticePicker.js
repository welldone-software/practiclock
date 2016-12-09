//@flow
import React, {Component} from 'react'
import {
    Dimensions,
    Picker,
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
    picker: {
        width: width/2
    }
})

export default ({items, current, onChange}) => (
    <View style={styles.container}>
        <Picker
            style={styles.picker}
            selectedValue={current}
            onValueChange={onChange}
            mode="dropdown"
        >
            {items.map(item => <Picker.Item label={item.title} value={item.id} key={item.id}/>)}
        </Picker>
    </View>
)
