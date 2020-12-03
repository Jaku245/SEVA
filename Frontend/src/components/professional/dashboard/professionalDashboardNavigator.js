import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

import professionalDashboard from './professionalDashboard';
import history from './history/history';
import onGoingNavigator from './onGoing/onGoingNavigator';
import newRequestsNavigator from './newRequests/newRequestsNavigator';
import historyNavigator from './history/historyNavigator';

const Tab = createBottomTabNavigator();

class professionalDashboardNavigator extends Component {

    render() {

        return (
            <Tab.Navigator
                initialRouteName="ProProfile"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'ProHome') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'newRequests') {
                            iconName = focused ? 'mail' : 'mail-outline';
                        } else if (route.name === 'History') {
                            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                        }else if (route.name === 'ProProfile') {
                            iconName = focused ? 'person-sharp' : 'person-outline';
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
                <Tab.Screen name="ProHome" component={onGoingNavigator} />
                <Tab.Screen name="newRequests" component={newRequestsNavigator} />
                <Tab.Screen name="History" component={historyNavigator} />
                <Tab.Screen name="ProProfile" component={professionalDashboard} />
            </Tab.Navigator>
        );
    }
}

export default professionalDashboardNavigator;

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