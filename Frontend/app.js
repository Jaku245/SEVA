import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import splashScreen from './src/splashScreen';
import selectRole from './src/selectRole';

import customerLogin from './src/components/customer/customerLogin';
import customerRegister from './src/components/customer/customerRegister';
import customerOtp from './src/components/customer/customerOtp';
import bookServicesNavigator from './src/components/customer/dashboard/bookServices/bookServicesNavigator';

import professionalLogin from './src/components/professional/professionalLogin';
import professionalRegister from './src/components/professional/professionalRegister';
import professionalOtp from './src/components/professional/professionalOtp';
import applicationNavigator from './src/components/professional/dashboard/application/applicationNavigator';


const Stack = createStackNavigator();

class App extends Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    {/* <Stack.Screen name="Test" component={test} options={{headerShown:false}}/> */}
                    <Stack.Screen name="SplashScreen" component={splashScreen} options={{ headerShown: false }}/>
                    <Stack.Screen name="SelectRole" component={selectRole} options={{ headerShown: false }}/> 
                    {/* Customer Routes */}
                    <Stack.Screen name="CustomerLogin" component={customerLogin} options={{ headerShown: false }}/>
                    <Stack.Screen name="CustomerRegister" component={customerRegister} options={{ headerShown: false }}/>
                    <Stack.Screen name="CustomerOtp" component={customerOtp} />
                    <Stack.Screen name="BookServicesNavigator" component={bookServicesNavigator} options={{ headerShown: false }} />
                    {/* Professional Routes */}
                    <Stack.Screen name="ProfessionalLogin" component={professionalLogin} options={{ headerShown: false }}/>
                    <Stack.Screen name="ProfessionalRegister" component={professionalRegister} options={{ headerShown: false }}/>
                    <Stack.Screen name="ProfessionalOtp" component={professionalOtp}/>
                    <Stack.Screen name="applicationNavigator" component={applicationNavigator} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

export default App;