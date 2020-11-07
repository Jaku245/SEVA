import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import newApplications from './newApplications';
import newApplicationsDetails from './newApplicationsDetails';



const Stack = createStackNavigator();

class newApplicationsNavigator extends Component {

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="newApplications" component={newApplications} options={{ headerShown: false }} />
                <Stack.Screen name="newApplicationsDetails" component={newApplicationsDetails} options={{ title: 'Application Details', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
            </Stack.Navigator>
        );
    }
}

export default newApplicationsNavigator;

const styles = new StyleSheet.create({
    header: {
        backgroundColor: '#1C1C1C',
    }
});
