import React, { Component } from 'react';
import { RefreshControl, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Modal, Pressable, FlatList, Linking } from 'react-native';
import { Item, Icon, Input } from 'native-base';
import { AirbnbRating, Card, Divider, Rating } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Textarea from 'react-native-textarea';


import carpenter from '../../../../../resources/carpenter.jpg';
import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';
import AsyncStorage from '@react-native-community/async-storage';
import { WheelchairActive } from 'grommet-icons';

class onGoingServiceDetails extends Component {

    state = {
        booking: this.props.route.params.booking,
        add_ons: [],
        statusWords: [
            "Service Cancelled",
            "Service Requested",
            "Professional Appointed",
            "Professional on the way",
            "Professional on site",
            "Work in progress",
            "Work completed",
            "Payment done",
        ],
        data: [
            { id: 1, title: "Service Requested" },
            { id: 2, title: "Professional Appointed" },
            { id: 3, title: "Professional on the way" },
            { id: 4, title: "Professional on site" },
            { id: 5, title: "Work in progress" },
            { id: 6, title: "Work completed" },
        ],
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
        status: 1,
        modalVisible: false,
        cashModalVisible: false,
        onlineModalVisible: false,
        token: null,
        loaderVisible: false,
        refreshing: false,
        onlineStatus: "PENDING",
        invoiceId: null,
        cancelled: true
        // professional: null
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
                this.hideLoader();
            } else {

            }
            this.hideRefresh();
        } catch (error) {
            // Error saving data
            this.hideRefresh();
        }
    };

    // async getProfessional() {
    //     try {
    //         let professionalWithOutParse = await AsyncStorage.getItem('professional');
    //         let professional = JSON.parse(professionalWithOutParse);

    //         if (professional !== null) {
    //             this.setState({
    //                 professional: professional,
    //             });
    //             // console.log(professional);
    //         } else {

    //         }

    //     } catch (error) {
    //         // Error saving data
    //     }
    // }

    showModal() {
        this.setState({
            modalVisible: true
        });
    }

    hideModal() {
        this.setState({
            modalVisible: false
        });
    }

    showCashModal() {
        this.setState({
            cashModalVisible: true
        });
    }

    hideCashModal() {
        this.setState({
            cashModalVisible: false
        });
    }

    showOnlineModal() {
        this.setState({
            onlineModalVisible: true
        });
    }

    hideOnlineModal() {
        this.setState({
            onlineModalVisible: false
        });
    }

    updateStatus(status) {
        const booking = this.state.booking;

        booking.service_status = status;

        this.setState({
            booking: booking
        });

        this.hideModal()
    }

    renderBrief() {
        return (
            <View>
                <Card containerStyle={styles.briefCard}>
                    <View style={styles.briefHead}>
                        {
                            this.state.booking.customer_image
                                ?
                                <Image source={{
                                    uri: env.api + 'backend/' + this.state.booking.customer_image
                                }} style={styles.briefImg} />
                                :
                                <View style={{
                                    flex: 1,
                                    maxHeight: 60,
                                    minHeight: 60,
                                    minWidth: 60,
                                    maxWidth: 60,
                                    borderRadius: 60,
                                    backgroundColor: '#FAAE6B',
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Ionicons name="person-outline" color="white" size={24} />
                                </View>
                        }
                        <View style={styles.briefDetails}>
                            <View style={styles.briefHeadText}>
                                <Text style={styles.serviceName}>{this.state.booking.customer_name}</Text>
                                <Text style={styles.status}>Customer</Text>
                            </View>
                        </View>
                        <View style={styles.call}>
                            <Ionicons name="call-outline" color="green" size={36}
                                onPress={async () => {
                                    let number = '';
                                    const professionalNumber = this.state.booking.customer_phone.split('-');
                                    number = "+" + professionalNumber[0] + " " + professionalNumber[1];
                                    if (Platform.OS === 'ios') {
                                        number = 'telprompt:${' + number + '}';
                                    }
                                    else {
                                        number = 'tel:${' + number + '}';
                                    }
                                    await Linking.openURL(number);
                                }}
                            />
                        </View>
                    </View>
                </Card>
            </View>
        );
    }

    renderServiceDetails() {

        const dateArray = this.state.booking.service_date.split('/');
        const date = dateArray[0];
        const month = dateArray[1];
        const year = dateArray[2];
        const day = dateArray[3];

        const services = this.state.booking.service_details.map(s => {
            const serviceTotal = s.price * s.quantity;
            return (
                <View key={s.service_id} style={styles.totalList}>
                    <Text style={styles.listTitle}>{s.service_name} x {s.quantity}</Text>
                    <Text style={styles.listPrice}>Rs. {serviceTotal}</Text>
                </View>
            );
        })

        let total = this.state.booking.total_price;
        const addOnServices = this.state.add_ons.map(s => {
            const serviceTotal = s.price * s.quantity;
            total += serviceTotal;
            return (
                <View key={s.service_id} style={styles.totalList}>
                    <Text style={styles.listTitle}>{s.service_name} x {s.quantity}</Text>
                    <Text style={styles.listPrice}>Rs. {serviceTotal}</Text>
                </View>
            );
        })

        return (
            <Card containerStyle={styles.cartCard}>
                <Text style={styles.serviceDetailsHead}>{this.state.status != 7 ? 'Service Details' : 'Amount Paid'}</Text>
                <Text style={this.state.status == 7 ? styles.serviceDetailsHead : { height: 0 }}>{this.state.status == 7 ? this.state.booking.total_price : null}</Text>
                <Divider style={{ width: '40%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                <Text style={styles.cartHead}>Booking Details</Text>
                <View style={styles.bookingDetails}>
                    <View style={styles.bookingIcon}>
                        <Ionicons name="location-outline" size={30} />
                    </View>
                    <View style={styles.bookingText}>
                        <Text style={styles.bookingTitle}>Service Location</Text>
                        <Text style={styles.bookingDesc}>{this.state.booking.service_address.address_detail1}, {this.state.booking.service_address.address_detail2}{'\n'}{this.state.booking.service_address.city}, {this.state.booking.service_address.state}</Text>
                    </View>
                </View>
                <View style={styles.bookingDetails}>
                    <View style={styles.bookingIcon}>
                        <Ionicons name="time-outline" size={30} />
                    </View>
                    <View style={styles.bookingText}>
                        <Text style={styles.bookingTitle}>Timings</Text>
                        <Text style={styles.bookingDesc}>{day}, {date} {this.state.month[month - 1]}, {year} {this.state.booking.service_time} pm</Text>
                    </View>
                </View>
                <Divider style={{ marginBottom: 20 }} />
                <Text style={styles.cartHead}>Invoice</Text>
                {services}
                <Text style={this.state.add_ons.length > 0 ? { fontFamily: 'Poppins-Regular', color: 'gray', fontSize: 14, marginTop: 20, marginBottom: 5 } : { height: 0 }}>Add On services</Text>
                { this.state.add_ons.length > 0 && addOnServices}
                <View style={{ marginVertical: 8 }}></View>
                <TouchableOpacity style={this.state.booking.service_status == "Professional on site" || this.state.booking.service_status == "Work in progress" ? styles.addOnsTouch : { height: 0 }} onPress={() => {
                    this.props.navigation.navigate('onGoingAddOns');
                }} >
                    <Text style={styles.addOnsText}>Add On Services</Text>
                </TouchableOpacity>
                <View style={{ marginVertical: 8 }}></View>
                <View style={styles.totalList}>
                    <Text style={styles.listTitle}>Convenience Fees</Text>
                    <Text style={styles.listPrice}>Rs. 50</Text>
                </View>
                <Divider style={{ marginVertical: 10 }} />
                <View style={styles.totalList}>
                    <Text style={styles.listTitle}>Total</Text>
                    <Text style={styles.listTotal}>Rs. {this.state.booking.total_price}</Text>
                </View>
            </Card>
        );
    }

    renderStatus() {

        return (
            <Card containerStyle={styles.statusCard}>
                <Text style={styles.serviceDetailsHead}>Current Status</Text>
                <Divider style={{ width: '40%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                <Item
                    rounded
                    style={styles.statusItem}
                    onPress={() => this.showModal()}
                >
                    <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                        <Text style={styles.statusItemText}>{this.state.booking.service_status}</Text>
                        <Icon
                            name='chevron-down'
                            style={styles.iconStyle}
                            color="white"
                        />
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => this.hideModal()}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={{ borderBottomWidth: 0.5, padding: "3%" }}>
                                    <Text
                                        style={{ fontSize: 21, fontFamily: 'Poppins-SemiBold' }}>
                                        Update Status
                                    </Text>
                                </View>
                                <FlatList
                                    data={this.state.data}
                                    keyExtractor={(item, index) => index.toString()}
                                    style={{ marginTop: 10 }}
                                    renderItem={
                                        ({ item }) =>
                                            <TouchableOpacity onPress={() => this.updateStatus(item.title)}>
                                                <View style={styles.countryStyle}>
                                                    <Text style={styles.textStyle}>
                                                        {item.title}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                    }
                                />
                            </View>
                        </View>
                    </Modal>
                </Item>
            </Card>
        );
    }

    async onlineInitiated() {

        await this.showLoader();

        // console.log(this.state.booking._id);

        await fetch(env.api + "professional/serviceRequest/generate_payment_link/" + this.state.booking._id, {
            method: "PUT",
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
                } else if (data.message) {
                    console.log(data.status);
                    this.setState({
                        onlineStatus: data.status,
                        invoiceId: data.invoiceId,
                        cancelled: false
                    });
                    this.hideLoader();
                    this.showOnlineModal();
                    // this.updateBookingDetails();
                }
            });


        // this.setState({
        //     cancelled: false,
        //     onlineStatus: "INITIATED"
        // });
    }

    async fetchOnlineStatus() {

        if (!this.state.cancelled) {

            await fetch(env.api + "professional/serviceRequest/fetchpaymentstatus/" + this.state.booking._id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + this.state.token
                },
                body: JSON.stringify({
                    invoiceId: this.state.invoiceId
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        this.hideLoader();
                        alert(data.error);
                    } else if (data.message) {
                        console.log(data.status);
                        this.setState({
                            onlineStatus: data.status,
                        });
                        // this.updateBookingDetails();
                    }
                });

            // console.log(this.state.onlineStatus);

            if (this.state.onlineStatus == "PAID") {
                await this.showLoader();
                await this.setState({
                    cancelled: true
                });
                await this.hideOnlineModal();
                await this.props.navigation.navigate('onGoing');
            }

            if (this.state.onlineStatus == "EXPIRED") {
                this.setState({
                    cancelled: true
                });
                alert("Link is Expired , please resend payment link!!");
            }
        }
    }

    async onlineResend() {

        // console.log("Link Resent");
        // this.setState({
        //     onlineStatus: 'INITIATED',
        //     cancelled: false
        // });

        await this.showLoader();

        await fetch(env.api + "professional/serviceRequest/resendlink/" + this.state.booking._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + this.state.token
            },
            body: JSON.stringify({
                invoiceId: this.state.invoiceId
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.hideLoader();
                    alert(data.error);
                } else if (data.message) {
                    // this.hideLoader();
                    // console.log(data.status);
                    this.setState({
                        onlineStatus: "INITIATED",
                        cancelled: false
                    });
                    this.hideLoader();
                    // this.updateBookingDetails();
                }
            });
    }

    async onlineCancel() {

        await this.showLoader();

        await fetch(env.api + "professional/serviceRequest/cancelonlinepayment/" + this.state.booking._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + this.state.token
            },
            body: JSON.stringify({
                invoiceId: this.state.invoiceId
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.hideLoader();
                    alert(data.error);
                } else if (data.message) {
                    // this.setState({
                    //     bookings: data.Bookings
                    // })
                    // this.hideLoader();
                    console.log(data.status);
                    this.setState({
                        onlineStatus: data.status,
                        cancelled: true
                    });
                    this.hideLoader();
                    this.hideOnlineModal();
                    // this.updateBookingDetails();
                }
            });

        // this.setState({
        //     onlineStatus: "PENDING",
        //     cancelled: true
        // });

    }

    async cashInitiated() {

        await this.showLoader();

        await fetch(env.api + "professional/serviceRequest/initiatecash/" + this.state.booking._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + this.state.token
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.hideLoader();
                    alert(data.error);
                } else if (data.message) {
                    // this.setState({
                    //     bookings: data.Bookings
                    // })
                    // this.hideLoader();
                    this.hideLoader();
                    console.log(data.status);
                    // this.updateBookingDetails();
                }
            });

        await this.showCashModal();
    }

    async cashDone() {

        await this.showLoader();

        const booking = this.state.booking;

        booking.service_status = "Payment Done";

        await this.setState({
            booking: booking
        });

        await this.updateService();

        await this.showLoader();

        await fetch(env.api + "professional/serviceRequest/confirmcash/" + this.state.booking._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + this.state.token
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.hideLoader();
                    alert(data.error);
                } else if (data.message) {
                    // this.setState({
                    //     bookings: data.Bookings
                    // })
                    // this.hideLoader();
                    // this.hideLoader();
                    this.props.navigation.navigate('onGoing');
                    console.log(data.status);
                    // this.updateBookingDetails();
                }
            });

        await this.hideCashModal();
    }

    async cashCancel() {

        await this.showLoader();

        await fetch(env.api + "professional/serviceRequest/cancelcash/" + this.state.booking._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + this.state.token
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.hideLoader();
                    alert(data.error);
                } else if (data.message) {
                    // this.setState({
                    //     bookings: data.Bookings
                    // })
                    // this.hideLoader();
                    this.hideLoader();
                    console.log(data.status);
                    // this.updateBookingDetails();
                }
            });

        await this.hideCashModal();
    }

    renderPaymentLink() {
        if (this.state.booking.service_status === 'Work completed') {
            return (
                <Card containerStyle={styles.statusCard} >
                    <Text style={styles.serviceDetailsHead}>Payment Link</Text>
                    <Divider style={{ width: '40%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    <Text style={styles.payInfo}>Payment link will be directly sent to customer after you generate it by clicking button given below.</Text>
                    <TouchableOpacity style={styles.addOnsTouch}
                        onPress={() => {
                            // this.showModal();
                            this.onlineInitiated();
                        }}
                    >
                        <Text style={styles.addOnsText}>Generate Link</Text>
                    </TouchableOpacity>
                    <View style={styles.or}>
                        <Divider style={styles.leftLine} />
                        <Text style={styles.orText}>OR</Text>
                        <Divider style={styles.rightLine} />
                    </View>
                    <TouchableOpacity style={styles.addOnsTouch}
                        onPress={() => {
                            this.cashInitiated();
                        }}
                    >
                        <Text style={styles.addOnsText}>Cash Payment</Text>
                    </TouchableOpacity>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.onlineModalVisible}
                        onRequestClose={() => this.hideOnlineModal()}>
                        <View style={styles.centeredView}>
                            <View style={styles.onlineModalView}>
                                <View style={{ borderBottomWidth: 0.5, padding: "3%" }}>
                                    <Text
                                        style={{ fontSize: 21, fontFamily: 'Poppins-SemiBold', textAlign: 'center' }}>
                                        Online Payment
                                    </Text>
                                </View>
                                <Text style={this.state.onlineStatus != "PAID" && this.state.onlineStatus != "EXPIRED" ? {
                                    fontFamily: "Poppins-SemiBold",
                                    textAlign: 'center',
                                    fontSize: 15,
                                    marginTop: 20
                                }
                                    :
                                    {
                                        height: 0
                                    }
                                }>Please Wait ...</Text>
                                {this.state.onlineStatus != "PAID" && this.state.onlineStatus != "EXPIRED"
                                    ?
                                    <View>
                                        <Text style={{
                                            fontFamily: "Poppins-Regular",
                                            textAlign: 'center',
                                            fontSize: 12,
                                            marginTop: 20
                                        }}>Payment link is sent to customer.</Text>
                                        <Text style={{
                                            fontFamily: "Poppins-Regular",
                                            textAlign: 'center',
                                            fontSize: 12
                                        }}>Modal will be closed automatically once payment is done.</Text>
                                        <Text style={{
                                            fontFamily: "Poppins-Regular",
                                            textAlign: 'center',
                                            fontSize: 12
                                        }}>Please don't close the app in between</Text>
                                    </View>
                                    :
                                    <View>
                                        <Text style={{
                                            fontFamily: "Poppins-Regular",
                                            textAlign: 'center',
                                            fontSize: 12,
                                            marginTop: 20
                                        }}>Payment link is expired.</Text>
                                        <Text style={{
                                            fontFamily: "Poppins-Regular",
                                            textAlign: 'center',
                                            fontSize: 12
                                        }}>Please resend the payment link to customer.</Text>
                                    </View>
                                }
                                <View style={{
                                    flexDirection: 'row',
                                    marginTop: 20
                                }}>
                                    <TouchableOpacity style={{
                                        flex: 1
                                    }}>
                                        <Text style={{
                                            fontFamily: "Poppins-SemiBold",
                                            textAlign: 'center',
                                            fontSize: 18,
                                            color: '#FA682E'
                                        }}
                                            onPress={() => {
                                                this.onlineCancel();
                                            }}
                                        >Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        flex: 1
                                    }}>
                                        <Text style={{
                                            fontFamily: "Poppins-SemiBold",
                                            textAlign: 'center',
                                            fontSize: 18,
                                            color: '#49AB74'
                                        }}
                                            onPress={() => {
                                                this.onlineResend();
                                            }}
                                        >Resend</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.cashModalVisible}
                        onRequestClose={() => this.hideCashModal()}>
                        <View style={styles.centeredView}>
                            <View style={styles.cashModalView}>
                                <View style={{ borderBottomWidth: 0.5, padding: "3%" }}>
                                    <Text
                                        style={{ fontSize: 21, fontFamily: 'Poppins-SemiBold', textAlign: 'center', }}>
                                        Cash Payment
                                    </Text>
                                </View>
                                <Text style={{
                                    fontFamily: "Poppins-Regular",
                                    textAlign: 'center',
                                    marginTop: 20,
                                    fontSize: 15
                                }}>Cash Payment is Initiated</Text>
                                <Text style={{
                                    fontFamily: "Poppins-Regular",
                                    textAlign: 'center',
                                    fontSize: 15
                                }}>Did you receive cash?</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    marginTop: 20
                                }}>
                                    <TouchableOpacity style={{
                                        flex: 1
                                    }}>
                                        <Text style={{
                                            fontFamily: "Poppins-SemiBold",
                                            textAlign: 'center',
                                            fontSize: 18,
                                            color: '#FA682E'
                                        }}
                                            onPress={() => {
                                                this.cashCancel();
                                            }}
                                        >Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        flex: 1
                                    }}>
                                        <Text style={{
                                            fontFamily: "Poppins-SemiBold",
                                            textAlign: 'center',
                                            fontSize: 18,
                                            color: '#49AB74'
                                        }}
                                            onPress={() => {
                                                this.cashDone();
                                            }}
                                        >Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </Card>
            );
        } else {
            return (
                <View>

                </View>
            );
        }
    }

    async updateAddOns() {

        // await this.showLoader();

        let fetchedAddOns = this.state.booking.add_ons;

        let services = await AsyncStorage.getItem('addOnServices');
        const asyncAddOns = await JSON.parse(services);

        console.log(asyncAddOns);
        const b = this.state.booking;
        let price = this.props.route.params.price;

        if (asyncAddOns !== null) {
            if (fetchedAddOns.length != 0) {
                asyncAddOns.forEach(addOn => {
                    var added = false;
                    fetchedAddOns.forEach(service => {
                        if (service.service_id == addOn.service_id) {
                            service.quantity += 1;
                            added = true;
                        }
                    });
                    if (!added) {
                        fetchedAddOns.push({ service_id: addOn.service_id, service_name: addOn.service_name, quantity: 1, price: addOn.price });
                    }
                });
            } else if (fetchedAddOns.length == 0) {
                fetchedAddOns = asyncAddOns;
            }

            asyncAddOns.forEach(s => {
                price += s.price * s.quantity;
            });

            b.total_price = price;

            await this.setState({
                booking: b
            });
        }

        await this.setState({
            add_ons: fetchedAddOns
        });

        await this.hideLoader();
        await this.hideRefresh();
    }

    async updateService() {

        await this.showLoader();

        const b = this.state.booking;

        let price = b.total_price;
        const add_ons = this.state.add_ons;
        const status = b.service_status;

        console.log(price);
        console.log(add_ons);
        console.log(status);

        // await this.getToken();
        // await this.getProfessional();

        await fetch(env.api + "professional/serviceRequest/update/" + this.state.booking.professional_id + "/" + this.state.booking._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + this.state.token
            },
            body: JSON.stringify({
                add_ons: add_ons,
                service_status: status,
                total_price: price
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.hideLoader();
                    alert(data.error);
                } else if (data.message) {
                    // this.setState({
                    //     bookings: data.Bookings
                    // })
                    // this.hideLoader();
                    this.hideLoader();
                    console.log(data.message);
                    // this.updateBookingDetails();
                }
            });
    }

    async componentDidMount() {
        await this.getToken();
        await this.updateAddOns();
        this.timerId = setInterval(() => this.fetchOnlineStatus(), 4000);
        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            () => {
                this.updateAddOns();
            }
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerId)
    }

    async handleRefresh() {
        this.showRefresh();
        await this.getToken();
        await this.updateAddOns();
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.display}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.handleRefresh()} />
                        }
                    >
                        <View style={{ marginRight: 10, paddingBottom: 100 }}>
                            <View style={{ alignItems: 'center' }}>
                                {this.renderBrief()}
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                {this.renderServiceDetails()}
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                {this.renderStatus()}
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                {this.renderPaymentLink()}
                            </View>
                        </View>
                    </ScrollView>
                    <View style={styles.selectDateTimeButton}>
                        <TouchableOpacity style={styles.selectDateTimeButtonOpacity} onPress={() => {
                            this.updateService();
                        }}>
                            <Text style={styles.selectDateTimeButtonText}>Update Service </Text>
                            <Ionicons style={styles.selectDateTimeButtonIcon} name="arrow-forward-outline" color="white" size={24} />
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

