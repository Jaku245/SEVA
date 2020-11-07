import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Loader from '../../shared/Loader';
import carpenter from '../../resources/carpenter.jpg';
import { env } from '../../shared/supports';

class manageCustomers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            admin: null,
            customers: null,
            loaderVisible: false
        }
    }

    showLoader() {
        this.setState({ loaderVisible: true })
    }

    hideLoader() {
        this.setState({ loaderVisible: false })
    }

    logOut() {
        this.showLoader();
        fetch(env.api + "admin/logout/", {
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
                    this.props.navigation.navigate('login');
                }
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                throw error;
            });
    }

    async getAdmin() {
        await this.showLoader();
        try {
            let adminWithOutParse = await AsyncStorage.getItem('admin');
            let admin = JSON.parse(adminWithOutParse);
            // console.log(token);

            if (admin != null) {
                this.setState({
                    admin: admin
                });
            } else {

            }

        } catch (error) {
            // Error saving data
        }
    }

    async getToken() {
        try {
            let token = await AsyncStorage.getItem('token');
            // console.log(token);

            if (token != null) {
                this.setState({
                    token: token
                });
            } else {

            }

        } catch (error) {
            // Error saving data
        }
    }

    flagCustomer(id){
        fetch(env.api + "admin/flag/customer/"+ id +"/" + this.state.admin.adminId, {
            method: "PUT",
            headers: {
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    console.log(data.message);
                    this.fetchCustomers();
                }
            });
    }

    unFlagCustomer(id){
        console.log("Not Added.");
    }

    async fetchCustomers() {
        await fetch(env.api + "admin/list/customers", {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(async data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    // console.log(data.customers);
                    let customers = data.customers;
                    await customers.sort(function (a, b) {
                        const date1 = new Date(a.updatedAt);
                        const date2 = new Date(b.updatedAt);
                        if (date1.getFullYear() == date2.getFullYear()) {
                            if (date1.getMonth() == date2.getMonth()) {
                                return date2.getDate() - date1.getDate();
                            } else {
                                return date2.getMonth() - date1.getMonth();
                            }
                        } else {
                            return date2.getFullYear() - date1.getFullYear();
                        }
                    });
                    await this.setState({
                        customers: customers
                    });
                }
            });
        await this.hideLoader();
    }

    async componentDidMount() {
        await this.getAdmin();
        await this.getToken();
        await this.fetchCustomers();
        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            () => {
                this.getAdmin();
                this.fetchCustomers();
            }
        );
    }

    render() {

        let data = null;

        if (this.state.customers !== null) {
            data = this.state.customers.map(user => {
                return (
                    <Card key={user._id} containerStyle={styles.card}>
                        <View style={styles.cardHeadView}>
                            <Image source={carpenter} style={styles.cardImage} />
                            <View style={styles.cardHeadTextView}>
                                <Text style={styles.cardHeadPro}>#{user._id}</Text>
                                <Text style={styles.cardHeadName}>{user.name}</Text>
                                { user.address_book.length !== 0 ? <Text style={styles.cardHeadLoc}>{user.address_book[0].city}, {user.address_book[0].state}</Text> : null}
                            </View>
                        </View>
                        <Divider />
                        <View style={styles.briefBottom}>
                            <TouchableOpacity style={styles.rescheduleBtn}
                                onPress={() => {
                                    this.props.navigation.navigate('manageCustomerDetails', { user: user });
                                }}
                            >
                                <Ionicons name="eye-outline" color='#0099FF' size={24} />
                                <Text style={{
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: 16,
                                    color: '#0099FF'
                                }} >View</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.statusBtn}
                                onPress={() => {
                                    if(!user.isFlagged){
                                        this.flagCustomer(user._id);
                                    }else{
                                        this.unFlagCustomer(user._id);
                                    }
                                }}
                            >
                                <Ionicons name="close-circle-outline" color='#FA682E' size={24} />
                                <Text style={{
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: 16,
                                    color: '#FA682E'
                                }} >{ user.isFlagged ? 'Unblock' : 'Block'}</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                );
            })
        }

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="home-outline" color="white" size={28}
                        onPress={() => this.props.navigation.navigate('dashboard')}
                    />
                    <Text style={styles.headerText}>Manage Customers</Text>
                    <View style={{ flex: 2, flexDirection: 'row' }}>
                        <Text style={{
                            flex: 2,
                            fontFamily: 'Poppins-Regular',
                            fontSize: 14,
                            color: 'white',
                            alignSelf: 'center'
                        }}
                            onPress={() => this.logOut()}
                        >Logout</Text>
                        <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="log-out-outline" color="white" size={28}
                            onPress={() => this.logOut()}
                        />
                    </View>
                </View>
                <View style={styles.display}>
                    {data}
                    <Loader
                        loaderVisible={this.state.loaderVisible}
                        animationType="fade"
                    />
                </View>
            </View>
        );
    }
}


export default manageCustomers;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    header: {
        flexDirection: 'row',
        marginVertical: 20,
        marginHorizontal: 20,
    },
    headerText: {
        flex: 5,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: 'white',
    },
    display: {
        backgroundColor: 'white',
        paddingTop: 30,
        paddingHorizontal: 20,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
    },
    card: {
        backgroundColor: '#FCFCFC',
        borderRadius: 30,
        marginBottom: 10
    },
    cardHeadView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    cardImage: {
        flex: 2,
        maxHeight: 55,
        maxWidth: 55,
        borderRadius: 50
    },
    cardHeadTextView: {
        flex: 6,
        paddingLeft: 15
    },
    cardHeadName: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
    },
    cardHeadPro: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: 'gray',
        lineHeight: 15
    },
    cardHeadLoc: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: 'gray'
    },
    briefBottom: {
        flexDirection: 'row'
    },
    statusBtn: {
        flex: 1,
        marginTop: 10,
        alignItems: 'center'
    },
    rescheduleBtn: {
        flex: 1,
        marginTop: 10,
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: '#CCCCCC'
    },
});