import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import history from './history';
import historyServiceDetails from './historyServiceDetails';

const Stack = createStackNavigator();

class historyNavigator extends Component {

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="newRequests" component={history} options={{ headerShown: false }} />
                <Stack.Screen name="historyServiceDetails" component={historyServiceDetails} options={{ title: 'Service Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
            </Stack.Navigator>
        );
    }
}

export default historyNavigator;

const styles = new StyleSheet.create({
    header: {
        backgroundColor: '#1C1C1C',
    }
});
