//@flow
import React, {Component} from 'react'
import {
    ART,
    View
} from 'react-native'
import Morph from 'art/morph/path'

const {
    Group,
    Surface,
    Shape
} = ART

export default class SvgIndicator extends Component {
    static defaultProps = {
        width: 375
    }

    state = {
        transition: Morph.Tween('M5,0 L5,100', 'M5,0 L5,100')
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.active) {
            const previous = this.props.width/0.4*(this.props.time || 0)
            const next = nextProps.width/0.4*(nextProps.time || 0)
            this.nextAnimation(previous, next)
        }
    }

    nextAnimation = (previous, next) => {
        this.setState({
            transition: Morph.Tween(`M${previous},0 L${previous},100`, `M${next},0 L${next},100`)
        })
    }

    render() {
        const {width} = this.props
        return (
            <View style={{transform: [{scale: 0.36}, {translateX: -width*0.4*2}]}}>
                <Surface height="100" width={width/0.4}>
                    <Group>
                        <Group>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item) => (
                                <Shape
                                    x={90*item}
                                    y={-0}
                                    key={item}
                                    d="M40,94c-2.4,0-3-1.5-4.4-43.6c-0.4-12.9-0.9-28-1.6-36.5c-0.5,6.3-0.9,16.1-1.2,24.6c-1.3,33.9-2,37.1-4.8,37.1  c-3.1,0-3.6-5.1-4.6-20.9c-0.3-5.5-0.8-13.3-1.6-16.4c-0.7,2.2-1.2,6.8-1.6,9.8c-0.9,8.3-1.5,12.4-4.3,12.4c-2.4,0-3.4-1.7-4-2.8  c-0.6-1.1-1-1.6-2-1.6H5c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5h5c2.8,0,3.9,1.8,4.6,3.1c0.5,0.8,0.7,1.2,1,1.3  c0.7-1.3,1.3-6.3,1.7-9.6c1-8.8,1.7-13.4,4.7-13.4c2.9,0,3.5,4.9,4.4,20.2c0.3,5.1,0.7,12.2,1.4,15.9c1-6,1.5-20.8,1.9-32.1  C30.9,7.5,31.4,5,34,5c2.5,0,3.1,1.7,4.6,45.3c0.4,11.9,0.9,25.9,1.5,34.1c0.5-6.7,1-16.8,1.3-25.6c1.4-33.5,2-36.4,4.6-36.4  c2.6,0,3.2,3.2,4.2,24.8c0.4,7.7,0.9,18.6,1.8,23.1c0.6-3.1,1-9.4,1.3-13.9c0.9-14.2,1.5-19.1,4.6-19.1c3.3,0,3.7,5.5,4.3,13.1  c0.3,3.9,0.7,10.3,1.8,11.3c1-0.2,1.4-3.6,1.7-5.6c0.5-3.5,1-7.4,4.2-7.4c3,0,3.9,2.3,4.6,3.9c0.6,1.5,0.9,1.8,1.4,1.8  c1.2,0,1.6-0.5,2.3-1.3c0.7-0.8,1.7-2,3.7-2c1.7,0,2.7,0.6,3.4,1.1c0.6,0.4,1.2,0.8,2.6,0.8h6c0.8,0,1.5,0.7,1.5,1.5  s-0.7,1.5-1.5,1.5h-6c-2.4,0-3.5-0.8-4.3-1.3c-0.6-0.4-0.9-0.6-1.7-0.6c-0.5,0-0.8,0.2-1.5,1c-0.8,0.9-2,2.3-4.5,2.3  c-2.7,0-3.6-2.2-4.2-3.7c-0.7-1.6-0.9-2-1.8-2c-0.6,0.4-1,3.3-1.2,4.8c-0.5,3.7-1.1,8.2-4.8,8.2c-3.7,0-4.2-6.2-4.7-14.1  c-0.2-3-0.6-7.7-1.2-9.6c-0.9,2.7-1.4,10.4-1.7,15.7C55.5,70.3,55,75.1,52,75.1c-2.9,0-3.6-4.1-4.8-27.6c-0.3-5.8-0.7-13.1-1.2-17.8  c-0.7,6.8-1.3,19.4-1.7,29.3C43.1,91.4,42.5,94,40,94z"
                                    fill="#6C8993"
                                />
                            ))}
                        </Group>
                        <Shape
                            x={0}
                            y={0}
                            d={this.state.transition}
                            strokeWidth={7}
                            stroke="#6C8993"
                        />
                    </Group>
                </Surface>
            </View>
        )
    }
}
