import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import companyReports from './companyReports';



const Stack = createStackNavigator();

class companyReportsNavigator extends Component {

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="companyReports" component={companyReports} options={{ headerShown: false }} />
                {/* <Stack.Screen name="newRequestServiceDetails" component={newRequestServiceDetails} options={{ title: 'Request Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} /> */}
            </Stack.Navigator>
        );
    }
}

export default companyReportsNavigator;

const styles = new StyleSheet.create({
    header: {
        backgroundColor: '#1C1C1C',
    }
});
