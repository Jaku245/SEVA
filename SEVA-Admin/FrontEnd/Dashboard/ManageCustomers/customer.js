import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import carpenter from '../../resources/carpenter.jpg';
import Loader from '../../shared/Loader';
import { env } from '../../shared/supports';

class customerDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            user: null,
            id: this.props.route.params.id,
            services: [],            
            loaderVisible: false
        }
    }

    showLoader() {
        this.setState({ loaderVisible: true })
    }

    hideLoader() {
        this.setState({ loaderVisible: false })
    }

    renderBrief() {
        const user = this.state.user;
        if (this.state.user !== null)
            return (
                <Card key={user._id} containerStyle={styles.card}>
                    <View style={styles.cardHeadView}>
                        <Image source={carpenter} style={styles.cardImage} />
                        <View style={styles.cardHeadTextView}>
                            <Text style={styles.cardHeadPro}>#{user._id}</Text>
                            <Text style={styles.cardHeadName}>{user.name}</Text>
                            {user.address_book.length !== 0 ? <Text style={styles.cardHeadLoc}>{user.address_book[0].city}, {user.address_book[0].state}</Text> : null}
                        </View>
                    </View>
                    <Divider />
                    <View style={styles.briefBottom}>
                        <TouchableOpacity style={styles.statusBtn}
                            onPress={() => {
                                // this.takeAction("Rejected", this.state.booking._id)
                            }}
                        >
                            <Ionicons name="close-circle-outline" color='#FA682E' size={24} />
                            <Text style={{
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: 16,
                                color: '#FA682E'
                            }} >block</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            );
    }

    renderAddress() {
        let i = -1;
        let addresses = null;
        if (this.state.user !== null)
            if (this.state.user.address_book.length !== 0) {
                addresses = this.state.user.address_book.map(add => {
                    i++;
                    return (
                        <View key={add._id}>
                            {i === 0 ? null : <Divider style={{ marginVertical: 20 }} />}
                            <View style={styles.listItem}>
                                <Text style={styles.itemName}>House No / street</Text>
                                <Text style={styles.itemValue}>{add.address_detail1}</Text>
                            </View>
                            <View style={styles.listItem}>
                                <Text style={styles.itemName}>Locality</Text>
                                <Text style={styles.itemValue}>{add.address_detail2}</Text>
                            </View>
                            <View style={styles.listItem}>
                                <Text style={styles.itemName}>City</Text>
                                <Text style={styles.itemValue}>{add.city}</Text>
                            </View>
                            <View style={styles.listItem}>
                                <Text style={styles.itemName}>State</Text>
                                <Text style={styles.itemValue}>{add.state}</Text>
                            </View>
                            <View style={styles.listItem}>
                                <Text style={styles.itemName}>Type</Text>
                                <Text style={styles.itemValue}>{add.address_type}</Text>
                            </View>
                        </View>
                    );
                });
            }
            else {
                return (
                    <Text style={{
                        fontFamily: 'Poppins-Medium',
                        fontSize: 15,
                        textAlign: 'center',
                        paddingHorizontal: 20
                    }}>Customer has not registered addresses, yet.</Text>
                );
            }

        return (
            <View>
                {addresses}
            </View>
        );
    }

    renderDetails() {
        if (this.state.user !== null)
            return (
                <Card containerStyle={styles.card}>
                    <Text style={styles.catHead}>Personal Details</Text>
                    <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Name</Text>
                        <Text style={styles.itemValue}>{this.state.user.name}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={{
                            flex: 1,
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 16,
                        }}>Email</Text>
                        <Text style={{
                            flex: 3,
                            textAlign: 'right',
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 16,
                            color: '#808080',
                        }}>{this.state.user.email}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Phone</Text>
                        <Text style={styles.itemValue}>{this.state.user.phone}</Text>
                    </View>

                    <Divider style={{ marginVertical: 20 }} />

                    <Text style={styles.catHead}>Address Details</Text>
                    <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    {this.renderAddress()}
                </Card>
            );
    }

    renderServices() {

        let services = null
        if (this.state.services !== null) {
            services = this.state.services.map(s => {
                return (
                    <Card key={s._id} containerStyle={styles.card}>
                        <View style={styles.listItem}>
                            <Text style={styles.serviceName}>Professional</Text>
                            <Text style={styles.serviceValue}>{s.professional_name ? s.professional_name : 'Not Appointed'}</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.serviceName}>Profession</Text>
                            <Text style={styles.serviceValue}>{s.profession_type}</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.serviceName}>Date</Text>
                            <Text style={styles.serviceValue}>{s.service_date}</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.serviceName}>Status</Text>
                            <Text style={styles.serviceValue}>{s.service_status}</Text>
                        </View>
                        <Divider style={{ marginTop: 10 }} />
                        <View style={styles.briefBottom}>
                            <TouchableOpacity style={styles.statusBtn}
                                onPress={() => {
                                    this.props.navigation.navigate('customerServiceReportDetails', { booking: s });
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
        }

        if (this.state.user !== null)
            return (
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.catHead}>Services</Text>
                    <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center' }} />

                    {services}
                </View>
            );
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

    async fetchCustomer() {
        await fetch(env.api + "admin/view/customer/" + this.state.id, {
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
                    // console.log(data.bookings);
                    let bookings = data.bookings;
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
                    await this.setState({
                        user: data.customer,
                        services: bookings
                    });
                }
            });

        await this.hideLoader();
    }

    async componentDidMount() {
        await this.getToken();
        await this.fetchCustomer();
        // this.willFocusSubscription = await this.props.navigation.addListener(
        //     'focus',
        //     () => {
        //         this.fetchCustomer();
        //     }
        // );
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.display}>
                    {this.renderBrief()}
                    <ScrollView>
                        <View style={{ paddingBottom: 30 }}>
                            {this.renderDetails()}
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

export default customerDetails;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    display: {
        backgroundColor: 'white',
        marginTop: 15,
        paddingTop: 20,
        paddingHorizontal: 15,
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
        fontSize: 15,
        color: '#808080',
    },
    serviceName: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
    },
    serviceValue: {
        flex: 2,
        textAlign: 'right',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#808080',
    },
    viewBtn: {
        flex: 3,
        backgroundColor: '#1c1c1c',
        height: 25,
        maxWidth: 60,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    viewBtnText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: 'white'
    },
});