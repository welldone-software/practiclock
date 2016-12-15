import { AppRegistry } from 'react-native'
import App from './components/App'

console.ignoredYellowBox = ['Warning: This synthetic event is reused for performance reasons.'];

AppRegistry.registerComponent('practiclock', () => App)
