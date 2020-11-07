import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Item, Input, Text } from 'native-base';
import Loader from './shared/Loader'
import AsyncStorage from '@react-native-community/async-storage';

import { env } from './shared/supports';

class verify extends Component {

    constructor(props) {
        super(props);
        this.state = {
            otp: '',
            loaderVisible: false,
            token: '',
            authy_Id: props.route.params.authy_Id
        };
    }


    showLoader() {
        this.setState({ loaderVisible: true })
    }
    hideLoader() {
        this.setState({ loaderVisible: false })
    }

    verifyOtp(otp) {
        this.showLoader();
        const temp = 123456;
        // setTimeout(() => {
            console.log(otp);
        //     if (otp == temp) {
        //         this.hideLoader();
        //         this.storeToken('123');
        //         this.props.navigation.navigate("dashboard");
        //     } else {
        //         this.hideLoader();
        //         alert("Please enter valid phone number.");
        //     }
        // }, 2000);

        fetch( env.api + "admin/verify_otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authy_Id: this.state.authy_Id,
                otp: otp
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.hideLoader();
                    alert(data.error);
                } else if (data.jwtToken) {
                    this.state.token = data.jwtToken;
                    console.log(this.state.token);
                    this.hideLoader();
                    this.storeToken(data.jwtToken);
                    this.props.navigation.navigate('dashboard');
                }
            })
    }

    storeToken = async (token) => {
        try {
            await AsyncStorage.setItem(
                'token',
                token
            );
        } catch (error) {
            // Error saving data
        }
    };

    resendOtp() {
        this.showLoader();
        fetch(env.api + "customer/resend_otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authy_Id: this.state.authy_Id
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.hideLoader();
                    alert(data.error);
                } else if (data.message) {
                    this.hideLoader();
                    alert(data.message);
                }
            })
    }


    render() {

        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>
                        OTP VERIFICATION
                    </Text>
                    <Text style={styles.subHeaderText}>
                        You will get a OTP by SMS.
                    </Text>
                </View>
                <View style={styles.otpItem} >
                    <Item rounded >
                        <Input
                            style={styles.otpInput}
                            maxLength={6}
                            minLength={6}
                            placeholder="Enter OTP"
                            returnKeyType='done'
                            keyboardType='phone-pad'
                            onChangeText={otp => this.setState({ otp })}
                        />
                    </Item>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.verifyButton}
                        onPress={() => this.verifyOtp(this.state.otp)}
                    >
                        <Text style={styles.verifyButtonText} >Verify</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.resendButton}
                        onPress={() => this.resendOtp()}
                    >
                        <Text style={styles.resendButtonText} >Resend OTP</Text>
                    </TouchableOpacity>
                </View>
                <Loader
                    loaderVisible={this.state.loaderVisible}
                    animationType="fade"
                />
            </View>
        )
    }
}

export default verify;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    headerContainer: {
        marginVertical: '2%',
        paddingLeft: 25,
        paddingRight: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        color: "#000000"
    },
    subHeaderText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: "#000000"
    },
    otpItem: {
        backgroundColor: "#F5F5F5",
        height: 50,
        marginHorizontal: "8%",
    },
    otpInput: {
        fontSize: 17,
        textAlign: 'center'
    },
    verifyButton: {
        backgroundColor: "#1f1f1f",
        fontSize: 20,
        borderRadius: 30,
        marginVertical: '4%',
        marginHorizontal: '8%',
        paddingLeft: 25,
        paddingRight: 25,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifyButtonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        color: "#ffffff"
    },
    resendButton: {
        marginVertical: '2%',
        paddingLeft: 25,
        paddingRight: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendButtonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        color: "#000000"
    },
})