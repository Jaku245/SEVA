import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import categories from './categories';
import updateCategory from './updateCategory';
import updateSubCategory from './updateSubCategory';
import updateService from './updateService';
import addCategory from './addCategory';
import addSubCategory from './addSubCategory';
import addService from './addService';



const Stack = createStackNavigator();

class manageServicesNavigator extends Component {

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="categories" component={categories} options={{ headerShown: false }} />
                <Stack.Screen name="updateCategory" component={updateCategory} options={{ headerShown: false }} />
                <Stack.Screen name="updateSubCategory" component={updateSubCategory} options={{ headerShown: false }} />
                <Stack.Screen name="updateService" component={updateService} options={{ headerShown: false }} />
                <Stack.Screen name="addCategory" component={addCategory} options={{ headerShown: false }} />
                <Stack.Screen name="addSubCategory" component={addSubCategory} options={{ headerShown: false }} />
                <Stack.Screen name="addService" component={addService} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }
}

export default manageServicesNavigator;

const styles = new StyleSheet.create({
    header: {
        backgroundColor: '#1C1C1C',
    }
});
