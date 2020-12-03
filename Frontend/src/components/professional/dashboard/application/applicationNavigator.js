import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import professionalDashboardNavigator from '../professionalDashboardNavigator';
import menuNavigator from '../menu/menuNavigator';
import personalDetails from './personalDetails';
import addProfile from './addProfile';
import identity from './identity';
import bankDetails from './bankDetails';
import certifications from './certifications';



const Stack = createStackNavigator();

class applicationNavigator extends Component {
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="menuNavigator" component={menuNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="addProfile" component={addProfile} options={{ title: 'Choose your Profile Picture', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="personalDetails" component={personalDetails} options={{ title: 'Personal Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="identity" component={identity} options={{ title: 'Identity Verification', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="bankDetails" component={bankDetails} options={{ title: 'Bank Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="certifications" component={certifications} options={{ title: 'Attach Photos', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
            </Stack.Navigator>
        );
    }
}

export default applicationNavigator;

const styles = new StyleSheet.create({
    header: {
        backgroundColor: '#1C1C1C',
    }
});
