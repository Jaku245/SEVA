import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import manageProfessionals from './manageProfessionals';
import manageProfessionalDetails from './manageProfessionalDetails';
import professionalServiceDetails from './professionalServiceDetails';
import customerDetails from './customer';
import customerServiceReportDetails from './customerServiceReportDetails';
import professionalDetails from './professional';
import professionalReports from './professionalServiceReportDetails';



const Stack = createStackNavigator();

class manageProfessionalsNavigator extends Component {

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="manageProfessionals" component={manageProfessionals} options={{ headerShown: false }} />
                <Stack.Screen name="manageProfessionalDetails" component={manageProfessionalDetails} options={{ title: 'Professional Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="professionalServiceDetails" component={professionalServiceDetails} options={{ title: 'Service Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="customer" component={customerDetails} options={{ title: 'Customer Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="customerServiceReportDetails" component={customerServiceReportDetails} options={{ title: 'Service Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="professional" component={professionalDetails} options={{ title: 'Professional Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="professionalReports" component={professionalReports} options={{ title: 'Service Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
            </Stack.Navigator>
        );
    }
}

export default manageProfessionalsNavigator;

const styles = new StyleSheet.create({
    header: {
        backgroundColor: '#1C1C1C',
    }
});
