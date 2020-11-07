import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import carpenter from '../../resources/carpenter.jpg'
import Loader from '../../shared/Loader';
import { env } from '../../shared/supports';

class newApplications extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            admin: null,
            requests: [],
            loaderVisible: false
        }
    }

    showLoader() {
        this.setState({ loaderVisible: true })
    }

    hideLoader() {
        this.setState({ loaderVisible: false })
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

    async takeAction(action, id) {

        console.log(action);

        await fetch(env.api + "admin/take_action/applications/" + id + "/" + this.state.admin.adminId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + this.state.token
            },
            body: JSON.stringify({
                action: action
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else if (data.message) {
                    // this.setState({
                    //     bookings: data.Bookings
                    // })
                    // this.hideLoader();
                    console.log(data.message);
                    this.fetchApplications();
                }
            });
    }

    async fetchApplications() {
        await fetch(env.api + "admin/fetch/applications/" + this.state.admin.adminId, {
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
                    // console.log(data.newApplications);
                    let applications = data.newApplications;
                    await applications.sort(function (a, b) {
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
                        requests: applications
                    });
                }
            });

        await this.hideLoader();
    }

    async componentDidMount() {
        await this.getAdmin();
        await this.getToken();
        await this.fetchApplications();
        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            () => {
                this.getAdmin();
                this.fetchApplications();
            }
        );
    }

    render() {

        let renderCards = null;

        if (this.state.requests !== null) {
            renderCards = this.state.requests.map(req => {
                return (
                    <Card key={req._id} containerStyle={styles.card}>
                        <View style={styles.cardHeadView}>
                            <Image source={carpenter} style={styles.cardImage} />
                            <View style={styles.cardHeadTextView}>
                                <Text style={styles.cardHeadName}>{req.name}</Text>
                                <Text style={styles.cardHeadPro}>{req.profession_type}</Text>
                                <Text style={styles.cardHeadLoc}>{req.personal_details.city}, {req.personal_details.state}</Text>
                            </View>
                            <TouchableOpacity style={styles.cardHeadBtn}
                                onPress={() => {
                                    this.props.navigation.navigate('newApplicationsDetails', { req: req });
                                }}
                            >
                                <Text style={styles.cardHeadBtnText}>View</Text>
                            </TouchableOpacity>
                        </View>
                        <Divider />
                        <View style={styles.briefBottom}>
                            <TouchableOpacity style={styles.rescheduleBtn}
                                onPress={() => {
                                    this.takeAction("Application Rejected", req._id)
                                }}
                            >
                                <Ionicons name="trash-outline" color='#FA682E' size={24} />
                                <Text style={{
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: 16,
                                    color: '#FA682E'
                                }} >Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.statusBtn}
                                onPress={() => {
                                    this.takeAction("Application Approved", req._id)
                                }}
                            >
                                <Ionicons name="checkmark-circle-outline" color='#49AB74' size={24} />
                                <Text style={{
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: 16,
                                    color: '#49AB74'
                                }} >Accept</Text>
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
                    <Text style={styles.headerText}>New Applications</Text>
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
                    <ScrollView>
                        {renderCards}
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


export default newApplications;

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
        borderRadius: 30
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
    cardHeadBtn: {
        flex: 3,
        backgroundColor: '#1c1c1c',
        height: 45,
        maxWidth: 60,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    cardHeadBtnText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: 'white'
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