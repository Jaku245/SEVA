import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import login from './login';
import dashboard from './Dashboard/dashboard';
import splashScreen from './splashScreen';
import verify from './verify';
import newApplicationsNavigator from './Dashboard/NewApplications/newApplicationsNavigator';
import manageCustomersNavigator from './Dashboard/ManageCustomers/manageCustomersNavigator';
import serviceReportsNavigator from './Dashboard/ServiceReports/serviceReportsNavigator';
import manageProfessionalsNavigator from './Dashboard/ManageProfessionals/manageProfessionalsNavigator';
import manageServicesNavigator from './Dashboard/ManageServices/manageServicesNavigator';
import companyReportsNavigator from './Dashboard/CompanyReports/companyReportsNavigator';

const Stack = createStackNavigator();

class App extends Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="SplashScreen" component={splashScreen} options={{ headerShown: false }}/>
                    <Stack.Screen name="login" component={login} options={{ headerShown: false }}/>
                    <Stack.Screen name="verify" component={verify} options={{ headerShown: false }}/>
                    <Stack.Screen name="dashboard" component={dashboard} options={{ headerShown: false }}/>
                    <Stack.Screen name="newApplicationsNavigator" component={newApplicationsNavigator} options={{ headerShown: false }}/>
                    <Stack.Screen name="serviceReportsNavigator" component={serviceReportsNavigator} options={{ headerShown: false }}/>
                    <Stack.Screen name="manageCustomersNavigator" component={manageCustomersNavigator} options={{ headerShown: false }}/>
                    <Stack.Screen name="manageProfessionalsNavigator" component={manageProfessionalsNavigator} options={{ headerShown: false }}/>
                    <Stack.Screen name="manageServicesNavigator" component={manageServicesNavigator} options={{ headerShown: false }}/>
                    <Stack.Screen name="companyReportsNavigator" component={companyReportsNavigator} options={{ headerShown: false }}/>
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

export default App;