import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

class selectRole extends Component {

    async setUser(user){
        await AsyncStorage.setItem('user', user);
    }

    // checkToken = async () => {
    //     try {
    //         let token = await AsyncStorage.getItem('token');
            
    //         if(token != null) {
    //             this.props.navigation.navigate("BookServicesNavigator");
    //         }else{
    //             this.props.navigation.navigate("CustomerLogin");
    //         }

    //     } catch (error) {
    //         // Error saving data
    //     }
    // };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.containerText}>Where do you find
                    yourself fit in?</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        this.setUser('professional');
                        this.props.navigation.navigate("ProfessionalLogin")
                }}
                >
                    <Text style={styles.buttonText} >Professional</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        this.setUser('customer');
                        // this.checkToken();
                        this.props.navigation.navigate("CustomerLogin");
                    }}
                >
                    <Text style={styles.buttonText} >Customer</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default selectRole;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFBE85",
        justifyContent: 'center',
    },
    containerText: {
        alignSelf: 'center',
        fontFamily: 'Poppins-SemiBoldItalic',
        fontSize: 27,
        marginHorizontal: '20%',
        textAlign: 'center',
    },
    button: {
        backgroundColor: "#1f1f1f",
        fontSize: 20,
        borderRadius: 30,
        marginVertical: '5%',
        marginHorizontal: '15%',
        paddingLeft: 25,
        paddingRight: 25,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        color: "#ffffff"
    },
})