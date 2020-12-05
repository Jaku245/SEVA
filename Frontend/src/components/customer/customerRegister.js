import React, { Component } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Modal,
    FlatList,
    Text,
    StyleSheet,
    Animated,
    Pressable,
    Alert
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Item, Icon, Input } from 'native-base';

import Loader from '../shared/Loader'
import { env } from '../shared/supports';
import data from '../../countries'

const defaultFlag = data.filter(
    obj => obj.name === 'India'
)[0].flag

const dial_code = data.filter(
    obj => obj.name === 'India'
)[0].dial_code



class customerRegister extends Component {

    state = {
        flag: defaultFlag,
        dial_code: dial_code,
        modalVisible: false,
        name: '',
        email: '',
        phone: '',
        authy_Id: null,
        invalidName: false,
        invalidEmail: false,
        checked: false,
        loaderVisible: false
    }

    showLoader() {
        this.setState({ loaderVisible: true })
    }

    hideLoader() {
        this.setState({ loaderVisible: false });
    }

    showModal() {
        this.setState({ modalVisible: true })
    }

    hideModal() {
        this.setState({ modalVisible: false })
    }

    selectCountry(country) {
        // Get data from Countries.js  
        const countryData = data
        try {
            // Get the country code
            const countryCode = countryData.filter(
                obj => obj.name === country
            )[0].dial_code
            // Get the country flag
            const countryFlag = countryData.filter(
                obj => obj.name === country
            )[0].flag
            // Update the state then hide the Modal
            this.setState({ dial_code: countryCode, flag: countryFlag })
            this.hideModal()
        }
        catch (err) {
            console.log(err)
        }
    }

    onChangeText(key, value) {
        if (key == 'name') {
            this.setState({
                invalidName: false
            });
        }
        if (key == 'email') {
            let valid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
            if (valid) {
                this.setState({
                    invalidEmail: false
                });
            }
        }
        this.setState({
            [key]: value
        })
    }

    register() {

        this.showLoader();

        if (this.state.name.length > 0) {

            if (this.state.email.length > 0) {

                if (!this.state.invalidEmail) {

                    if (this.state.checked) {

                        fetch(env.api + "customer/register", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                name: this.state.name,
                                phone: this.props.route.params.phoneWithCode,
                                email: this.state.email
                            })
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data.error) {
                                    this.hideLoader();
                                    alert(data.error);
                                } else if (data.customer.authy_Id) {
                                    this.setState({
                                        authy_Id: data.customer.authy_Id
                                    });
                                    console.log(this.state.authy_Id);
                                    this.hideLoader();
                                    this.props.navigation.navigate('CustomerOtp', { authy_Id: this.state.authy_Id });
                                }
                            })
                    } else {
                        setTimeout(async () => {
                            this.hideLoader();
                            await Alert.alert('Accept T&C', 'Please accept our terms and conditions', [
                                { text: 'Okay' }
                            ]);
                        }, 1000);
                    }
                } else {
                    setTimeout(async () => {
                        this.hideLoader();
                        await Alert.alert('Invalid Email', 'Please enter valid email address', [
                            { text: 'Okay' }
                        ]);
                        await this.setState({
                            invalidEmail: true
                        })
                    }, 1000);
                }
            } else {
                setTimeout(async () => {
                    this.hideLoader();
                    await Alert.alert('Invalid Email', 'Email field should not be null', [
                        { text: 'Okay' }
                    ]);
                    await this.setState({
                        invalidEmail: true
                    })
                }, 1000);
            }
        } else {
            setTimeout(async () => {
                this.hideLoader();
                await Alert.alert('Invalid Name', 'Name field should not be null', [
                    { text: 'Okay' }
                ]);
                await this.setState({
                    invalidName: true
                })
            }, 1000);
        }
    }


    render() {
        const countryData = data
        return (
            <View style={styles.container}>
                <View style={styles.headerPanel}>
                    <Text style={styles.headerText1}>customer</Text>
                    <Text style={styles.headerText2}>register.</Text>
                </View>

                <View style={styles.registerPanel}>
                    <Item rounded style={this.state.invalidName ? styles.invalidItem : styles.item}>
                        <Input
                            style={styles.registerName}
                            placeholder="Name"
                            onChangeText={(val) => this.onChangeText('name', val)}
                        />
                    </Item>
                    <Item rounded style={this.state.invalidEmail ? styles.invalidItem : styles.item}>
                        <Input
                            style={styles.registerEmail}
                            placeholder="Email"
                            keyboardType='email-address'
                            onChangeText={(val) => this.onChangeText('email', val)}
                        />
                    </Item>
                    <View style={styles.phoneContainer}>
                        <Item
                            rounded
                            style={styles.countryCodeItem}
                        // onPress={() => this.showModal()}
                        >
                            <View
                                style={styles.flagStyle}>
                                <Text
                                    style={styles.flagText}>{this.state.flag}</Text></View>
                            <View
                                style={styles.codeStyle}>
                                <Text
                                    style={styles.codeText}>{this.state.dial_code}</Text></View>
                            <Icon
                                active
                                name='chevron-down'
                                style={styles.iconStyle}
                            />
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={this.state.modalVisible}
                                onRequestClose={() => this.hideModal()}>
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <View style={{ borderBottomWidth: 0.5, padding: "3%" }}>
                                            <Text
                                                style={{ fontWeight: "bold", fontSize: 21 }}>
                                                Select a country
                                                </Text>
                                        </View>
                                        <FlatList
                                            data={countryData}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={
                                                ({ item }) =>
                                                    <Pressable onPress={() => this.selectCountry(item.name)}>
                                                        <View style={styles.countryStyle}>
                                                            <Text style={styles.textStyle}>
                                                                {item.flag} {item.name} ({item.dial_code})
                                                                </Text>
                                                        </View>
                                                    </Pressable>
                                            }
                                        />
                                    </View>
                                </View>
                            </Modal>
                        </Item>
                        <Item rounded style={styles.phoneItem}>
                            <Input
                                style={styles.registerPhone}
                                ref='PhoneInput'
                                placeholder="Mobile Number"
                                returnKeyType='done'
                                keyboardType='phone-pad'
                                editable={false}
                                value={this.props.route.params.phone}
                            // onChangeText={(val) => this.onChangeText('phone', val)}
                            />
                        </Item>
                    </View>

                    <View style={styles.policyCheckBoxGroup}>
                        <View style={styles.policyCheckBox}>
                            <CheckBox
                                onChange={() => {
                                    this.setState({
                                        checked: !this.state.checked
                                    })
                                }}
                                value={this.state.checked}
                            /><Text style={styles.policyCheckBoxText}>By signing up, you agree to seva's Terms and Condition and Privacy Policy </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.register()}
                    >
                        <Text style={styles.buttonText} >Register</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.headerPanel}>
                </View>
                <Loader
                    loaderVisible={this.state.loaderVisible}
                    animationType="fade"
                />
            </View>
        )
    }
}

