import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import customerBookings from './customerBookings';
import customerServiceDetails from './customerServiceDetails';
import reschedule from './reschedule';
import summary from './summary';
import professionalProfile from './professionalProfile';

const Stack = createStackNavigator();

class customerBookingNavigator extends Component {

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="customerBookings" component={customerBookings} options={{ title: 'Bookings', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="customerServiceDetails" component={customerServiceDetails} options={{ title: 'Service Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="reschedule" component={reschedule} options={{ title: 'Select Date and Time', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="summary" component={summary} options={{ title: 'Service Summary', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="professionalProfile" component={professionalProfile} options={{ title: 'Professional Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
            </Stack.Navigator>
        );
    }
}

export default customerBookingNavigator;

const styles = new StyleSheet.create({
    header: {
        backgroundColor: '#1C1C1C',
    }
});