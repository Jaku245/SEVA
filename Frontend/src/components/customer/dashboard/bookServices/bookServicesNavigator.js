import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';

import selectSubCategory from './selectSubCategory';
import selectServices from './selectServices';
import DashboardNavigator from '../dashboardNavigator';
import serviceDetails from './serviceDetails';
import serviceCart from './ServiceCart';
import selectAddress from './selectAddress';
import selectDateTime from './SelectDateTime';
import updateAddress from './updateAddress';
import serviceSummary from './serviceSummary';

const Stack = createStackNavigator();

class bookServicesNavigator extends Component {
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="DashboardNavigator" component={DashboardNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="selectSubCategory" component={selectSubCategory} options={({ route }) => ({ title: route.params.catName })} />
                <Stack.Screen name="selectServices" component={selectServices} options={({ route }) => ({ title: route.params.catName })} />
                <Stack.Screen name="serviceDetails" component={serviceDetails} options={({ route }) => ({ title: route.params.serviceName })} />
                <Stack.Screen name="serviceCart" component={serviceCart} options={{ title: '' }} />
                <Stack.Screen name="selectAddress" component={selectAddress} options={{ title: 'Select Address', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="selectDateTime" component={selectDateTime} options={{ title: 'Select Date and Time', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="reschedule" component={selectDateTime} options={{ title: 'Select Date and Time', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="addAddress" component={updateAddress} options={{ title: 'Add Address', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="updateAddress" component={updateAddress} options={{ title: 'Update Address', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
                <Stack.Screen name="serviceSummary" component={serviceSummary} options={{ title: 'Service Summary', headerStyle: styles.header, headerTintColor: 'white', headerStatusBarHeight: 10 }} />
            </Stack.Navigator>
        );
    }
}

export default bookServicesNavigator;

const styles = new StyleSheet.create({
    header: {
        backgroundColor: '#1C1C1C',
    }
});
