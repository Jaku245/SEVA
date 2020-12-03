import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

import customerProfile from './customerProfile';
import customerSettings from './settings/customerSettings';
import customerBookingNavigator from './bookings/customerBookingNavigator';
import customerDashboard from './customerDashboard';

const Tab = createBottomTabNavigator();

class DashboardNavigator extends Component {

    render() {

        return (
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Bookings') {
                            iconName = focused ? 'file-tray' : 'file-tray-outline';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'person-sharp' : 'person-outline';
                        } else if (route.name === 'Settings') {
                            iconName = focused ? 'construct' : 'construct-outline';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
                tabBarOptions={{
                    activeTintColor: '#FFBE85',
                    inactiveTintColor: 'gray',
                    style: styles.tabs,
                    showLabel: false
                }}
            >
                <Tab.Screen name="Home" component={customerDashboard} />
                <Tab.Screen name="Bookings" component={customerBookingNavigator} />
                <Tab.Screen name="Profile" component={customerProfile} />
                <Tab.Screen name="Settings" component={customerSettings} />
            </Tab.Navigator>
        );
    }
}

export default DashboardNavigator;

const styles = new StyleSheet.create({
    tabs: {
        height: 70,
        // paddingBottom: 10,
        // paddingTop: 5
        // backgroundColor: 'transparent',
        // position: 'absolute',
        elevation: 0,
        borderTopWidth: 0
    }
});