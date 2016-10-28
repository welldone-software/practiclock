import React from 'react'
import {
  View,
  Text,
  TouchableHighlight
} from 'react-native'
import SortableListView from 'react-native-sortable-listview'

const data = {
  hello: {text: 'world'},
  how: {text: 'are you'},
  test: {text: 123},
  this: {text: 'is'},
  a: {text: 'a'},
  real: {text: 'real'},
  drag: {text: 'drag and drop'},
  bb: {text: 'bb'},
  cc: {text: 'cc'},
  dd: {text: 'dd'},
  ee: {text: 'ee'},
  ff: {text: 'ff'},
  gg: {text: 'gg'},
  hh: {text: 'hh'},
  ii: {text: 'ii'},
  jj: {text: 'jj'},
  kk: {text: 'kk'}
}

let order = Object.keys(data)

const normalStyle = {padding: 25, backgroundColor: "#F8F8F8", borderBottomWidth:1, borderColor: '#eee'};
const activeStyle = [normalStyle, {borderWidth: 1, borderColor: '#aaa'}]


const RowComponent =({data, active, sortHandlers}) => (
  <TouchableHighlight underlayColor={'#eee'}
                      style={active? activeStyle: normalStyle} {...sortHandlers}>
    <Text>{data.text}</Text>
  </TouchableHighlight>
)

const onRenderRow = (data, section, index, highlightfn, active) =>
  <RowComponent data={data} active={active}/>

export default () => (
  <SortableListView
    style={{flex: 1}}
    data={data}
    order={order}
    onRowMoved={e => {
      order = order.splice(e.to, 0, order.splice(e.from, 1)[0]);
    }}
    renderRow={onRenderRow}
  />
)
