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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Loader from './shared/Loader'
import { env } from './shared/supports';

class customerLogin extends Component {

    state = {
        id: '',
        loaderVisible: false
    }

    showLoader() {
        this.setState({ loaderVisible: true })
    }
    hideLoader() {
        this.setState({ loaderVisible: false });
    }

    login = async () => {
        this.showLoader();
        if (this.state.id != '') {
            {
                const id = this.state.id;
                console.log(this.state.id);
                // setTimeout(() => {
                //     this.hideLoader()
                //     this.props.navigation.navigate("verify");
                // }, 3000);

                await fetch(env.api + "admin/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        adminId: id
                    })
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        // setTimeout(() => {
                            if (data.error) {
                                this.hideLoader();
                                alert(data.error);
                            } else if (data.noCustomer) {
                                this.hideLoader();
                                alert('You are not registered!!');
                            } else if (data.admin.authy_Id) {
                                this.hideLoader();
                                console.log(data.admin.authy_Id);
                                this.props.navigation.navigate("verify", { authy_Id: data.admin.authy_Id });
                            }
                        // }, 2000);
                    })
            }
        } else {
            setTimeout(() => {
                this.hideLoader()
                alert("Please enter valid phone number.");
            }, 1000);
        }

    }

    render() {
        return (
            // <KeyboardAwareScrollView
            //     // style={{
            //     //     flex: 1
            //     // }}
            // >
                <View style={styles.container}>

                    <View style={styles.headerPanel}>
                        <Text style={styles.headerText1}>Admin.</Text>
                        <Text style={styles.headerText2}>Login.</Text>
                    </View>


                    <View style={styles.loginPanel}>
                        <View style={styles.infoContainer}>
                            <Item rounded style={styles.phoneItem}>
                                <Input
                                    style={styles.loginPhone}
                                    value={this.state.id}
                                    ref='PhoneInput'
                                    placeholder="Admin Id"
                                    returnKeyType='done'
                                    onChangeText={id => this.setState({ id })}
                                />
                            </Item>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.login}
                        >
                            <Text style={styles.buttonText} >Login</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={styles.headerPanel}>
                    </View>

                    <Loader
                        loaderVisible={this.state.loaderVisible}
                        animationType="fade"
                    />
                </View>
            // </KeyboardAwareScrollView>
        )
    }

}

export default customerLogin;

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