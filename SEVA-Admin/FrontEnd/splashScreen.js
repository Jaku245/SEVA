import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import Logo from "./resources/splash_logo.png";


class splashScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            user: null,
            done: false
        };
    }

    async fetchDetails() {

        let token = await AsyncStorage.getItem('token');

        if(token != null) {
            await this.setState({
                token: token
            });
        
            setTimeout(() => {

                this.props.navigation.navigate("dashboard");
            }, 1000);

        } else {
            setTimeout(() => {

                this.props.navigation.navigate("login");
            }, 1000);
        }
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