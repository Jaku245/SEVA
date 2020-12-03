import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { Item, Input, Text } from 'native-base';
import Loader from '../shared/Loader'
import AsyncStorage from '@react-native-community/async-storage';

import { env } from '../shared/supports';

class professionalOtp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            otp: '',
            loaderVisible: false,
            validOtp: false,
            invalidOtp: false,
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
        // const temp = 123456;
        // setTimeout(() => {
        // console.log(otp);
        // console.log(this.state.authy_Id);
        //     if (otp == temp) {
        //         this.hideLoader();
        //         this.props.navigation.navigate("BookServicesNavigator", { status: 'success' });
        //     } else {
        //         this.hideLoader();
        //         alert("Please enter valid phone number.");
        //     }
        // }, 2000);
        if (this.state.validOtp) {

            fetch(env.api + "professional/verify_otp", {
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
                        // this.storeProfessional(data.professional);
                        this.props.navigation.navigate('applicationNavigator');
                    }
                })
        } else {
            setTimeout(async () => {
                this.hideLoader();
                await Alert.alert('Invalid OTP', 'Please enter valid OTP', [
                    { text: 'Okay' }
                ]);
                this.setState({
                    invalidOtp: true
                });
            }, 1000);
        }
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

    storeProfessional = async (professional) => {
        try {
            await AsyncStorage.setItem(
                'professional',
                JSON.stringify(professional)
            );
        } catch (error) {
            // Error saving data
        }
    };

    resendOtp() {
        this.showLoader();
        this.setState({
            otp: ''
        });
        fetch(env.api + "professional/resend_otp", {
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
                    this.setState({
                        otp: ''
                    });
                    this.hideLoader();
                    alert(data.message);
                }
            })
    }

    validate(otp) {
        if (otp.length != 6) {
            this.setState({
                otp: otp,
                invalidOtp: true,
                validOtp: false
            });
        } else {
            this.setState({
                otp: otp,
                invalidOtp: false,
                validOtp: true
            });
        }
    }


    render() {

        console.log(JSON.stringify(this.state.authy_Id));

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
                    <Item rounded style={
                        this.state.validOtp
                            ?
                            { borderColor: 'green' }
                            :
                            this.state.invalidOtp
                                ?
                                { borderColor: 'red' }
                                : null
                    } >
                        <Input
                            style={styles.otpInput}
                            maxLength={6}
                            minLength={6}
                            placeholder="Enter OTP"
                            returnKeyType='done'
                            keyboardType='phone-pad'
                            onChangeText={otp => this.validate(otp)}
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

export default professionalOtp;

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