import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import carpenter from '../../resources/carpenter.jpg';
import Loader from '../../shared/Loader';
import { env } from '../../shared/supports';

class serviceReports extends Component {

    constructor(props) {
        super(props);
        this.state = {
            services: [],
            token: null,
            admin: null,
            cities: [],
            states: [],
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

    renderServices() {
        const services = this.state.services.map(s => {
            return (
                <Card key={s._id} containerStyle={styles.card}>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Professional</Text>
                        <Text style={styles.itemValue}>{s.professional_name}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Profession</Text>
                        <Text style={styles.itemValue}>{s.profession_type}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Date</Text>
                        <Text style={styles.itemValue}>{s.service_date}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Status</Text>
                        <Text style={styles.itemValue}>{s.service_status}</Text>
                    </View>
                    <Divider style={{ marginTop: 10 }} />
                    <View style={styles.briefBottom}>
                        <TouchableOpacity style={styles.statusBtn}
                            onPress={() => {
                                this.props.navigation.navigate('serviceDetails', { booking: s });
                            }}
                        >
                            <Ionicons name="eye-outline" color='#0099FF' size={24} />
                            <Text style={{
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: 16,
                                color: '#0099FF'
                            }} >View</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            );
        })
        return (
            <View>
                <Text style={styles.catHead}>Services</Text>
                <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center' }} />

                {services}
            </View>
        );
    }

    async fetchReports() {
        await fetch(env.api + "admin/all/bookings", {
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
                    // await console.log(data.bookings);
                    let bookings = data.bookings;
                    // await console.log(bookings);
                    await bookings.sort(function (a, b) {
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

                    var cities = [];
                    var states = [];

                    bookings.forEach(b => {
                        if(!cities.includes(b.service_address.city)){
                            cities.push(b.service_address.city);
                        }
                        if(!states.includes(b.service_address.state)){
                            states.push(b.service_address.state);
                        }
                    });

                    console.log(cities);
                    console.log(states);

                    await this.setState({
                        services: bookings
                    });
                }
            });

        await this.hideLoader();
    }

    async componentDidMount() {
        await this.getToken();
        await this.getAdmin();
        await this.fetchReports();
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="home-outline" color="white" size={28}
                        onPress={() => this.props.navigation.navigate('dashboard')}
                    />
                    <Text style={styles.headerText}>Service Reports</Text>
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
                        <View style={{ paddingBottom: 80 }}>
                            {this.renderServices()}
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


export default serviceReports;

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
    briefBottom: {
        flexDirection: 'row'
    },
    statusBtn: {
        flex: 1,
        marginTop: 10,
        alignItems: 'center'
    },
    catHead: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        alignSelf: 'center'
    },
    listItem: {
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    itemName: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
    },
    itemValue: {
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#808080',
    },
});