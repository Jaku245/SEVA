import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Divider } from 'react-native-elements';

import Loader from '../../shared/Loader';
import { env } from '../../shared/supports';

class companyReports extends Component {

    constructor(props) {
        super(props);
        this.state = {
            services: [],
            token: null,
            month1: 0,
            month2: 0,
            month3: 0,
            month4: 0,
            month5: 0,
            month6: 0,
            month7: 0,
            month8: 0,
            month9: 0,
            month10: 0,
            month11: 0,
            month12: 0,
            s1: 0,
            s2: 0,
            s3: 0,
            s4: 0,
            s5: 0,
            s6: 0,
            s7: 0,
            s8: 0,
            s9: 0,
            s10: 0,
            s11: 0,
            s12: 0,
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
            data: [
                {
                    name: "January",
                    services: 0,
                    color: "#0099FF",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12,
                },
                {
                    name: "February",
                    services: 0,
                    color: "#D4B411",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12
                },
                {
                    name: "March",
                    services: 0,
                    color: "#C01B1B",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12
                },
                {
                    name: "April",
                    services: 0,
                    color: "#1BC029",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12
                },
                {
                    name: "May",
                    services: 0,
                    color: "orange",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12
                },
                {
                    name: "June",
                    services: 0,
                    color: "gray",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12
                },
                {
                    name: "July",
                    services: 0,
                    color: "blue",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12
                },
                {
                    name: "August",
                    services: 0,
                    color: "green",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12
                },
                {
                    name: "september",
                    services: 0,
                    color: "red",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12
                },
                {
                    name: "October",
                    services: 0,
                    color: "pink",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12,
                },
                {
                    name: "november",
                    services: 0,
                    color: "black",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12
                },
                {
                    name: "December",
                    services: 0,
                    color: "purple",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12,
                },
            ],
            totalServices: 0,
            totalEarnings: 0,
            loaderVisible: false
        }
    }

    showLoader() {
        this.setState({ loaderVisible: true })
    }

    hideLoader() {
        this.setState({ loaderVisible: false })
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

    async fetchReports() {
        await fetch(env.api + "admin/all/bookings", {
            method: "GET",
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
                    this.setState({
                        services: data.bookings
                    });
                }
            });
    }

    async componentDidMount() {
        await this.getToken();
        await this.fetchReports();
        await this.setDetails();
    }

