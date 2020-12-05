import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';

class customerMore extends Component {

    state={
        token : null,
        loaderVisible: false
    };

    showLoader() {
        this.setState({ loaderVisible: true })
    }
    hideLoader() {
        this.setState({ loaderVisible: false })
    }

    getToken = async () => {
        try {
            let token = await AsyncStorage.getItem('token');

            if (token != null) {
                this.setState({
                    token: token
                });
            } else {

            }

        } catch (error) {
            // Error saving data
        }
    };

    async logOut() {

        this.showLoader();

        await this.getToken();

        await fetch(env.api + "customer/logout/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.hideLoader();
                    alert(data.error);
                } else {
                    console.log(data.message);
                    AsyncStorage.removeItem('token');
                    this.hideLoader();
                    this.props.navigation.navigate('SelectRole');
                }
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                throw error;
            });
    }

    render() {

        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={styles.display}>
                    <TouchableOpacity style={styles.list}>
                        <Ionicons style={styles.icon} name="help-circle-outline" size={28}
                        />
                        <Text style={styles.text} onPress={() => navigate('help')}>Help</Text>
                    </TouchableOpacity>
                    <Divider style={{ marginVertical: 5, width: '88%', alignSelf: 'flex-end' }} />
                    <TouchableOpacity style={styles.list}>
                        <Ionicons style={styles.icon} name="location-outline" size={28} />
                        <Text style={styles.text} onPress={() => navigate('manageAddresses')}>Manage Addresses</Text>
                    </TouchableOpacity>
                    <Divider style={{ marginVertical: 5, width: '88%', alignSelf: 'flex-end' }} />
                    <TouchableOpacity style={styles.list}>
                        <Ionicons style={styles.icon} name="information-circle-outline" size={28} />
                        <Text style={styles.text} onPress={() => navigate('about')}>About seva.</Text>
                    </TouchableOpacity>
                    <Divider style={{ marginVertical: 5, width: '88%', alignSelf: 'flex-end' }} />
                    <TouchableOpacity style={styles.list}>
                        <Ionicons style={styles.icon} name="share-social-outline" size={28} />
                        <Text style={styles.text}>Share seva.</Text>
                    </TouchableOpacity>
                    <Divider style={{ marginVertical: 5, width: '88%', alignSelf: 'flex-end' }} />
                    <TouchableOpacity style={styles.list}>
                        <Ionicons style={styles.icon} name="shield-outline" size={28} />
                        <Text style={styles.text} onPress={() => navigate('terms')}>Terms {'&'} Conditions</Text>
                    </TouchableOpacity>
                    <Divider style={{ marginVertical: 5, width: '88%', alignSelf: 'flex-end' }} />
                    <TouchableOpacity style={styles.list}>
                        <Ionicons style={styles.icon} name="star-outline" size={28} />
                        <Text style={styles.text}>Rate us</Text>
                    </TouchableOpacity>
                    <Divider style={{ marginVertical: 5, width: '88%', alignSelf: 'flex-end' }} />
                    <Text style={{
                        marginTop: '45%',
                        fontFamily: 'Poppins-Regular',
                        fontSize: 16,
                        alignSelf: 'center'
                    }}>ver 0.00.01</Text>
                    <TouchableOpacity style={styles.button} onPress={() => this.logOut()}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                    <Loader
                        loaderVisible={this.state.loaderVisible}
                        animationType="fade"
                    />
                </View>
            </View>
        );
    }
}

export default customerMore;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    display: {
        backgroundColor: 'white',
        marginTop: 30,
        paddingTop: 50,
        paddingHorizontal: 25,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
    },
    list: {
        flexDirection: 'row'
    },
    icon: {
        flex: 1,
        alignSelf: 'center'
    },
    text: {
        flex: 5,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 23
    },
    button: {
        alignSelf: 'center',
        width: '75%',
        height: 50,
        backgroundColor: '#1c1c1c',
        borderRadius: 25,
        justifyContent: 'center'
    },
    buttonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    }
});