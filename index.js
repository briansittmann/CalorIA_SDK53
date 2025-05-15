import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';

import App from './src/App';

LogBox.ignoreLogs([
    'Text strings must be rendered within a <Text> component'
  ]);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
