import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import onGoing from './onGoing';
import onGoingServiceDetails from './onGoingServiceDetails';
import onGoingAddOns from './onGoingAddOns';

const Stack = createStackNavigator();

class onGoingNavigator extends Component {

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="onGoing" component={onGoing} options={{ headerShown: false }} />
                <Stack.Screen name="onGoingServiceDetails" component={onGoingServiceDetails} options={{ title: 'Appointed Service', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="onGoingAddOns" component={onGoingAddOns} options={{ title: 'Add On services', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
            </Stack.Navigator>
        );
    }
}

export default onGoingNavigator;

const styles = new StyleSheet.create({
    header: {
        backgroundColor: '#1C1C1C',
    }
});