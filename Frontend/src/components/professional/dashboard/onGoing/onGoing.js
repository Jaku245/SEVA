import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { RefreshControl, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';

class onGoing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaderVisible: false,
            refreshing: false,
            bookings: [],
            token: '',
            professional: '',
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
            selectedTab: 'All',
            today: [],
            inProcess: [],
            nextWeek: [],
        }
    }

    toggleTabs(tab) {
        this.setState({
            selectedTab: tab
        });
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


    async fetchServices() {

        await this.getToken();
        await this.getProfessional();

        await fetch(env.api + "professional/serviceRequest/accepted/" + this.state.professional._id, {
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
                    let today = [];
                    let inProcess = [];
                    let nextWeek = [];

                    let todayDate = new Date();

                    await Bookings.forEach(b => {
                        let date = new Date(b.service_date);
                        if (date.getFullYear() == todayDate.getFullYear()) {
                            if (date.getMonth() == todayDate.getMonth()) {
                                if (date.getDate() == todayDate.getDate()) {
                                    today.push(b);
                                } else if (date.getDate() > todayDate.getDate()) {
                                    nextWeek.push(b);
                                } else {
                                    inProcess.push(b);
                                }
                            } else if (date.getMonth() > todayDate.getMonth()) {
                                nextWeek.push(b);
                            } else {
                                inProcess.push(b);
                            }
                        } else if (date.getFullYear() > todayDate.getFullYear()) {
                            nextWeek.push(b);
                        } else {
                            inProcess.push(b);
                        }
                    });

                    // await console.log(today);
                    // await console.log(inProcess);
                    // await console.log(nextWeek);
                    await this.setState({
                        bookings: Bookings,
                        today: today,
                        inProcess: inProcess,
                        nextWeek: nextWeek,
                    })
                    this.hideLoader();
                    this.hideRefresh();
                    // console.log(data.Bookings);
                }
            });
    }

    async componentDidMount() {
        this.showLoader();
        // this.getToken();
        await AsyncStorage.removeItem('addOnServices');
        await this.fetchServices();

        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            async () => {
                await AsyncStorage.removeItem('addOnServices');
                await this.fetchServices();
            }
        );
    }

    async handleRefresh() {
        await this.showRefresh();
        await AsyncStorage.removeItem('addOnServices');
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
        } else if (this.state.selectedTab == 'Today') {
            tabData = this.state.today;
        } else if (this.state.selectedTab == 'Next Week') {
            tabData = this.state.nextWeek;
        } else if (this.state.selectedTab == 'In Process') {
            tabData = this.state.inProcess;
        }

        const { navigate } = this.props.navigation;

        if (tabData.length > 0) {
            bookings = tabData.map(b => {
                const dateArray = b.service_date.split('/');
                const date = dateArray[0];
                const month = this.state.month[dateArray[1] - 1];
                const year = dateArray[2];
                const day = dateArray[3];
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
                            <Text style={styles.touchStatus}>
                                {b.service_status}
                            </Text>
                            <Text style={styles.touchText} onPress={() =>
                                navigate('onGoingServiceDetails', { booking: b, price: b.total_price })
                            }>Take Actions {'>>'}</Text>
                        </View>
                    </Card>
                );
            });
        }

        return (
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="menu-outline" color="white" size={28} onPress={() => this.props.navigation.toggleDrawer()} />
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
                        <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="log-out-outline" color="white" size={28} onPress={() => this.logOut()} />
                    </View>
                </View>
                <View style={styles.display}>
                    <Text style={styles.header}>Your Services</Text>
                    <Divider style={{ width: '50%', backgroundColor: '#FFBE85', height: 2, alignSelf: 'center', marginBottom: 15 }} />
                    <View style={styles.tabsView} >
                        <TouchableOpacity style={this.state.selectedTab == 'All' ? styles.selectedTabOpacity : styles.notSelectedTabOpacity}
                            onPress={() => {
                                this.toggleTabs('All');
                            }}
                        >
                            <Text style={this.state.selectedTab == 'All' ? styles.selectedTabText : styles.notSelectedTabTex} >All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.selectedTab == 'Today' ? styles.selectedTabOpacity : styles.notSelectedTabOpacity}
                            onPress={() => {
                                this.toggleTabs('Today');
                            }}
                        >
                            <Text style={this.state.selectedTab == 'Today' ? styles.selectedTabText : styles.notSelectedTabTex} >Today</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.selectedTab == 'Next Week' ? styles.selectedTabOpacity : styles.notSelectedTabOpacity}
                            onPress={() => {
                                this.toggleTabs('Next Week');
                            }}
                        >
                            <Text style={this.state.selectedTab == 'Next Week' ? styles.selectedTabText : styles.notSelectedTabTex} >This Week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.selectedTab == 'In Process' ? styles.selectedTabOpacity : styles.notSelectedTabOpacity}
                            onPress={() => {
                                this.toggleTabs('In Process');
                            }}
                        >
                            <Text style={
                                this.state.selectedTab == 'In Process'
                                    ?
                                    styles.selectedTabText
                                    :
                                    styles.notSelectedTabTex
                            } >In Process</Text>
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
                                        marginTop: 10,
                                        fontSize: 16,
                                        paddingHorizontal: 30,
                                        marginTop: 150
                                    }}
                                >
                                    {
                                        this.state.selectedTab == 'All'
                                            ?
                                            "You don't have any ongoing services right now."
                                            :
                                            this.state.selectedTab == 'Today'
                                                ?
                                                "You don't have any services today."
                                                :
                                                this.state.selectedTab == 'Next Week'
                                                    ?
                                                    "You don't have any service in this week right now."
                                                    :
                                                    "You don't have any service pending right now."
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

export default onGoing;

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
        marginRight: 20,
        marginTop: 10,
        flexDirection: 'row'
    },
    touchText: {
        fontFamily: 'Poppins-SemiBold',
        color: '#0099FF',
        fontSize: 13,
        textAlign: 'right'
    },

    touchStatus: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        color: '#49AB74',
        fontSize: 13,
        alignSelf: 'center'
    },
    tabsView: {
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'center',
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
        fontSize: 10
    },
    notSelectedTabTex: {
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        color: 'gray',
        fontSize: 10
    }
});