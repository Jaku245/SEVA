import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import manageCustomers from './manageCustomers';
import manageCustomerDetails from './manageCustomersDetails';
import customerServiceDetails from './customerServiceDetails';
import customerDetails from './customer';
import customerServiceReportDetails from './customerServiceReportDetails';
import professionalDetails from './professional';
import professionalReports from './professionalServiceReportDetails';



const Stack = createStackNavigator();

class manageCustomersNavigator extends Component {

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="manageCustomers" component={manageCustomers} options={{ headerShown: false }} />
                <Stack.Screen name="manageCustomerDetails" component={manageCustomerDetails} options={{ title: 'Customer Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="customerServiceDetails" component={customerServiceDetails} options={{ title: 'Service Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="customer" component={customerDetails} options={{ title: 'Customer Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="customerServiceReportDetails" component={customerServiceReportDetails} options={{ title: 'Service Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="professional" component={professionalDetails} options={{ title: 'Professional Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="professionalReports" component={professionalReports} options={{ title: 'Service Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
            </Stack.Navigator>
        );
    }
}

export default manageCustomersNavigator;

const styles = new StyleSheet.create({
    header: {
        backgroundColor: '#1C1C1C',
    }
});
