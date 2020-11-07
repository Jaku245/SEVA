import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Loader from '../shared/Loader';
import { env } from '../shared/supports';

class dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            admin: null,
            loaderVisible: false,
            token: ''
        }
    }

    showLoader() {
        this.setState({ loaderVisible: true })
    }

    hideLoader() {
        this.setState({ loaderVisible: false })
    }

    async storeAdmin(admin) {
        await AsyncStorage.setItem('admin', JSON.stringify(admin));
    }

    async getAdmin() {
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

        await this.hideLoader();
    }

    async getToken() {
        await this.showLoader();
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

    async fetchAdmin() {
        await fetch(env.api + "admin/userDetails", {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    // console.log(data.admin);
                    this.storeAdmin(data.admin);
                    this.setState({
                        admin: data.admin
                    });
                }
            });

            await this.hideLoader();
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
                    AsyncStorage.removeItem('admin');
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

    async componentDidMount() {
        await this.getToken();
        await this.fetchAdmin();
        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            () => {
                this.getToken();
                this.getAdmin();
            }
        );
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    {/* <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="menu-outline" color="white" size={28}
                    // onPress={() => this.props.navigation.toggleDrawer()} 
                    /> */}
                    <Text style={styles.headerText}>Home</Text>
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
                    <Text style={styles.greetingsText}>Hello, {this.state.admin ? this.state.admin.name : 'Admin'}</Text>

                    <ScrollView>
                        <View style={styles.applicationCards}>
                            <View style={styles.cardView}>
                                <Card containerStyle={styles.card} >
                                    <Ionicons name="newspaper-outline" size={60} style={styles.cardIcon}
                                        onPress={() => navigate('newApplicationsNavigator')}
                                    />
                                    <Text style={styles.cardText}
                                        onPress={() => navigate('newApplicationsNavigator')}
                                    >New Applications</Text>
                                </Card>
                            </View>
                            <View style={styles.cardView}>
                                <Card containerStyle={styles.card} >
                                    <Ionicons name="book-outline" size={60}
                                        style={{
                                            flex: 2,
                                            alignSelf: 'center',
                                            justifyContent: 'center',
                                            paddingTop: 10
                                        }}
                                        onPress={() => navigate('serviceReportsNavigator')}
                                    />
                                    <Text style={styles.cardText}
                                        onPress={() => navigate('serviceReportsNavigator')}
                                    >Service Reports</Text>
                                </Card>
                            </View>
                        </View>
                        <View style={styles.applicationCards}>
                            <View style={styles.cardView}>
                                <Card containerStyle={styles.card}>
                                    <Ionicons name="people-outline" size={60} style={styles.cardIcon}
                                        onPress={() => navigate('manageCustomersNavigator')}
                                    />
                                    <Text style={styles.cardText}
                                        onPress={() => navigate('manageCustomersNavigator')}
                                    >Manage Customers</Text>
                                </Card>
                            </View>
                            <View style={styles.cardView}>
                                <Card containerStyle={styles.card}>
                                    <Ionicons name="briefcase-outline" size={60} style={styles.cardIcon}
                                        onPress={() => navigate('manageProfessionalsNavigator')}
                                    />
                                    <Text style={styles.cardText}
                                        onPress={() => navigate('manageProfessionalsNavigator')}
                                    >Manage Professionals</Text>
                                </Card>
                            </View>
                        </View>
                        <View style={styles.applicationCards}>
                            <View style={styles.cardView}>
                                <Card containerStyle={styles.card}>
                                    <Ionicons name="construct-outline" size={60} style={styles.cardIcon}
                                        onPress={() => navigate('manageServicesNavigator')}
                                    />
                                    <Text style={styles.cardText}
                                        onPress={() => navigate('manageServicesNavigator')}
                                    >Manage Services</Text>
                                </Card>
                            </View>
                            <View style={styles.cardView}>
                                <Card containerStyle={styles.card}>
                                    <Ionicons name="podium-outline" size={60} style={styles.cardIcon}
                                        onPress={() => navigate('companyReportsNavigator')}
                                    />
                                    <Text style={styles.cardText}
                                        onPress={() => navigate('companyReportsNavigator')}
                                    >Company Statistics</Text>
                                </Card>
                            </View>
                        </View>
                    </ScrollView>
                    <Loader
                        loaderVisible={this.state.loaderVisible}
                        animationType="fade"
                    />
                </View>
            </View>
        );
    }
}

export default dashboard;

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
        fontSize: 20,
        color: 'white',
        marginLeft: 15
    },
    display: {
        backgroundColor: 'white',
        paddingTop: 30,
        paddingHorizontal: 20,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
    },
    greetingsText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 30,
        alignSelf: 'center'
    },
    applicationCards: {
        flexDirection: 'row',
        paddingRight: 15
    },
    cardView: {
        flex: 1
    },
    card: {
        height: 160,
        width: 160,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardIcon: {
        flex: 2,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingTop: 10
    },
    cardText: {
        flex: 1,
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        textAlign: 'center'
    },
});