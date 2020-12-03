/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './Frontend/app';
// import map from './renderMap';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent(appName, () => map);
