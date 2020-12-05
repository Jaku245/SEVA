import React, { Component } from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';
import professionalDashboardNavigator from '../professionalDashboardNavigator';
import contact from './contact';
import about from './about';
import terms from './terms';
import updateProfile from './updateProfile';

const Drawer = createDrawerNavigator();

class menuNavigator extends Component {
    render() {
        return (
            <Drawer.Navigator

                initialRouteName="Home"
                drawerContentOptions={{
                    activeTintColor: '#FCA04F',
                    activeBackgroundColor: '#FFF7F0',
                    itemStyle: {
                        marginVertical: 10,
                        paddingLeft: 20
                    },
                    labelStyle: {
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 16,
                        alignSelf: 'center',
                    },
                    style: {
                        marginTop: 50
                    }
                }}
            >
                <Drawer.Screen name="Home" component={professionalDashboardNavigator} />
                <Drawer.Screen name="Update Profile" component={updateProfile} />
                <Drawer.Screen name="Contact" component={contact} />
                <Drawer.Screen name="About" component={about} />
                <Drawer.Screen name="Terms and Conditions" component={terms} />
            </Drawer.Navigator>
        );
    }
}

export default menuNavigator;