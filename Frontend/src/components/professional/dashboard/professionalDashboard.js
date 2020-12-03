import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { RefreshControl, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Card } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Loader from '../../shared/Loader';
import carpenter from '../../../../resources/carpenter.jpg';
import { env } from '../../shared/supports';

class professionalDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            professional: null,
            token: null,
            loaderVisible: false,
            refreshing: false
        };
        this.getProfessional();
        this.getToken();
    }

    showLoader() {
        this.setState({ loaderVisible: true })
    }

    hideLoader() {
        this.setState({ loaderVisible: false })
    }

    showRefresh() {
        this.setState({ refreshing: true })
    }
    hideRefresh() {
        this.setState({ refreshing: false })
    }

    async getToken() {
        let token = await AsyncStorage.getItem('token');
        if (token !== null) {
            this.setState({
                token: token
            });
        }
        await this.hideRefresh();
    }

    async getProfessional() {
        let professionalWithOutParse = await AsyncStorage.getItem('professional');
        let professional = JSON.parse(professionalWithOutParse);

        if (professional !== null) {
            await this.setState({
                professional: professional
            });
        }

        await this.hideLoader();
        await this.hideRefresh();
    }

    renderProfile() {
        if (this.state.professional !== null) {
            if (this.state.professional.profile_image !== "") {
                // console.log(this.state.professional.profile_image);
                return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('addProfile')}>
                        <Image
                            source={{
                                uri: env.api + 'backend/' + this.state.professional.profile_image
                            }}
                            style={styles.image}
                        />
                    </TouchableOpacity>
                );
            } else {
                return (
                    <TouchableOpacity style={styles.image} onPress={() => this.props.navigation.navigate('addProfile')}>
                        <Text style={styles.imageText}>+</Text>
                        <Text style={styles.imageText}>Add photo</Text>
                    </TouchableOpacity>
                );
            }
        } else {
            return (
                <TouchableOpacity style={styles.image} onPress={() => this.props.navigation.navigate('addProfile')}>
                    <Text style={styles.imageText}>+</Text>
                    <Text style={styles.imageText}>Add photo</Text>
                </TouchableOpacity>
            );
        }
    }

    logOut() {

        this.showLoader();
        fetch(env.api + "professional/logout/", {
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
                    this.hideLoader();
                    console.log(data.message);
                    AsyncStorage.removeItem('token');
                    AsyncStorage.removeItem('professional');
                    this.props.navigation.navigate('SelectRole');
                }
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                throw error;
            });
    }

    storeProfessional = async (professional) => {
        // console.log(professional)
        try {
            await AsyncStorage.setItem(
                'professional',
                JSON.stringify(professional)
            );
        } catch (error) {
            // Error saving data
        }
    };

    fetchCustomer() {
        // console.log(this.state.token);
        fetch(env.api + "professional/userDetails", {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.hideLoader();
                    this.hideRefresh();
                    alert(data.error);
                } else {
                    // console.log(data.professional);
                    this.storeProfessional(data.professional);
                    this.setState({
                        professional: data.professional
                    });
                    this.hideLoader();
                    this.hideRefresh();
                }
            });
    }

    submitForApproval() {
        console.log(this.state.token);

        fetch(env.api + "professional/submitApplication/" + this.state.professional._id, {
            method: "POST",
            headers: {
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(data.message);
                }
            });
    }

    async componentDidMount() {
        
        this.showLoader();
        await this.getToken();
        await this.fetchCustomer();
        // await this.getProfessional();

        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            async () => {
                await this.getToken();
                await this.fetchCustomer();
            }
        );
    }

    async handleRefresh() {
        this.showRefresh();
        await this.getToken();
        await this.fetchCustomer();
    }

    async resubmit() {
        await this.showLoader();
        await fetch(env.api + "professional/resubmitApplication/" + this.state.professional._id, {
            method: "POST",
            headers: {
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.hideLoader();
                    alert(data.error);
                } else {
                    // alert(data.message);
                    // this.hideLoader();
                    this.fetchCustomer();
                }
            });
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="menu-outline" color="white" size={28} onPress={() => this.props.navigation.toggleDrawer()} />
                    <Text style={styles.headerText}>Profile</Text>
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
                        <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="log-out-outline" color="white" size={28} onPress={() => this.logOut()} />
                    </View>
                </View>
                <View style={styles.display}>
                    <View style={styles.greetings}>
                        <View style={styles.greetingsTextView}>
                            <Text style={styles.greetingsText}>Hello,</Text>
                            <Text style={styles.greetingsName}>{this.state.professional ? this.state.professional.name : ''}</Text>
                        </View>
                        {this.renderProfile()}
                    </View>
                    {
                        this.state.professional
                            ?
                            this.state.professional.status == "Not Submitted"
                                ?
                                <Text style={{
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: 15,
                                    marginTop: 15,
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                    marginRight: 5
                                }}>
                                    Complete your profile in just few more steps.
                                    </Text>
                                :
                                null
                            :
                            null
                    }
                    <View style={styles.statusView}>
                        <Text style={styles.statusText}>Application Status</Text>
                        <Text style={styles.status}>{this.state.professional ? this.state.professional.status : ''}</Text>
                    </View>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.handleRefresh()} />
                        }
                    >
                        {
                            this.state.professional
                                ?
                                this.state.professional.status == "Not Submitted"
                                    ?
                                    <View>
                                        <View style={styles.applicationCards}>
                                            <View style={styles.cardView}>
                                                <Card containerStyle={styles.card} >
                                                    <Ionicons name="newspaper-outline" size={60} style={styles.cardIcon} onPress={() => navigate('personalDetails')} />
                                                    <Text style={styles.cardText} onPress={() => navigate('personalDetails')}>Personal Details</Text>
                                                </Card>
                                            </View>
                                            <View style={styles.cardView}>
                                                <Card containerStyle={styles.card} >
                                                    <Ionicons name="trophy-outline" size={60}
                                                        style={{
                                                            flex: 2,
                                                            alignSelf: 'center',
                                                            justifyContent: 'center',
                                                            paddingTop: 10
                                                        }}
                                                        onPress={() => navigate('identity')}
                                                    />
                                                    <Text style={styles.cardText} onPress={() => navigate('identity')}>Identity Verification</Text>
                                                </Card>
                                            </View>
                                        </View>
                                        <View style={styles.applicationCards}>
                                            <View style={styles.cardView}>
                                                <Card containerStyle={styles.card}>
                                                    <Ionicons name="briefcase-outline" size={60} style={styles.cardIcon} onPress={() => navigate('bankDetails')} />
                                                    <Text style={styles.cardText} onPress={() => navigate('bankDetails')}>Bank Details</Text>
                                                </Card>
                                            </View>
                                            <View style={styles.cardView}>
                                                <Card containerStyle={styles.card}>
                                                    <Ionicons name="images-outline" size={60} style={styles.cardIcon} onPress={() => navigate('certifications')} />
                                                    <Text style={styles.cardText} onPress={() => navigate('certifications')}>Attach Photos</Text>
                                                </Card>
                                            </View>
                                        </View>
                                    </View>
                                    :
                                    this.state.professional.status == "Pending for approval"
                                        ?
                                        <Text style={{
                                            fontFamily: 'Poppins-Medium',
                                            textAlign: 'center',
                                            fontSize: 14,
                                            marginTop: 100,
                                            paddingHorizontal: 20
                                        }}>
                                            Your application is under consideration please wait for approval.
                                        </Text>
                                        :
                                        this.state.professional.status == "Application Approved"
                                            ?
                                            <Text style={{
                                                fontFamily: 'Poppins-Medium',
                                                textAlign: 'center',
                                                fontSize: 14,
                                                marginTop: 100,
                                                paddingHorizontal: 20,
                                                color: 'green'
                                            }}>
                                                Your Application is Approved.{'\n\n'}Daily check new requests tab for accepting requests from customers.
                                            </Text>
                                            :
                                            <View>
                                                <Text style={{
                                                    fontFamily: 'Poppins-Medium',
                                                    textAlign: 'center',
                                                    fontSize: 14,
                                                    marginTop: 100,
                                                    paddingHorizontal: 20,
                                                    color: 'red'
                                                }}>
                                                    Your Application is rejected.{'\n'}You have to resubmit the data.
                                                </Text>
                                                <TouchableOpacity style={{
                                                    backgroundColor: '#1c1c1c',
                                                    height: 40,
                                                    width: 200,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    alignSelf: 'center',
                                                    borderRadius: 15,
                                                    marginTop: 20
                                                }}
                                                    onPress={() => {
                                                        this.resubmit();
                                                    }}
                                                >
                                                    <Text style={{
                                                        fontFamily: 'Poppins-Medium',
                                                        fontSize: 16,
                                                        color: 'white'
                                                    }}>Resubmit</Text>
                                                </TouchableOpacity>
                                            </View>
                                :
                                null
                        }
                    </ScrollView>
                    {
                        this.state.professional
                            ?
                            this.state.professional.status == "Not Submitted"
                                ?
                                <View style={styles.selectDateTimeButton}>
                                    <TouchableOpacity style={styles.selectDateTimeButtonOpacity} onPress={() => {
                                        this.submitForApproval();
                                    }}>
                                        <Text style={styles.selectDateTimeButtonText}>Submit for Approval</Text>
                                        <Ionicons style={styles.selectDateTimeButtonIcon} name="arrow-forward-outline" color="white" size={24} />
                                    </TouchableOpacity>
                                </View>
                                :
                                null
                            :
                            null
                    }
                    <Loader
                        loaderVisible={this.state.loaderVisible}
                        animationType="fade"
                    />
                </View>
            </View>
        )
    }
}

export default professionalDashboard;

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
        color: 'white'
    },
    display: {
        backgroundColor: 'white',
        paddingTop: 30,
        paddingHorizontal: 25,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
    },
    greetings: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    greetingsTextView: {
        flex: 3,
        paddingLeft: 10
    },
    greetingsText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 30,
    },
    greetingsName: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 30,
        lineHeight: 33
    },
    image: {
        maxHeight: 100,
        maxWidth: 100,
        minHeight: 100,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEC28E',
        borderRadius: 100
    },
    imageText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: 'white'
    },
    statusView: {
        flexDirection: 'row',
        backgroundColor: '#E8E8E8',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 15
    },
    statusText: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    status: {
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#EB0000'
    },
    applicationCards: {
        flexDirection: 'row'
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
        flex: 3,
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
    selectDateTimeButtonOpacity: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f1f1f',
        height: 50,
        width: 350,
        borderRadius: 25,
        marginBottom: 80,
        flexDirection: 'row',
        paddingLeft: 30,
        marginTop: 10
    },
    selectAddressButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0
    },
    selectDateTimeButtonText: {
        flex: 4,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        color: '#fff'
    },
    selectDateTimeButtonIcon: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'flex-end',
    },
});