import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { RefreshControl, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { env } from '../../../shared/supports';
import Loader from '../../../shared/Loader';
class selectDateTime extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            dates: [],
            days: [
                'Sun',
                'Mon',
                'Tue',
                'Wed',
                'Thu',
                'Fri',
                'Sat'
            ],
            time: [
                {
                    id: 0,
                    hour: '1',
                    min: '30',
                    valid: true,
                    selected: false
                },
                {
                    id: 1,
                    hour: '2',
                    min: '00',
                    valid: true,
                    selected: false
                },
                {
                    id: 2,
                    hour: '2',
                    min: '30',
                    valid: true,
                    selected: false
                },
                {
                    id: 3,
                    hour: '3',
                    min: '00',
                    valid: true,
                    selected: false
                },
                {
                    id: 4,
                    hour: '3',
                    min: '30',
                    valid: true,
                    selected: false
                },
                {
                    id: 5,
                    hour: '4',
                    min: '00',
                    valid: true,
                    selected: false
                },
                {
                    id: 6,
                    hour: '4',
                    min: '30',
                    valid: true,
                    selected: false
                },
                {
                    id: 7,
                    hour: '5',
                    min: '00',
                    valid: true,
                    selected: false
                },
                {
                    id: 8,
                    hour: '11',
                    min: '30',
                    valid: true,
                    selected: false
                },
                {
                    id: 9,
                    hour: '6',
                    min: '00',
                    valid: true,
                    selected: false
                }
            ],
            loaderVisible: false,
            dateSelected: false,
            timeSelected: false
        };
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

    setDates() {

        // this.showLoader();

        const date = new Date();
        const dates = [
            {
                date: null,
                month: null,
                year: null,
                day: null,
                selected: true,
                valid: true
            },
            {
                date: null,
                month: null,
                year: null,
                day: null,
                selected: false,
                valid: true
            },
            {
                date: null,
                month: null,
                year: null,
                day: null,
                selected: false,
                valid: true
            },
            {
                date: null,
                month: null,
                year: null,
                day: null,
                selected: false,
                valid: true
            }
        ];

        for (let i = 0; i < 4; i++) {
            const temp = new Date();
            temp.setDate(date.getDate() + i);

            dates[i].date = temp.getDate();
            dates[i].day = this.state.days[temp.getDay()];
            dates[i].month = temp.getMonth() + 1;
            dates[i].year = temp.getFullYear();
        }

        this.setState({
            dates: dates
        });

        const time = this.state.time;
        const currentHour = date.getHours() - 12;
        const currentMin = date.getMinutes();

        time.forEach(times => {
            if (times.hour < currentHour) {
                times.valid = false;
            }
            if (times.hour == currentHour && times.min < currentMin) {
                times.valid = false;
            }
        });

        this.setState({
            time: time
        });


        time.forEach(timeItem => {
            if (!timeItem.valid) {
                dates[0].valid = false;
            } else {
                dates[0].valid = true;
            }
        });

        // console.log(dates);

        if (!dates[0].valid) {
            const time = this.state.time;
            time.forEach(timeItem => {
                timeItem.valid = true;
            });

            this.setState({
                time: time
            });
        }

        // this.hideLoader();
        this.hideRefresh();
        // console.log(dates);
    }

    onDateSelect(date) {
        const dates = this.state.dates;
        dates.forEach(dateItem => {
            if (dateItem.date == date) {
                dateItem.selected = true;
            } else {
                dateItem.selected = false;
            }
        });

        this.setState({
            dates: dates,
            dateSelected: true
        });

        const d = new Date();

        if (date == d.getDate()) {
            const time = this.state.time;
            const currentHour = d.getHours() - 12;
            const currentMin = d.getMinutes();

            time.forEach(times => {
                if (times.hour < currentHour) {
                    times.valid = false;
                }
                if (times.hour == currentHour && times.min < currentMin) {
                    times.valid = false;
                }
            });

            this.setState({
                time: time
            });
        } else {
            const time = this.state.time;
            time.forEach(timeItem => {
                timeItem.valid = true;
            });

            this.setState({
                time: time
            });
        }
    }

    onTimeSelect(index) {
        const time = this.state.time;
        time.forEach(timeItem => {
            if (timeItem.id == index) {
                timeItem.selected = true;
            } else {
                timeItem.selected = false;
            }
        });

        this.setState({
            time: time,
            timeSelected: true
        });
    }


    renderItem = ({ item, index }) => {
        return (
            <View style={styles.time}>
                <TouchableOpacity style={item.valid ? item.selected ? styles.selectedTime : styles.validTime : styles.invalidTime}
                    onPress={() => item.valid ? this.onTimeSelect(index) : null}
                >
                    <Text style={item.valid ? item.selected ? styles.selectedTimeText : styles.validTimeText : styles.invalidTimeText}>{item.hour} : {item.min} PM</Text>
                </TouchableOpacity>
            </View>
        );
    }

    async onServiceRequest() {

        this.showLoader();

        if (this.props.route.name == "selectDateTime") {

            let customerWithOutParse = await AsyncStorage.getItem('customer');
            let customer = JSON.parse(customerWithOutParse);

            let token = await AsyncStorage.getItem('token');

            let services = await AsyncStorage.getItem('services');
            const parsed = await JSON.parse(services);

            let addressWithOutParse = await AsyncStorage.getItem('address');
            let address = JSON.parse(addressWithOutParse);

            let pType = await AsyncStorage.getItem('profession');

            const total = this.props.route.params.total;

            let selectedDate = '';
            let selectedDay = '';
            let selectedMonth = '';
            let selectedYear = '';
            let selectedHour = '';
            let selectedMin = '';

            const dates = this.state.dates;
            const times = this.state.time;

            dates.forEach(dateItem => {
                if (dateItem.selected == true) {
                    selectedDate = dateItem.date;
                    selectedDay = dateItem.day;
                    selectedMonth = dateItem.month;
                    selectedYear = dateItem.year;
                }
            });

            times.forEach(timeItem => {
                if (timeItem.selected == true) {
                    selectedHour = timeItem.hour;
                    selectedMin = timeItem.min;
                }
            });

            const date = `${selectedDate}/${selectedMonth}/${selectedYear}/${selectedDay}`;
            const time = `${selectedHour}:${selectedMin}`;

            // console.log(customer);
            // console.log(token);
            // console.log(customer.customerName);
            // console.log(pType);
            // console.log(date);
            // console.log(time);
            // console.log(address.person_name);
            // console.log(address.address_detail1);
            // console.log(address.address_detail2);
            // console.log(address.city);
            // console.log(address.state);
            // console.log(parsed);
            // console.log(total);

            await fetch(env.api + "customer/requestservice/" + customer.customerId, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token
                },
                body:
                    JSON.stringify(
                        {
                            profession_type: pType,
                            service_date: date,
                            service_time: time,
                            address: {
                                person_name: address.person_name,
                                address_detail1: address.address_detail1,
                                address_detail2: address.address_detail2,
                                city: address.city,
                                state: address.state
                            },
                            service_details: parsed,
                            total_price: total
                        }
                    )
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        this.hideLoader();
                        alert(data.error);
                    } else {
                        console.log(data.bookingDetails);
                        console.log(data.message);
                        this.emptyStorage();
                        this.hideLoader();
                        this.props.navigation.navigate('serviceSummary', { booking: data.bookingDetails });
                        // socket.emit("refreshAddress", {});
                    }
                })
                .catch(function (error) {
                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    // ADD THIS THROW error
                    alert("request unsuccessful");
                    throw error;
                });

        }
        else {

            const bookId = this.props.route.params.id;

            let customerWithOutParse = await AsyncStorage.getItem('customer');
            let customer = JSON.parse(customerWithOutParse);

            let token = await AsyncStorage.getItem('token');

            let selectedDate = '';
            let selectedDay = '';
            let selectedMonth = '';
            let selectedYear = '';
            let selectedHour = '';
            let selectedMin = '';

            const dates = this.state.dates;
            const times = this.state.time;

            dates.forEach(dateItem => {
                if (dateItem.selected == true) {
                    selectedDate = dateItem.date;
                    selectedDay = dateItem.day;
                    selectedMonth = dateItem.month;
                    selectedYear = dateItem.year;
                }
            });

            times.forEach(timeItem => {
                if (timeItem.selected == true) {
                    selectedHour = timeItem.hour;
                    selectedMin = timeItem.min;
                }
            });

            const date = `${selectedDate}/${selectedMonth}/${selectedYear}/${selectedDay}`;
            const time = `${selectedHour}:${selectedMin}`;

            await fetch(env.api + "customer/booking/" + customer.customerId + "/" + bookId, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token
                },
                body:
                    JSON.stringify(
                        {
                            service_date: date,
                            service_time: time
                        }
                    )
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        this.hideLoader();
                        alert(data.error);
                    } else {
                        console.log(data.bookingDetails);
                        // console.log(data.message);
                        // this.emptyStorage();
                        this.hideLoader();
                        this.props.navigation.navigate('serviceSummary', { booking: data.bookingDetails });
                        // socket.emit("refreshAddress", {});
                    }
                })
                .catch(function (error) {
                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    // ADD THIS THROW error
                    alert("request unsuccessful");
                    throw error;
                });

        }

    }

    emptyStorage = async () => {
        await AsyncStorage.removeItem('services');
        await AsyncStorage.removeItem('profession');
        await AsyncStorage.removeItem('address');

        console.log('storage empty');
    }

    componentDidMount() {
        this.setDates();
    }

    async handleRefresh() {
        this.showRefresh();
        await this.setDates();
    }

    render() {

        const { navigate } = this.props.navigation;
        let datKey = -1;
        const date = this.state.dates.map((dateItem) => {
            datKey++;
            if (dateItem.valid)
                return (
                    <View key={datKey} style={styles.date}>
                        <TouchableOpacity style={dateItem.selected ? styles.selectedDate : styles.notSelectedDate}
                            onPress={() => this.onDateSelect(dateItem.date)}
                        >
                            <Text style={dateItem.selected ? styles.selectedDateText : styles.notSelectedDateText}>{dateItem.day}</Text>
                            <Text style={dateItem.selected ? styles.selectedDateText : styles.notSelectedDateText}>{dateItem.date}</Text>
                        </TouchableOpacity>
                    </View>
                );
        })

        return (
            <View style={styles.container}>
                <View style={styles.display}>
                    <Text style={styles.header}>When would you like to take our service?</Text>
                    <View style={styles.dateView}>
                        {date}
                    </View>
                    <View style={styles.timeView}>
                        <FlatList
                            data={this.state.time}
                            renderItem={this.renderItem}
                            numColumns={2}
                            keyExtractor={item => item.id}
                        />
                    </View>
                    <View style={styles.requestServiceButton}>
                        <TouchableOpacity style={this.state.dateSelected && this.state.timeSelected ? styles.requestServiceButtonOpacity : { height: 0 }} onPress={() => {
                            this.onServiceRequest();
                        }}>
                            <Text style={styles.requestServiceButtonText}>Request Service</Text>
                            <Ionicons style={styles.requestServiceButtonIcon} name="arrow-forward-outline" color="white" size={24} />
                        </TouchableOpacity>
                    </View>
                    <Loader
                        loaderVisible={this.state.loaderVisible}
                        animationType="fade"
                    />
                </View>
            </View>
        );
    }
}

