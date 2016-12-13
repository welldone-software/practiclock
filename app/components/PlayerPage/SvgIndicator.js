//@flow
import React from 'react'
import Svg, {G, Rect, Path} from 'react-native-svg';

export default props =>
    <Svg height="20" width={props.width || 370}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item) => (
            <G x={17*item} y="-7" key={item}>
                <Path
                    d="M1 13h-1v-1h1v1zm22-1h-1v1h1v-1zm-20-1h-1v3h1v-3zm18 0h-1v3h1v-3zm-14 0h-1v3h1v-3zm10-1h-1v5h1v-5zm-12 0h-1v5h1v-5zm14-1h-1v7h1v-7zm-10 0h-1v7h1v-7zm2-2h-1v10h1v-10zm4 0h-1v10h1v-10zm-2-2h-1v14h1v-14z"/>
            </G>))}
        <Rect width={(props.width || 370) * (props.time || 0)} opacity="0.5" height="10" stroke="red" strokeWidth="0"
              fill="#fc0"/>
    </Svg>