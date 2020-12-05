import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import io from "socket.io-client";

import Logo from "../resources/splash_logo.png";


class splashScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            user: null,
            done: false
        };
        // setTimeout(() => {

        //     this.props.navigation.navigate("SelectRole");
        // }, done);
    }


    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         token: null,
    //         userType: null
    //     };
    //     setTimeout(() =>
    //         this.navigateUser(),
    //         this.fetchDetails()
    //     );
    // }

    navigateUser() {

        const token = this.state.token;
        const user = this.state.user;

        setTimeout(() => {
            if (token !== null) {
                if (user == 'customer') {
                    this.props.navigation.navigate('BookServicesNavigator');
                } else if (user == 'professional') {
                    this.props.navigation.navigate('applicationNavigator');
                }
            } else {
                this.props.navigation.navigate('SelectRole');
            }
        }, 2000);
    }

    async fetchDetails() {

        let token = await AsyncStorage.getItem('token');

        if (token != null) {
            await this.setState({
                token: token
            });
        }

        let user = await AsyncStorage.getItem('user');

        if (user != null) {
            await this.setState({
                user: user
            });
        }

        await this.setState({
            done: true
        });

        console.log(this.state.token);
        console.log(this.state.user);

        this.navigateUser();
        // this.props.navigation.navigate('SelectRole');
    }

    componentDidMount() {
        this.fetchDetails();
    }

    render() {

        return (
            <View style={styles.container}>
                <View></View>
                <Image source={Logo} style={styles.splashLogo} />
                <Text style={styles.splashText}>
                    Professional service provider at your door-step
                </Text>
            </View>
        )
    }
}

export default splashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#171717",
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    splashText: {
        color: "#FFFFFF",
        fontFamily: 'poppins',
        fontSize: 17,
        marginTop: 29,
        marginBottom: 29,
        fontWeight: '300',
    },
    splashLogo: {
        flex: 1,
        maxWidth: '60%',
        maxHeight: '6%',
        justifyContent: 'center',
        alignItems: 'center',
    }
})