export default selectDateTime;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    display: {
        backgroundColor: 'white',
        marginTop: 15,
        paddingTop: 50,
        paddingHorizontal: 15,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%'
    },
    header: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        alignSelf: 'center'
    },
    dateView: {
        flexDirection: 'row',
        marginTop: 30
    },
    date: {
        // flex: 1,
        marginHorizontal: 10,
        alignItems: 'center',
    },
    notSelectedDate: {
        width: 75,
        height: 75,
        borderWidth: 1,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAF4F0',
        borderColor: '#FEC28E'
    },
    selectedDate: {
        width: 75,
        height: 75,
        borderWidth: 1,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEC28E',
        borderColor: '#FEC28E'
    },
    notSelectedDateText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#FEC28E'
    },
    selectedDateText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: 'white'
    },
    timeView: {
        flexDirection: 'row',
        marginTop: 50
    },
    time: {
        flex: 1,
        alignItems: 'center'
    },
    invalidTime: {
        width: 170,
        height: 60,
        borderWidth: 1,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#CBC9C8',
        borderColor: '#8C8C8C',
        margin: 5
    },
    validTime: {
        width: 170,
        height: 60,
        borderWidth: 1,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAF4F0',
        borderColor: '#FEC28E',
        margin: 5
    },
    selectedTime: {
        width: 170,
        height: 60,
        borderWidth: 1,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEC28E',
        borderColor: '#FEC28E',
        margin: 5
    },
    invalidTimeText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#8C8C8C'
    },
    validTimeText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#FEC28E'
    },
    selectedTimeText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: 'white'
    },
    requestServiceButtonOpacity: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f1f1f',
        height: 50,
        width: 350,
        borderRadius: 25,
        marginBottom: 40,
        flexDirection: 'row',
        paddingLeft: 30
    },
    requestServiceButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
    },
    requestServiceButtonText: {
        flex: 4,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        color: '#fff'
    },
    requestServiceButtonIcon: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'flex-end',
    }
});