    async setDetails() {
        const bookings = this.state.services;

        const currentDate = new Date();



        let totalServices = 0;
        let totalEarnings = 0;

        let jan = 0;
        let feb = 0;
        let mar = 0;
        let apr = 0;
        let may = 0;
        let jun = 0;
        let jul = 0;
        let aug = 0;
        let sep = 0;
        let oct = 0;
        let nov = 0;
        let dec = 0;

        let month1 = 0;
        let month2 = 0;
        let month3 = 0;
        let month4 = 0;
        let month5 = 0;
        let month6 = 0;
        let month7 = 0;
        let month8 = 0;
        let month9 = 0;
        let month10 = 0;
        let month11 = 0;
        let month12 = 0;


        await bookings.forEach(b => {
            totalServices++;
            totalEarnings += b.total_price;
            let date = new Date(b.createdAt);

            if (date.getMonth() == 0) {
                jan += b.total_price;
                month1++;
            } else if (date.getMonth() == 1) {
                feb += b.total_price;
                month2++;
            } else if (date.getMonth() == 2) {
                mar += b.total_price;
                month3++;
            } else if (date.getMonth() == 3) {
                apr += b.total_price;
                month4++;
            } else if (date.getMonth() == 4) {
                may += b.total_price;
                month5++;
            } else if (date.getMonth() == 5) {
                jun += b.total_price;
                month6++;
            } else if (date.getMonth() == 6) {
                jul += b.total_price;
                month7++;
            } else if (date.getMonth() == 7) {
                aug += b.total_price;
                month8++;
            } else if (date.getMonth() == 8) {
                sep += b.total_price;
                month9++;
            } else if (date.getMonth() == 9) {
                oct += b.total_price;
                month10++;
            } else if (date.getMonth() == 10) {
                nov += b.total_price;
                month11++;
            } else if (date.getMonth() == 11) {
                dec += b.total_price;
                month12++;
            }
        });

        let data = this.state.data;

        await this.setState({
            month1: month1,
            month2: month2,
            month3: month3,
            month4: month4,
            month5: month5,
            month6: month6,
            month7: month7,
            month8: month8,
            month9: month9,
            month10: month10,
            month11: month11,
            month12: month12,
            s1: jan,
            s2: feb,
            s3: mar,
            s4: apr,
            s5: may,
            s6: jun,
            s7: jul,
            s8: aug,
            s9: sep,
            s10: oct,
            s11: nov,
            s12: dec,
            totalEarnings: totalEarnings,
            totalServices: totalServices
        })

        await this.hideLoader();
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="home-outline" color="white" size={28}
                        onPress={() => this.props.navigation.navigate('dashboard')}
                    />
                    <Text style={styles.headerText}>company Reports</Text>
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
                        <View style={{ marginBottom: 80 }}>
                            <Text style={styles.title}>Users</Text>
                            <Divider style={{ width: '30%', height: 2, marginBottom: 10, backgroundColor: '#FEC28E', alignSelf: 'center' }} />
                            <Text style={styles.totalEarnings}>Total Customers : {this.state.totalServices}</Text>
                            <Text style={styles.totalEarnings}>Total Professionals : {this.state.totalServices}</Text>
                            <View style={{ marginVertical: 10 }}></View>
                            <Text style={styles.title}>Earnings</Text>
                            <Divider style={{ width: '30%', height: 2, marginBottom: 10, backgroundColor: '#FEC28E', alignSelf: 'center' }} />
                            <Text style={styles.totalEarnings}>Total Earnings : Rs. {this.state.totalEarnings}</Text>
                            {/* <PieChart
                                data={this.state.data}
                                width={Dimensions.get("window").width - 40}
                                height={220}
                                chartConfig={{
                                    color: () => 'yellow'
                                }}
                                accessor="services"
                                backgroundColor="transparent"
                                paddingLeft="12"
                                absolute
                            /> */}
                            <LineChart
                                data={{
                                    labels: [
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
                                    datasets: [
                                        {
                                            data: [
                                                this.state.s1,
                                                this.state.s2,
                                                this.state.s3,
                                                this.state.s4,
                                                this.state.s5,
                                                this.state.s6,
                                                this.state.s7,
                                                this.state.s8,
                                                this.state.s9,
                                                this.state.s10,
                                                this.state.s11,
                                                this.state.s12,
                                            ]
                                        }
                                    ],
                                    legend: ['count of Earnings']
                                }}
                                withInnerLines={false}
                                fromZero={true}
                                width={Dimensions.get("window").width - 40} // from react-native
                                height={250}
                                yAxisInterval={1} // optional, defaults to 1
                                chartConfig={{
                                    backgroundColor: "#e26a00",
                                    backgroundGradientFrom: "#1179D4",
                                    backgroundGradientTo: "#0B5CA2",
                                    decimalPlaces: 0, // optional, defaults to 2dp
                                    color: () => '#ffffff',
                                    labelColor: () => '#ffffff',
                                    style: {
                                        borderRadius: 10
                                    },
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "2",
                                        stroke: "#ffa726"
                                    }
                                }}
                                bezier
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 10,
                                }}
                            />
                            <View style={{ marginVertical: 10 }}></View>
                            <Text style={styles.title}>Services</Text>
                            <Divider style={{ width: '30%', height: 2, marginBottom: 10, backgroundColor: '#FEC28E', alignSelf: 'center' }} />
                            <Text style={styles.totalEarnings}>Total Services : {this.state.totalServices}</Text>
                            <LineChart
                                data={{
                                    labels: [
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
                                    datasets: [
                                        {
                                            data: [
                                                this.state.month1,
                                                this.state.month2,
                                                this.state.month3,
                                                this.state.month4,
                                                this.state.month5,
                                                this.state.month6,
                                                this.state.month7,
                                                this.state.month8,
                                                this.state.month9,
                                                this.state.month10,
                                                this.state.month11,
                                                this.state.month12,
                                            ]
                                        }
                                    ],
                                    legend: ['count of services']
                                }}
                                withInnerLines={false}
                                fromZero={true}
                                width={Dimensions.get("window").width - 40} // from react-native
                                height={250}
                                yAxisInterval={1} // optional, defaults to 1
                                chartConfig={{
                                    backgroundColor: "#e26a00",
                                    backgroundGradientFrom: "#fb8c00",
                                    backgroundGradientTo: "#ffa726",
                                    decimalPlaces: 0, // optional, defaults to 2dp
                                    color: () => '#ffffff',
                                    labelColor: () => '#ffffff',
                                    style: {
                                        borderRadius: 10
                                    },
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "2",
                                        stroke: "#ffa726"
                                    }
                                }}
                                bezier
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 10,
                                }}
                            />
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


export default companyReports;

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
    title: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
        marginLeft: 10,
        alignSelf: 'center'
    },
    totalEarnings: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        marginLeft: 10,
        alignSelf: 'center'
    }
});