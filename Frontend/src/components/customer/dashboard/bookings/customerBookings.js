import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { Card, Divider } from 'react-native-elements';

import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';

class customerBookings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            loaderVisible: false,
            bookings: null,
            onGoing: [],
            history: [],
            token: null,
            customer: null,
            selectedTab: 'OnGoing'
        };
        this.getToken();
        this.getCustomer();
    }

    toggleTabs(tab) {
        this.setState({
            selectedTab: tab
        });
    }

    getToken = async () => {
        try {
            let token = await AsyncStorage.getItem('token');

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

    async getCustomer() {
        try {
            let customerWithOutParse = await AsyncStorage.getItem('customer');
            let customer = JSON.parse(customerWithOutParse);

            if (customer !== null) {
                this.setState({
                    customer: customer,
                });
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


    async fetchBookings() {


        await this.getToken();
        await this.getCustomer();

        await fetch(env.api + "customer/viewBookings/" + this.state.customer.customerId, {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(async data => {
                if (data.error) {
                    alert(data.error);
                    await  this.hideRefresh();
                } else {
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
                    let history = [];
                    let onGoing = [];
                    await bookings.forEach(b => {
                        if (b.service_status == 'Payment done' || b.service_status == 'Service Cancelled') {
                            history.push(b);
                        } else {
                            onGoing.push(b);
                        }
                    });
                    // await console.log(history);
                    // await console.log(onGoing);
                    await this.setState({
                        bookings: bookings,
                        onGoing: onGoing,
                        history: history
                    });
                    await this.hideLoader();
                    await  this.hideRefresh();
                }
            });
    }

    async componentDidMount() {

        this.showLoader();
        this.fetchBookings();

        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            async () => {
                await this.fetchBookings();
            }
        );
    }

    async handleRefresh() {
        this.showRefresh();
        await this.fetchBookings();
    }

    render() {

        let bookings = [];

        let tabData = [];

        if (this.state.selectedTab == 'OnGoing') {
            tabData = this.state.onGoing;
        } else if (this.state.selectedTab == 'History') {
            tabData = this.state.history;
        }

        const { navigate } = this.props.navigation;

        if (tabData.length > 0) {
            bookings = tabData.map(b => {
                const dateArray = b.service_date.split('/');
                const date = dateArray[0];
                const month = dateArray[1];
                const year = dateArray[2];
                const day = dateArray[3];
                return (
                    <Card key={b._id} containerStyle={styles.card}>
                        <View style={styles.list}>
                            <Text style={styles.title}>Service Type</Text>
                            <Text style={styles.value}>: {b.profession_type}</Text>
                        </View>
                        <View style={styles.list}>
                            <Text style={styles.title}>Professional</Text>
                            <Text style={styles.value}>: {b.professional_name ? b.professional_name : 'To be appointed'}</Text>
                        </View>
                        <View style={styles.list}>
                            <Text style={styles.title}>Cost</Text>
                            <Text style={styles.value}>: {b.total_price}</Text>
                        </View>
                        <View style={styles.list}>
                            <Text style={styles.title}>Date-Time</Text>
                            <Text style={styles.value}>: {date}/{month}/{year} - {b.service_time} PM</Text>
                        </View>
                        <View style={styles.list}>
                            <Text style={styles.title}>Status</Text>
                            <Text style={styles.value}>: {b.service_status}</Text>
                        </View>
                        <View style={styles.touch}>
                            <Text style={styles.touchText} onPress={() => navigate('customerServiceDetails', { booking: b })}>More {'>>'}</Text>
                        </View>
                    </Card>
                );
            });
        }

        return (
            <View style={styles.container} >
                <View style={styles.display}>
                    <Text style={styles.header}>Your Bookings</Text>
                    <Divider style={{ width: '50%', backgroundColor: '#FFBE85', height: 2, alignSelf: 'center', marginBottom: 15 }} />
                    <View style={styles.tabsView} >
                        <TouchableOpacity style={this.state.selectedTab == 'OnGoing' ? styles.selectedTabOpacity : styles.notSelectedTabOpacity}
                            onPress={() => {
                                this.toggleTabs('OnGoing');
                            }}
                        >
                            <Text style={this.state.selectedTab == 'OnGoing' ? styles.selectedTabText : styles.notSelectedTabTex} >OnGoing</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.selectedTab == 'History' ? styles.selectedTabOpacity : styles.notSelectedTabOpacity}
                            onPress={() => {
                                this.toggleTabs('History');
                            }}
                        >
                            <Text style={this.state.selectedTab == 'History' ? styles.selectedTabText : styles.notSelectedTabTex} >History</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.handleRefresh()} />
                        }>
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
                                        this.state.selectedTab == 'OnGoing'
                                            ?
                                            "You don't have any ongoing services right now."
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
        );
    }
}

export default customerBookings;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    display: {
        backgroundColor: 'white',
        marginTop: 30,
        paddingTop: 20,
        paddingHorizontal: 25,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
        paddingBottom: 35
    },
    header: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
        alignSelf: 'center',
    },
    card: {
        borderRadius: 11,
        width: '95%',
        alignSelf: 'center'
    },
    list: {
        flexDirection: 'row'
    },
    title: {
        fontFamily: 'Poppins-SemiBold',
        flex: 1
    },
    value: {
        flex: 2,
        fontFamily: 'Poppins-Regular',
    },
    touch: {
        alignItems: 'flex-end',
        marginRight: 20,
        marginTop: 10,
    },
    touchText: {
        fontFamily: 'Poppins-SemiBold',
        color: '#FAAE6B',
        fontSize: 15
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