export default onGoingServiceDetails;

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
        alignItems: 'center'
    },
    briefCard: {
        minWidth: '95%',
        maxWidth: '95%',
        backgroundColor: '#FCFCFC',
        borderRadius: 30
    },
    briefHead: {
        flexDirection: 'row'
    },
    briefImg: {
        flex: 1,
        maxHeight: 60,
        minHeight: 60,
        minWidth: 60,
        maxWidth: 60,
        borderRadius: 60,
        backgroundColor: '#FAAE6B',
    },
    briefHeadText: {
        flex: 3,
        margin: 10,
        justifyContent: 'center',
    },
    briefDetails: {
        flex: 3,
        flexDirection: 'row',
    },
    serviceName: {
        fontFamily: 'Poppins-SemiBold',
        color: 'gray',
        fontSize: 15,
    },
    status: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        lineHeight: 18
    },
    help: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
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
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#CCCCCC'
    },
    competedMessage: {
        marginTop: 10,
        height: 40,
        backgroundColor: '#8FCFFA',
        width: '90%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    competedMessageText: {
        fontFamily: 'Poppins-SemiBold',
        color: '#356ABB',
        fontSize: 12
    },
    proTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        alignSelf: 'center'
    },
    proCard: {
        minWidth: '95%',
        maxWidth: '95%',
        backgroundColor: '#FCFCFC',
        borderRadius: 30
    },
    proHead: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    proImg: {
        flex: 1,
        maxHeight: 60,
        maxWidth: 60,
        borderRadius: 30,
    },
    proHeadText: {
        flex: 3,
        margin: 10,
        justifyContent: 'center',
    },
    proDetails: {
        flex: 3,
        flexDirection: 'row',
    },
    proName: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
    },
    proType: {
        fontFamily: 'Poppins-Regular',
        color: 'gray',
        fontSize: 15,
        lineHeight: 18
    },
    call: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewPro: {
        flex: 1,
        marginTop: 10,
        alignItems: 'center'
    },
    noProCard: {
        minWidth: '95%',
        maxWidth: '95%',
        height: 100,
        backgroundColor: '#FCFCFC',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartCard: {
        backgroundColor: '#FCFCFC',
        borderRadius: 30,
        padding: 25,
        minWidth: '95%',
        maxWidth: '95%',
    },
    serviceDetailsHead: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 25,
        alignSelf: 'center'
    },
    bookingDetails: {
        flexDirection: 'row',
        marginBottom: 15
    },
    bookingIcon: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bookingText: {
        flex: 4
    },
    bookingTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
    },
    bookingDesc: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
    },
    cartHead: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        marginBottom: 20
    },
    totalList: {
        flexDirection: 'row'
    },
    listTitle: {
        flex: 4,
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
    },
    listPrice: {
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'gray'
    },
    listTotal: {
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
    },
    statusCard: {
        minWidth: '95%',
        maxWidth: '95%',
        backgroundColor: '#FCFCFC',
        borderRadius: 30
    },
    statusView: {
        alignItems: 'center',

    },
    statusItem: {
        flexDirection: 'row',
        width: '75%',
        marginVertical: 10
    },
    notActiveStatusSquare: {
        flex: 2,
        height: 25,
        maxWidth: 25,
        backgroundColor: '#C7C7C7',
        borderRadius: 8,
        marginRight: 20,
        marginLeft: 8
    },
    notActiveStatusText: {
        flex: 7,
        fontFamily: 'Poppins-Regular',
        color: '#C7C7C7',
        fontSize: 15,
    },
    activeStatusSquare: {
        flex: 2,
        height: 25,
        maxWidth: 25,
        backgroundColor: 'green',
        borderRadius: 8,
        marginRight: 20,
        marginLeft: 8
    },
    activeStatusText: {
        flex: 7,
        fontFamily: 'Poppins-SemiBold',
        color: '#1c1c1c',
        fontSize: 16,
    },
    addOnsTouch: {
        backgroundColor: '#1c1c1c',
        width: '75%',
        height: 50,
        borderRadius: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    addOnsText: {
        fontFamily: 'Poppins-SemiBold',
        color: 'white',
        fontSize: 17,
    },
    countryStyle: {
        padding: "3%",
    },
    textStyle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    modalView: {
        backgroundColor: "white",
        width: '80%',
        padding: 20,
        borderRadius: 20,
        elevation: 25
    },
    onlineModalView: {
        backgroundColor: "white",
        width: '80%',
        padding: 20,
        borderRadius: 20,
        elevation: 25
    },
    cashModalView: {
        backgroundColor: "white",
        width: '80%',
        padding: 20,
        borderRadius: 20,
        elevation: 25
    },
    statusItem: {
        backgroundColor: 'white',
        alignItems: 'center',
        height: 50,
        backgroundColor: '#1c1c1c',
        width: '95%',
        alignSelf: 'center'
    },
    statusItemText: {
        flex: 4,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 17,
        paddingLeft: 30,
        color: 'white'
    },
    iconStyle: {
        paddingRight: 30,
        color: 'white'
    },
    payInfo: {
        fontFamily: 'Poppins-Italic',
        fontSize: 12,
        textAlign: 'center',
        color: 'gray',
        marginBottom: 20
    },
    or: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
        paddingHorizontal: 50
    },
    orText: {
        flex: 1,
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        alignSelf: 'center',
        textAlign: 'center',
        color: 'gray'
    },
    leftLine: {
        flex: 2,
        width: '15%',
        alignSelf: 'center',
        height: 1
    },
    rightLine: {
        flex: 2,
        width: '15%',
        alignSelf: 'center',
        height: 1
    },
    selectDateTimeButtonOpacity: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f1f1f',
        height: 50,
        width: 350,
        borderRadius: 25,
        flexDirection: 'row',
        paddingLeft: 30,
        marginBottom: 20
    },
    selectDateTimeButton: {
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