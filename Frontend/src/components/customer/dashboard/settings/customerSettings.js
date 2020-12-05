import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import customerMore from './customerMore';
import help from './help';
import about from './about';
import terms from './terms';
import manageAddresses from './manageAddresses';
import updateManageAddress from './updateManageAddress';

const Stack = createStackNavigator();

class customerSettings extends Component {

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="customerMore" component={customerMore} options={{ title: 'More', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="help" component={help} options={{ title: 'Help', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="manageAddresses" component={manageAddresses} options={{ title: 'Manage Address', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="about" component={about} options={{ title: 'About', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="terms" component={terms} options={{ title: 'Terms and Conditions', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="addAddress" component={updateManageAddress} options={{ title: 'Add Address', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="updateAddress" component={updateManageAddress} options={{ title: 'Update Address', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
            </Stack.Navigator>
        );
    }
}

export default customerSettings;

const styles = new StyleSheet.create({
    header: {
        backgroundColor: '#1C1C1C',
    }
});