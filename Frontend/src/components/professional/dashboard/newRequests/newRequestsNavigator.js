import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import newRequests from './newRequests';
import newRequestServiceDetails from './newRequestServiceDetails';

const Stack = createStackNavigator();

class newRequestsNavigator extends Component {

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="newRequests" component={newRequests} options={{ headerShown: false }} />
                <Stack.Screen name="newRequestServiceDetails" component={newRequestServiceDetails} options={{ title: 'Request Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
            </Stack.Navigator>
        );
    }
}

export default newRequestsNavigator;

const styles = new StyleSheet.create({
    header: {
        backgroundColor: '#1C1C1C',
    }
});