export default customerRegister;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFBE85",
        // justifyContent: 'space-around',
        // alignItems: 'center',
    },
    headerPanel: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 30,
        color: "#ffffff",
    },
    headerText2: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 70,
        color: "#ffffff",
    },
    registerPanel: {
        flex: 1.9,
        backgroundColor: "#FFFFFF",
        borderRadius: 50,
        marginHorizontal: "5%",
        padding: "6%",
        justifyContent: 'center',
    },
    item: {
        // backgroundColor: "#F5F5F5",
        height: 50,
        marginBottom: "4%",
        paddingLeft: "2%"
    },
    invalidItem: {
        // backgroundColor: "#F5F5F5",
        height: 50,
        marginBottom: "4%",
        paddingLeft: "2%",
        borderColor: 'red'
    },
    registerName: {
        fontSize: 17,
    },
    registerEmail: {
        fontSize: 17,
    },
    phoneContainer: {
        margin: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: "5%"
    },
    countryCodeItem: {
        // backgroundColor: "#F5F5F5",
        flex: 1,
        height: 50,
        marginRight: "1%",
        paddingLeft: "2%",
        backgroundColor: "#F5F5F5"
    },
    flagStyle: {
        flex: 2.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flagText: {
        fontSize: 27,
    },
    codeStyle: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    codeText: {
        fontSize: 14,
    },
    iconStyle: {
        flex: 0.8,
        color: '#000000',
        fontSize: 13,
    },
    countryStyle: {
        padding: "3%",
    },
    textStyle: {
        fontSize: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'flex-end',
    },
    modalView: {
        marginTop: 600,
        backgroundColor: "white",
        width: "100%"
    },
    phoneItem: {
        // backgroundColor: "#F5F5F5",
        flex: 2,
        height: 50,
        marginLeft: "1%",
        paddingLeft: "2%",
        backgroundColor: "#F5F5F5"
    },
    registerPhone: {
        fontSize: 17,
    },
    button: {
        backgroundColor: "#1f1f1f",
        fontSize: 20,
        borderRadius: 30,
        marginVertical: '2%',
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
    roleCheckBoxGroup: {
        flexDirection: 'row',
        marginHorizontal: '4%',
        marginBottom: '4%',
        justifyContent: 'flex-start',
        alignItems: "center",
    },
    roleCheckBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",

    },
    roleCheckBoxText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
    },
    policyCheckBoxGroup: {
        flexDirection: 'row',
        marginHorizontal: '4%',
        justifyContent: 'flex-start',
        alignItems: "center",
    },
    policyCheckBox: {
        flex: 1,
        flexDirection: 'row',

    },
    policyCheckBoxText: {
        color: "#5E5E5E",
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        alignSelf: 'flex-end',
        paddingTop: 4,
        paddingEnd: 38
    },
    login: {
        flexDirection: "row",
        paddingTop: "1%",
        justifyContent: "center",
    },
    loginText: {
        fontFamily: "Poppins-Regular",
        fontSize: 18,
    },
    loginButtonText: {
        color: "#FFBE85",
        fontFamily: "Poppins-Medium",
        fontSize: 18,
    }


})