import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { RefreshControl, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { env } from '../../../shared/supports';
import Loader from '../../../shared/Loader';

class newRequests extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaderVisible: false,
            refreshing: false,
            bookings: [],
            token: null,
            professional: null,
            month: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ]
        };
        this.getToken();
        this.getProfessional();
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

    getToken = async () => {
        try {
            let token = await AsyncStorage.getItem('token');
            // console.log(token);

            if (token != null) {
                this.setState({
                    token: token
                });
            } else {

            }
            this.hideRefresh();
        } catch (error) {
            // Error saving data
            this.hideRefresh();
        }
    };

    async getProfessional() {
        try {
            let professionalWithOutParse = await AsyncStorage.getItem('professional');
            let professional = JSON.parse(professionalWithOutParse);

            if (professional !== null) {
                this.setState({
                    professional: professional,
                });
            } else {

            }

        } catch (error) {
            // Error saving data
        }
    }

    async fetchServices() {


        await this.getToken();
        await this.getProfessional();

        await fetch(env.api + "professional/serviceRequest/fetch/" + this.state.professional._id, {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(async data => {
                // console.log(data);
                if (data.error) {
                    this.hideLoader();
                    this.hideRefresh();
                    alert(data.error);
                } else if (data.bookings) {
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
                        bookings: bookings
                    })
                    this.hideLoader();
                    this.hideRefresh();
                    // console.log(data.bookings);
                }
            });
    }

    async takeAction(action, id) {

        this.showLoader();

        await fetch(env.api + "professional/serviceRequest/action/" + this.state.professional._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + this.state.token
            },
            body: JSON.stringify({
                action_taken: action,
                booking_id: id
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
                    console.log(data.message);
                    this.fetchServices();
                }
            });
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
                    this.props.navigation.navigate('SelectRole');
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
        await this.getProfessional();

        await this.showLoader();
        if (this.state.professional.status != 'Application Approved') {


            // this.getToken();
            await this.fetchServices();

            this.willFocusSubscription = await this.props.navigation.addListener(
                'focus',
                async () => {
                    await this.fetchServices();
                }
            );
        } else {
            await this.hideLoader();
        }
    }

    async handleRefresh() {
        this.showRefresh();
        await this.fetchServices();
    }

    render() {

        let bookings = null;

        const { navigate } = this.props.navigation;

        if (this.state.bookings) {
            bookings = this.state.bookings.map(b => {
                const dateArray = b.service_date.split('/');
                const date = dateArray[0];
                const month = this.state.month[dateArray[1] - 1];
                const year = dateArray[2];
                const day = dateArray[3];
                return (

                    <Card key={b._id} containerStyle={styles.card} >
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('newRequestServiceDetails', { booking: b })} >
                            <View style={styles.list}>
                                <Text style={styles.title}>Customer Name</Text>
                                <Text style={styles.value}>: {b.customer_name}</Text>
                            </View>
                            <View style={styles.list}>
                                <Text style={styles.title}>Service Type</Text>
                                <Text style={styles.value}>: {b.profession_type}</Text>
                            </View>
                            <View style={styles.list}>
                                <Text style={styles.title}>Cost</Text>
                                <Text style={styles.value}>: {b.total_price}</Text>
                            </View>
                            <View style={styles.list}>
                                <Text style={styles.title}>Date</Text>
                                <Text style={styles.value}>: {day}, {date} {month}, {year} {'\n  '}at {b.service_time} pm</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.touch}>
                            <Text style={styles.touchAccept} onPress={() => {
                                this.takeAction("Accepted", b._id)
                            }} >
                                Accept
                                </Text>
                            <Text style={styles.touchReject} onPress={() => {
                                this.takeAction("Rejected", b._id)
                            }} >
                                Reject
                                </Text>
                            <Text style={styles.touchBusy}>
                                Busy
                                </Text>
                        </View>
                    </Card >
                );
            });
        }

        return (
            <View style={styles.container} >
                <View style={styles.headerView}>
                    <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="menu-outline" color="white" size={28} onPress={() => this.props.navigation.toggleDrawer()} />
                    <Text style={styles.headerText}>New Requests</Text>
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
                    {/* <Text style={styles.header}>Requests</Text>
                    <Divider style={{ width: '25%', backgroundColor: '#FFBE85', height: 2, alignSelf: 'center', marginBottom: 15 }} /> */}
                    {
                        this.state.professional
                            ?
                            this.state.professional.status == 'Application Approved'
                                ?
                                this.state.bookings.length > 0
                                    ?
                                    <View style={styles.messageView}>
                                        <Text style={styles.messageText}>For more details of any request just tap on that card.</Text>
                                    </View>
                                    :
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins-Medium',
                                            textAlign: 'center',
                                            marginTop: 150,
                                            fontSize: 16,
                                            paddingHorizontal: 30
                                        }}
                                    >
                                        You don't have any new service requests right now.
                                </Text>
                                :
                                <Text
                                    style={{
                                        fontFamily: 'Poppins-Medium',
                                        textAlign: 'center',
                                        marginTop: 150,
                                        fontSize: 16,
                                        paddingHorizontal: 30
                                    }}
                                >
                                    You will get new requests after you get approved by our company.
                                </Text>
                            :
                            <Text
                                style={{
                                    fontFamily: 'Poppins-Medium',
                                    textAlign: 'center',
                                    marginTop: 150,
                                    fontSize: 16,
                                    paddingHorizontal: 30
                                }}
                            >
                                You don't have any new service requests right now.
                            </Text>
                    }
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.handleRefresh()} />
                        }
                    >
                        <View style={{ paddingBottom: 80 }}>
                            {bookings}
                        </View>
                    </ScrollView>
                    <Loader
                        loaderVisible={this.state.loaderVisible}
                        animationType="fade"
                    />
                </View>
            </View>
        )
    }
}

export default newRequests;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    headerView: {
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
    header: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
        alignSelf: 'center',
    },
    messageView: {
        backgroundColor: '#B5E0FC',
        height: 70,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50,
        marginBottom: 10
    },
    messageText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        textAlign: 'center',
        color: '#356ABB'
    },
    card: {
        borderRadius: 11,
        width: '95%'
    },
    list: {
        flexDirection: 'row'
    },
    title: {
        fontFamily: 'Poppins-SemiBold',
        flex: 1
    },
    value: {
        flex: 1,
        fontFamily: 'Poppins-Regular',
    },
    touch: {
        alignItems: 'flex-end',
        marginRight: 20,
        marginTop: 10,
        flexDirection: 'row'
    },
    touchAccept: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        color: '#49AB74',
        fontSize: 15,
        alignSelf: 'center',
        textAlign: 'center'
    },
    touchReject: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        color: '#FA682E',
        fontSize: 15,
        alignSelf: 'center',
        textAlign: 'center'
    },
    touchBusy: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        color: '#FAAE6B',
        fontSize: 15,
        alignSelf: 'center',
        textAlign: 'center'
    }
});