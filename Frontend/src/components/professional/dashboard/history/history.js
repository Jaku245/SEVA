import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { RefreshControl, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';

class history extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            loaderVisible: false,
            bookings: [],
            completed: [],
            cancelled: [],
            Feedbacks: null,
            token: null,
            professional: null,
            totalEarning: 0,
            totalServices: 0,
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
            ],
            selectedTab: 'All'
        };
        // this.getToken();
        // this.getCustomer();
    }

    toggleTabs(tab) {
        this.setState({
            selectedTab: tab
        });
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

        } catch (error) {
            // Error saving data
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
                // console.log(professional);
            } else {

            }

        } catch (error) {
            // Error saving data
        }
    }

    async fetchServices() {

        await this.getToken();
        await this.getProfessional();

        await fetch(env.api + "professional/serviceRequest/history/" + this.state.professional._id, {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(async data => {
                if (data.error) {
                    this.hideLoader();
                    this.hideRefresh();
                    alert(data.error);
                } else if (data.Bookings) {
                    let Bookings = data.Bookings;
                    await Bookings.sort(function (a, b) {
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


                    let completed = [];
                    let cancelled = [];

                    let totalEarning = 0;
                    let totalServices = 0;
                    await Bookings.forEach(b => {
                        if (b.service_status == 'Payment done') {
                            completed.push(b);
                            totalServices += 1;
                            totalEarning += b.total_price;
                        } else if (b.service_status == 'Service Cancelled') {
                            cancelled.push(b);
                        }
                    });
                    // await console.log(completed);
                    // await console.log(cancelled);

                    await this.setState({
                        bookings: Bookings,
                        Feedbacks: data.Feedbacks,
                        cancelled: cancelled,
                        completed: completed,
                        totalEarning: totalEarning,
                        totalServices: totalServices,
                    })
                    this.hideLoader();
                    this.hideRefresh();
                    // console.log(data.Feedbacks);
                }
            });
    }

    async componentDidMount() {
        this.showLoader();

        // this.getToken();
        await this.fetchServices();

        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            async () => {
                // await this.fetchServices();
            }
        );
    }

    async handleRefresh() {
        this.showRefresh();
        await this.fetchServices();
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

    render() {

        let bookings = [];

        let tabData = [];

        if (this.state.selectedTab == 'All') {
            tabData = this.state.bookings;
        } else if (this.state.selectedTab == 'Completed') {
            tabData = this.state.completed;
        } else if (this.state.selectedTab == 'Cancelled') {
            tabData = this.state.cancelled;
        }

        const { navigate } = this.props.navigation;

        if (tabData.length > 0) {
            bookings = tabData.map(b => {
                const dateArray = b.service_date.split('/');
                const date = dateArray[0];
                const month = this.state.month[dateArray[1] - 1];
                const year = dateArray[2];
                const day = dateArray[3];
                // console.log(b);
                return (
                    <Card key={b._id} containerStyle={styles.card}>
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
                        <View style={styles.touch}>
                            <Text style={styles.touchText} onPress={async () => {

                                const allFeedbacks = this.state.Feedbacks;
                                let bookingFeedback = {
                                    msg: '',
                                    ratings: 0
                                }

                                await allFeedbacks.forEach(feedback => {
                                    if (feedback.booking_id == b._id) {
                                        bookingFeedback.msg = feedback.professional_feedback;
                                        bookingFeedback.ratings = feedback.professional_ratings;
                                    }
                                });

                                // await console.log(bookingFeedback);

                                await navigate('historyServiceDetails', { booking: b, feedback: bookingFeedback });
                            }}>More {'>>'}</Text>
                        </View>
                    </Card>
                );
            });
        }

        return (
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="menu-outline" color="white" size={28} onPress={() => this.props.navigation.toggleDrawer()} />
                    <Text style={styles.headerText}>History</Text>
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
                    {/* <Text style={styles.header}>History</Text>
                    <Divider style={{ width: '25%', backgroundColor: '#FFBE85', height: 2, alignSelf: 'center', marginBottom: 15 }} /> */}
                    <View style={{
                        alignItems: 'center',
                        marginBottom: 10
                    }}>
                        <Text style={{
                            fontFamily: 'Poppins-SemiBold'
                        }}>Total Services Completed : {this.state.totalServices}</Text>
                        <Text style={{
                            fontFamily: 'Poppins-SemiBold'
                        }}>Total Earning : {this.state.totalEarning}</Text>
                    </View>
                    <View style={styles.tabsView} >
                        <TouchableOpacity style={this.state.selectedTab == 'All' ? styles.selectedTabOpacity : styles.notSelectedTabOpacity}
                            onPress={() => {
                                this.toggleTabs('All');
                            }}
                        >
                            <Text style={this.state.selectedTab == 'All' ? styles.selectedTabText : styles.notSelectedTabTex} >All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.selectedTab == 'Completed' ? styles.selectedTabOpacity : styles.notSelectedTabOpacity}
                            onPress={() => {
                                this.toggleTabs('Completed');
                            }}
                        >
                            <Text style={this.state.selectedTab == 'Completed' ? styles.selectedTabText : styles.notSelectedTabTex} >Completed</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.selectedTab == 'Cancelled' ? styles.selectedTabOpacity : styles.notSelectedTabOpacity}
                            onPress={() => {
                                this.toggleTabs('Cancelled');
                            }}
                        >
                            <Text style={this.state.selectedTab == 'Cancelled' ? styles.selectedTabText : styles.notSelectedTabTex} >Cancelled</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.handleRefresh()} />
                        }
                    >
                        {
                            tabData.length > 0
                                ?
                                bookings
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
                                    {
                                        this.state.selectedTab == 'All'
                                            ?
                                            "You don't have any completed or cancelled services right now."
                                            :
                                            this.state.selectedTab == 'Cancelled'
                                                ?
                                                "You don't have any cancelled services right now."
                                                :
                                                "You don't have any completed services right now."
                                    }
                                </Text>
                        }
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

export default history;

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
        paddingBottom: 80
    },
    header: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
        alignSelf: 'center',
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
    touchText: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        color: '#FAAE6B',
        fontSize: 15,
        alignSelf: 'center',
        textAlign: 'right'
    },
    tabsView: {
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'center',
        width: '95%',
        alignSelf: 'center'
    },
    selectedTabOpacity: {
        flex: 1,
        backgroundColor: '#FAAE6B',
        height: 35,
        justifyContent: 'center',
        borderRadius: 30,
    },
    notSelectedTabOpacity: {
        flex: 1,
        height: 35,
        justifyContent: 'center',
    },
    selectedTabText: {
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        color: 'white',
        fontSize: 14
    },
    notSelectedTabTex: {
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        color: 'gray',
        fontSize: 14
    }
});