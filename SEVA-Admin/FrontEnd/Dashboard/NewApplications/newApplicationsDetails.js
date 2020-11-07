import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import carpenter from '../../resources/carpenter.jpg'
import { env } from '../../shared/supports';

class newApplicationsDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            admin: null,
            request: this.props.route.params.req,
            // request: {
            //     personal_details: {
            //         name: 'Jaimin Desai',
            //         aadhar_number: '123456784321',
            //         gender: 'Male',
            //         date_of_birth: '2000-05-24T17:12:55.329Z',
            //         care_of: 'Kanubhai Desai',
            //         address_details1: '21, shreeji bapa nagar Society',
            //         address_details2: 'Modhera road',
            //         pincode: 384002,
            //         city: 'Mahesana',
            //         state: 'Gujrat'
            //     },
            //     identity_proof: {
            //         pancard_image: '..\public\professional\applicationForm\identityProof\aadharfront-5f6e381cf0ac676798b8158c-1602266201228.jpeg',
            //         aadhar_front: '..\public\professional\applicationForm\identityProof\aadharback-5f6e381cf0ac676798b8158c-1602266201230.jpeg',
            //         aadhar_back: '..\public\professional\applicationForm\identityProof\pancard-5f6e381cf0ac676798b8158c-1602266201231.jpeg',
            //         address_proof: '..\public\professional\applicationForm\identityProof\addressProof-5f6e381cf0ac676798b8158c-1602266201261.jpeg'
            //     },
            //     bank_details: {
            //         accountholder_name: 'Jaimin Desai',
            //         account_number: 1234567890,
            //         ifsc_code: 'SYNB1234',
            //         cancelled_cheque: '..\public\professional\applicationForm\bankDetails\cancelled_cheque-5f6e381cf0ac676798b8158c-1602268075231.jpeg'
            //     },
            //     attachments: [
            //         '..\public\professional\applicationForm\attachments\att_1-5f6e381cf0ac676798b8158c-1602269423574.jpeg',
            //         '',
            //         '',
            //         '',
            //         '',
            //         ''
            //     ],
            //     _id: '5f80b717a493984c29875d4a',
            //     phone: '91-9726925105',
            //     professionalId: '5f6e381cf0ac676798b8158c',
            //     name: 'Jaimin Desai',
            //     email: 'desaijamim5@gmail.com',
            //     profession_type: 'Plumber',
            //     profile_image: '..\public\professional\profilePhoto\professional-5f6e381cf0ac676798b8158c-1602266296036.jpeg',
            //     status: 'Pending for approval',
            //     createdAt: '2020 - 10 - 09T19: 16: 39.118Z',
            //     updatedAt: '2020 - 10 - 09T19: 16: 39.118Z',
            //     __v: 0
            // }
        }
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

    async takeAction(action, id){
        
        await fetch(env.api + "admin/take_action/applications/"+ id + "/" + this.state.admin.adminId, {
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
                    this.props.navigation.navigate('newApplications');
                }
            });
    }

    renderBrief() {
        const req = this.state.request;
        return (
            <Card containerStyle={styles.card}>
                <View style={styles.cardHeadView}>
                    <Image source={carpenter} style={styles.cardImage} />
                    <View style={styles.cardHeadTextView}>
                        <Text style={styles.cardHeadName}>{req.name}</Text>
                        <Text style={styles.cardHeadPro}>{req.profession_type}</Text>
                        <Text style={styles.cardHeadLoc}>{req.personal_details.city}, {req.personal_details.state}</Text>
                    </View>
                </View>
                <Divider />
                <View style={styles.briefBottom}>
                    <TouchableOpacity style={styles.rescheduleBtn}
                        onPress={() => {
                            this.takeAction("Application Rejected", this.state.request._id)
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
                            this.takeAction("Application Approved", this.state.request._id)
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
    }

    renderDetails() {
        let date = new Date(this.state.request.personal_details.date_of_birth);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return (
            <Card containerStyle={styles.card}>
                <Text style={styles.catHead}>Personal Details</Text>
                <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>Name</Text>
                    <Text style={styles.itemValue}>{this.state.request.name}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>Aadhar Card</Text>
                    <Text style={styles.itemValue}>{this.state.request.personal_details.aadhar_number}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>Gender</Text>
                    <Text style={styles.itemValue}>{this.state.request.personal_details.gender}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>Date of Birth</Text>
                    <Text style={styles.itemValue}>{day + ' / ' + month + ' / ' + year}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>c/o</Text>
                    <Text style={styles.itemValue}>{this.state.request.personal_details.care_of}</Text>
                </View>

                <Divider style={{ marginVertical: 20 }} />

                <Text style={styles.catHead}>Address Details</Text>
                <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>House No / street</Text>
                    <Text style={styles.itemValue}>{this.state.request.personal_details.address_details1}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>Locality</Text>
                    <Text style={styles.itemValue}>{this.state.request.personal_details.address_details2}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>City</Text>
                    <Text style={styles.itemValue}>{this.state.request.personal_details.city}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>State</Text>
                    <Text style={styles.itemValue}>{this.state.request.personal_details.state}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>Pincode</Text>
                    <Text style={styles.itemValue}>{this.state.request.personal_details.pincode}</Text>
                </View>

                <Divider style={{ marginVertical: 20 }} />

                <Text style={styles.catHead}>Bank Details</Text>
                <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>Name</Text>
                    <Text style={styles.itemValue}>{this.state.request.bank_details.accountholder_name}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>A / C Number</Text>
                    <Text style={styles.itemValue}>{this.state.request.bank_details.account_number}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>IFSC Code</Text>
                    <Text style={styles.itemValue}>{this.state.request.bank_details.ifsc_code}</Text>
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

    async componentDidMount() {
        await this.getToken();
        await this.getAdmin();
        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            () => {
                this.getAdmin();
            }
        );
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.display}>
                    {this.renderBrief()}
                    <ScrollView>
                        <View style={{ paddingBottom: 30 }}>
                            {this.renderDetails()}
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

export default newApplicationsDetails;

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