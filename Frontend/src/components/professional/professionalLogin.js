import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Modal,
    FlatList,
    Pressable,
    Alert
} from 'react-native';
import { Item, Icon, Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

import data from '../../countries'
import Loader from '../shared/Loader'

import { env } from '../shared/supports';

const defaultFlag = data.filter(
    obj => obj.name === 'India'
)[0].flag

const dial_code = data.filter(
    obj => obj.name === 'India'
)[0].dial_code

class professionalLogin extends Component {

    state = {
        phone: '',
        flag: defaultFlag,
        dial_code: dial_code,
        modalVisible: false,
        loaderVisible: false,
        validMobile: false,
        invalidMobile: false
    }


    showModal() {
        this.setState({ modalVisible: true })
    }
    hideModal() {
        this.setState({ modalVisible: false })
    }
    showLoader() {
        this.setState({ loaderVisible: true })
    }
    hideLoader() {
        this.setState({ loaderVisible: false });
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

    login = async () => {
        this.showLoader();
        if (this.state.validMobile) {
            {
                const str = this.state.dial_code;
                const rCode = str.split("+");
                const code = rCode[1];
                const phone = code + "-" + (this.state.phone);
                console.log(phone);
                // setTimeout(() => {
                // this.hideLoader()
                // this.props.navigation.navigate("CustomerOtp", { authy_id : this.state.phone });
                // }, 3000);

                await fetch(env.api + "professional/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        phone
                    })
                })
                    .then((res) => res.json())
                    .then((data) => {
                        setTimeout(() => {
                            if (data.error) {
                                this.hideLoader();
                                alert(data.error);
                            } else if (data.noProfessional) {
                                this.hideLoader();
                                this.props.navigation.navigate("ProfessionalRegister", { phone: this.state.phone, phoneWithCode: phone });
                            } else if (data.authy_Id) {
                                this.hideLoader();
                                console.log(data.authy_Id);
                                this.props.navigation.navigate("ProfessionalOtp", { authy_Id: data.authy_Id });
                            }
                        }, 2000);
                    })
            }
        } else {
            setTimeout(async () => {
                this.hideLoader();
                await Alert.alert('Invalid Number', 'Please enter valid mobile number', [
                    { text: 'Okay' }
                ]);
                this.setState({
                    invalidMobile: true
                });
            }, 1000);
        }

    }

    validate(phone) {
        if (phone.length != 10) {
            this.setState({
                phone: phone,
                invalidMobile: true,
                validMobile: false
            });
        } else {
            this.setState({
                phone: phone,
                invalidMobile: false,
                validMobile: true
            });
        }
    }

    render() {
        const countryData = data
        return (
            <View style={styles.container}>

                <View style={styles.headerPanel}>
                    <Text style={styles.headerText1}>professional.</Text>
                    <Text style={styles.headerText2}>Login.</Text>
                </View>


                <View style={styles.loginPanel}>
                    <View style={styles.infoContainer}>
                        <Item
                            rounded
                            style={styles.countryCodeItem}
                            onPress={() => this.showModal()}
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
                        <Item rounded style={
                            this.state.validMobile
                                ?
                                styles.phoneItemSuccess
                                :
                                this.state.invalidMobile
                                    ?
                                    styles.phoneItemAlert
                                    : styles.phoneItem
                        }>
                            <Input
                                style={styles.loginPhone}
                                value={this.state.phone}
                                ref='PhoneInput'
                                placeholder="Mobile Number"
                                returnKeyType='done'
                                keyboardType='phone-pad'
                                maxLength={10}
                                onChangeText={phone => this.validate(phone)}
                            />
                        </Item>
                    </View>


                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.login}
                    >
                        <Text style={styles.buttonText} >Login / SignUp</Text>
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

export default professionalLogin;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFBE85",
        // justifyContent: 'space-around',
        // alignItems: 'center',
    },
    headerPanel: {
        flex: 3,
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
        fontSize: 80,
        color: "#ffffff",
    },
    loginPanel: {
        flex: 2,
        backgroundColor: "#FFFFFF",
        borderRadius: 50,
        borderTopEndRadius: 50,
        marginHorizontal: 20,
        justifyContent: 'center',
    },
    infoContainer: {
        margin: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: "7%",
        marginBottom: "5%"
    },
    countryCodeItem: {
        // backgroundColor: "#F5F5F5",
        flex: 1,
        height: 50,
        marginRight: "1%",
        paddingLeft: "2%"
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
        marginLeft: "1%"
    },
    phoneItemAlert: {
        flex: 2,
        height: 50,
        marginLeft: "1%",
        borderColor: 'red'
    },
    phoneItemSuccess: {
        flex: 2,
        height: 50,
        marginLeft: "1%",
        borderColor: 'green'
    },
    loginPhone: {
        fontSize: 16,
        paddingLeft: "14%",
        height: 50
    },
    button: {
        backgroundColor: "#1f1f1f",
        fontSize: 20,
        borderRadius: 30,
        marginBottom: 10,
        marginHorizontal: 30,
        paddingLeft: 25,
        paddingRight: 25,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: "#ffffff"
    }
})