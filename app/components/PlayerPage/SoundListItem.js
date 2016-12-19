//@flow
import React from 'react'
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet
} from 'react-native'
import SvgIndicator from './SvgIndicator'

export default props => {
    let color = props.toHighlight ? 'white' : 'black';
    let backgroundColor = props.toHighlight ? '#24CB58' : '#EAFFFC';

    const styles = StyleSheet.create({
        container: {
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 15,
            paddingBottom: 15,
            flexDirection: 'column',
            justifyContent: 'space-around',
            borderBottomWidth: 1,
            borderBottomColor: '#EFF0F0'
        },
        content: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        subText: {
            fontSize: 18,
            color: '#6C8993'
        }
    })

    const percent = isNaN(props.percent) ? 0 : props.percent

    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={[
                styles.container,
                {
                    backgroundColor: props.active ? '#F3F6F6' : '#fff',
                    height: props.type === 'pause' ? 60 : 100
                }
            ]}
            activeOpacity={1}
        >
            <View style={styles.content}>
                <Text style={styles.subText}>{props.title}</Text>
                {props.active && !isNaN(props.remain) && props.remain !== 0 &&
                    <Text style={styles.subText}>{props.remain} s</Text>
                }
            </View>
            {props.type !== 'pause' &&
                <SvgIndicator time={props.active ? percent : 0} active={props.active}/>
            }
        </TouchableOpacity>
    )
}
