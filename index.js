/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './Frontend/app';
// import map from './renderMap';
import {name as appName} from './app.json';

LogBox.ignoreAllLogs(true);
AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent(appName, () => map);
