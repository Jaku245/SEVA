import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import carpenter from '../../resources/carpenter.jpg';
import Loader from '../../shared/Loader';
import { env } from '../../shared/supports';

class professionalDetails extends Component {

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
                            <Text style={styles.cardHeadLoc}>{user.personal_details.city}, {user.personal_details.state}</Text>
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

    renderDetails() {
        if (this.state.user !== null) {
            let date = new Date(this.state.user.personal_details.date_of_birth);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return (
                <Card containerStyle={styles.card}>
                    <Text style={styles.catHead}>Personal Details</Text>
                    <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Name</Text>
                        <Text style={styles.itemValue}>{this.state.user.name}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Aadhar Card</Text>
                        <Text style={styles.itemValue}>{this.state.user.personal_details.aadhar_number}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Gender</Text>
                        <Text style={styles.itemValue}>{this.state.user.personal_details.gender}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Date of Birth</Text>
                        <Text style={styles.itemValue}>{day + ' / ' + month + ' / ' + year}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>c/o</Text>
                        <Text style={styles.itemValue}>{this.state.user.personal_details.care_of}</Text>
                    </View>

                    <Divider style={{ marginVertical: 20 }} />

                    <Text style={styles.catHead}>Address Details</Text>
                    <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>House No / street</Text>
                        <Text style={styles.itemValue}>{this.state.user.personal_details.address_details1}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Locality</Text>
                        <Text style={styles.itemValue}>{this.state.user.personal_details.address_details2}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>City</Text>
                        <Text style={styles.itemValue}>{this.state.user.personal_details.city}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>State</Text>
                        <Text style={styles.itemValue}>{this.state.user.personal_details.state}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Pincode</Text>
                        <Text style={styles.itemValue}>{this.state.user.personal_details.pincode}</Text>
                    </View>

                    <Divider style={{ marginVertical: 20 }} />

                    <Text style={styles.catHead}>Bank Details</Text>
                    <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Name</Text>
                        <Text style={styles.itemValue}>{this.state.user.bank_details ? this.state.user.bank_details.accountholder_name : 'Not Added'}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>A / C Number</Text>
                        <Text style={styles.itemValue}>{this.state.user.bank_details ? this.state.user.bank_details.account_number : 'Not Added'}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>IFSC Code</Text>
                        <Text style={styles.itemValue}>{this.state.user.bank_details ? this.state.user.bank_details.ifsc_code : 'Not Added'}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Cancelled Cheque</Text>
                        <TouchableOpacity style={styles.viewBtn}>
                            <Text style={styles.viewBtnText}>View</Text>
                        </TouchableOpacity>
                    </View>

                    <Divider style={{ marginVertical: 20 }} />

                    <Text style={styles.catHead}>Identity Documents</Text>
                    <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Aadhar Card Front</Text>
                        <TouchableOpacity style={styles.viewBtn}>
                            <Text style={styles.viewBtnText}>View</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Aadhar Card Back</Text>
                        <TouchableOpacity style={styles.viewBtn}>
                            <Text style={styles.viewBtnText}>View</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Pad Card</Text>
                        <TouchableOpacity style={styles.viewBtn}>
                            <Text style={styles.viewBtnText}>View</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Address Proof</Text>
                        <TouchableOpacity style={styles.viewBtn}>
                            <Text style={styles.viewBtnText}>View</Text>
                        </TouchableOpacity>
                    </View>

                    <Divider style={{ marginVertical: 20 }} />

                    <Text style={styles.catHead}>Awards & Certifications</Text>
                    <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Attachment 1</Text>
                        <TouchableOpacity style={styles.viewBtn}>
                            <Text style={styles.viewBtnText}>View</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            );
        }
    }

    renderServices() {
        const services = this.state.services.map(s => {
            return (
                <Card key={s._id} containerStyle={styles.card}>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Customer</Text>
                        <Text style={styles.itemValue}>{s.customer_name}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Service Type</Text>
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
                                this.props.navigation.navigate('professionalReports', { booking: s });
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

    async fetchProfessionals() {
        await fetch(env.api + "admin/view/professional/" + this.state.id, {
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
                    // console.log(data.bookings);
                    this.setState({
                        user: data.professional,
                        services: data.bookings
                    });
                }
            });

            await this.hideLoader();
    }

    async componentDidMount() {
        await this.getToken();
        await this.fetchProfessionals();
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

export default professionalDetails;

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