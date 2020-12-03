import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Linking, RefreshControl } from 'react-native';
import { AirbnbRating, Card, Divider, Input, Rating } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Textarea from 'react-native-textarea';

import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';
import carpenter from '../../../../../resources/carpenter.jpg';
import AsyncStorage from '@react-native-community/async-storage';

class customerServiceDetails extends Component {

    state = {
        booking: this.props.route.params.booking,
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
            { id: 7, title: "Payment done" },
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
        loc: 0,
        dynamicIndex: 0,
        loaderVisible: false,
        refreshing: false,
        feedback: '',
        ratings: 0,
        feedbackSubmitted: false,
        ratingsSubmitted: false
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

    updateStatus() {
        const statusWord = this.state.statusWords;

        statusWord.forEach((s, key) => {
            if (s === this.state.booking.service_status) {
                this.setState({
                    status: key
                });
            }
            this.hideRefresh();
        });
    }

    async cancel() {
        this.showLoader();

        let customerWithOutParse = await AsyncStorage.getItem('customer');
        let customer = JSON.parse(customerWithOutParse);

        let token = await AsyncStorage.getItem('token');

        await fetch(env.api + "customer/cancelServiceRequest/" + customer.customerId + "/" + this.state.booking._id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.hideLoader();
                    alert(data.error);
                } else {
                    // console.log(data.booking);
                    console.log(data.message);
                    // this.emptyStorage();
                    this.hideLoader();
                    this.props.navigation.navigate('customerBookings');
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
                                }} style={styles.proImg} />
                                :
                                <View style={{
                                    flex: 2,
                                    maxHeight: 60,
                                    minHeight: 60,
                                    minWidth: 60,
                                    maxWidth: 60,
                                    borderRadius: 60,
                                    backgroundColor: '#FAAE6B',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Ionicons name="person-outline" color="white" size={24} />
                                </View>
                        }
                        <View style={styles.briefDetails}>
                            <View style={styles.briefHeadText}>
                                <Text style={styles.serviceName}>{this.state.booking.profession_type} </Text>
                                <Text style={styles.status}>{this.state.booking.service_status}</Text>
                            </View>
                        </View>
                        <View style={styles.help}>
                            <Text style={{ color: 'red', fontFamily: 'Poppins-Medium', fontSize: 15 }}
                                onPress={() => {
                                    this.props.navigation.navigate('help');
                                }}
                            >HELP</Text>
                        </View>
                    </View>
                    <Divider />
                    <View style={styles.briefBottom}>
                        <TouchableOpacity style={styles.statusBtn} onPress={this.downButtonHandler}>
                            <Ionicons name="locate-outline" size={24} />
                            <Text>Status</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rescheduleBtn}
                            onPress={() => {
                                if (this.state.status != 0 && this.state.status < 4) {
                                    this.props.navigation.navigate('reschedule', { id: this.state.booking._id })
                                } else {
                                    null
                                }
                            }}
                        >
                            <Ionicons name="sync-outline" size={24} color={this.state.status == 0 || this.state.status > 4 ? 'gray' : 'black'} />
                            <Text style={
                                this.state.status == 0 || this.state.status > 4
                                    ? { color: 'gray' }
                                    : { color: 'black' }} >Reschedule</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.statusBtn}
                            onPress={() => {
                                if (this.state.status != 0 && this.state.status <= 4) {
                                    this.cancel();
                                } else {
                                    null
                                }
                            }}
                        >
                            <Ionicons name="close-circle-outline" size={24} color={this.state.status == 0 || this.state.status > 4 ? 'gray' : 'black'} />
                            <Text style={
                                this.state.status == 0 || this.state.status > 4
                                    ? { color: 'gray' }
                                    : { color: 'black' }} >Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
        );
    }

    renderCompletedMessage() {

        const updatedDate = new Date(this.state.booking.updatedAt);

        const dateArray = this.state.booking.service_date.split('/');

        const date = updatedDate.getDate();
        const month = updatedDate.getMonth();
        const year = updatedDate.getFullYear();
        const day = dateArray[3];


        if (this.state.status == 7) {
            return (
                <View style={styles.competedMessage}>
                    <Text style={styles.competedMessageText}>Service completed on {day}, {date} {this.state.month[month - 1]}, {year} at {this.state.booking.service_time} pm </Text>
                </View>
            );
        }
    }

    renderProfessional() {
        if (this.state.status > 1 && this.state.status < 7) {
            return (
                <Card containerStyle={styles.proCard}>
                    <Text style={styles.proTitle}>Appointed Professional</Text>
                    <Divider style={{ width: '30%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center' }} />
                    <View style={styles.proHead}>
                        {
                            this.state.booking.professional_image
                                ?
                                <Image source={{
                                    uri: env.api + 'backend/' + this.state.booking.professional_image
                                }} style={styles.proImg} />
                                :
                                <View style={{
                                    flex: 2,
                                    maxHeight: 60,
                                    minHeight: 60,
                                    minWidth: 60,
                                    maxWidth: 60,
                                    borderRadius: 60,
                                    backgroundColor: '#FAAE6B',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Ionicons name="person-outline" color="white" size={24} />
                                </View>
                        }
                        <View style={styles.proDetails}>
                            <View style={styles.proHeadText}>
                                <Text style={styles.proName}>{this.state.booking.professional_name} </Text>
                                <Text style={styles.proType}>{this.state.booking.profession_type}</Text>
                            </View>
                        </View>
                        <View style={styles.call} >
                            <Ionicons name="call-outline" color="green" size={36}
                                onPress={async () => {
                                    let number = '';
                                    const professionalNumber = this.state.booking.professional_phone.split('-');
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
                    <TouchableOpacity style={styles.viewPro}
                        onPress={() => {
                            this.props.navigation.navigate('professionalProfile', { id: this.state.booking._id, proId: this.state.booking.professional_id });
                        }}
                    >
                        <Text style={{ fontFamily: 'Poppins-Medium', color: 'blue', fontSize: 15 }} >View Profile {" >>"}</Text>
                    </TouchableOpacity>
                </Card>
            );
        } else if (this.state.status === 1) {
            return (
                <Card containerStyle={styles.noProCard}>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18 }}>Your Professional will{'\n'} be Appointed Soon</Text>
                </Card>
            );
        }
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

        const addOnServices = this.state.booking.add_ons.map(s => {
            const serviceTotal = s.price * s.quantity;
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
                <Text style={this.state.booking.add_ons.length > 0 ? { fontFamily: 'Poppins-Regular', color: 'gray', fontSize: 14, marginTop: 20, marginBottom: 5 } : { height: 0 }}>Add On services</Text>
                {/* {services} */}
                {addOnServices}
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
                {   this.state.booking.payment_mode
                    ?
                    <>
                        <Divider style={{ marginTop: 30, marginBottom: 30 }} />
                        <Text style={styles.payHead}>Payment Details</Text>
                        <View style={styles.totalList}>
                            <Text style={styles.payTitle}>Payment Id</Text>
                            <Text style={styles.payId}>{this.state.booking.payment_id}</Text>
                        </View>
                        <View style={styles.totalList}>
                            <Text style={styles.payTitle}>Payment Mode</Text>
                            <Text style={styles.payValue}>{this.state.booking.payment_mode}</Text>
                        </View>
                        <View style={styles.totalList}>
                            <Text style={styles.payTitle}>Payment Status</Text>
                            <Text style={styles.payStatusSuccess}>{this.state.booking.payment_status}</Text>
                        </View>
                    </>
                    :
                    null
                }
            </Card>
        );
    }

    downButtonHandler = () => {
        // To Scroll to the index 5 element
        this.scrollview_ref.scrollTo({
            x: 0,
            y: this.state.loc,
            animated: true,
        });
    };

    renderStatus() {

        const status = this.state.data.map(s => {
            return (
                <View key={s.id} style={styles.statusItem} >
                    <View style={this.state.status >= s.id ? styles.activeStatusSquare : styles.notActiveStatusSquare}></View>
                    <Text style={this.state.status >= s.id ? styles.activeStatusText : styles.notActiveStatusText}>{s.title}</Text>
                </View>
            );
        })

        if (this.state.status > 0)
            return (
                <Card
                    containerStyle={styles.statusCard}
                    onLayout={event => {
                        const layout = event.nativeEvent.layout;
                        this.state.loc = (layout.y + layout.height) * 2.5;
                    }}
                >
                    <Text style={styles.serviceDetailsHead}>Status</Text>
                    <Divider style={{ width: '40%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    <View style={styles.statusView}>
                        {status}
                    </View>
                </Card>
            );
        else if (this.state.status == 0)
            return (
                <Card containerStyle={styles.statusCard}
                    onLayout={event => {
                        const layout = event.nativeEvent.layout;
                        this.state.loc = (layout.y + layout.height) * 2;
                    }}
                >
                    <Text style={styles.serviceDetailsHead}>Status</Text>
                    <Divider style={{ width: '40%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, alignSelf: 'center' }}>You cancelled this service.</Text>
                </Card>
            );
    }

    renderFeedback() {
        if (this.state.status == 7 && this.state.status != 0)
            return (
                <Card containerStyle={styles.feedbackCard}>
                    <Text style={styles.feedbackTitle}>Your Feedback</Text>
                    <Divider style={{ width: '30%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    <View style={styles.proHead}>
                        {
                            this.state.booking.professional_image
                                ?
                                <Image source={{
                                    uri: env.api + 'backend/' + this.state.booking.professional_image
                                }} style={styles.proImg} />
                                :
                                <View style={{
                                    flex: 2,
                                    maxHeight: 60,
                                    minHeight: 60,
                                    minWidth: 60,
                                    maxWidth: 60,
                                    borderRadius: 60,
                                    backgroundColor: '#FAAE6B',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Ionicons name="person-outline" color="white" size={24} />
                                </View>
                        }
                        <View style={styles.feedbackDetails}>
                            <View style={styles.feedbackHeadText}>
                                <Text style={styles.proName}>{this.state.booking.professional_name} </Text>
                                <Text style={styles.proType}>{this.state.booking.profession_type}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.viewPro}
                            onPress={() => {
                                this.props.navigation.navigate('professionalProfile', { id: this.state.booking._id, proId: this.state.booking.professional_id });
                            }}
                        >
                            <Text style={{ fontFamily: 'Poppins-Medium', color: 'green', fontSize: 14, textAlign: 'center' }}>View{'\n'}Profile</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={this.state.ratingsSubmitted ? { height: 0 } : styles.feedbackMsg1}>Rate our service as per your experience</Text>
                    <AirbnbRating
                        onFinishRating={(val) => {
                            this.setState({
                                ratings: val
                            });
                        }}
                        showRating
                        defaultRating={this.state.ratings}
                        reviews={["Terrible ", "Bad ", "Okay ", "Good ", "Excellent  "]}
                        isDisabled={this.state.ratingsSubmitted}
                    />
                    <Text style={this.state.feedbackSubmitted ? { height: 0 } : styles.feedbackMsg2}>It will be great if you can give us your valuable feedback</Text>
                    <Textarea
                        containerStyle={this.state.feedbackSubmitted ? { height: 0 } : styles.textareaContainer}
                        style={this.state.feedbackSubmitted ? { height: 0 } : styles.textarea}
                        onChangeText={(val) => {
                            this.setState({
                                feedback: val
                            });
                        }}
                        defaultValue={this.state.feedback}
                        maxLength={this.state.feedbackSubmitted ? null : 120}
                        placeholder={'Feedback'}
                        placeholderTextColor={'#c7c7c7'}
                    />
                    <View style={this.state.feedbackSubmitted ? styles.feedbackContentView : { height: 0 }}>
                        <Text style={this.state.feedbackSubmitted ? styles.feedbackContent : { height: 0 }}>"{this.state.feedback}"</Text>
                    </View>
                    <TouchableOpacity style={this.state.feedbackSubmitted ? { height: 0 } : styles.submit}
                        onPress={() => {
                            this.submitFeedback();
                        }}
                    >
                        <Text style={{ fontFamily: 'Poppins-Medium', color: 'white', fontSize: 14, textAlign: 'center' }}>Submit</Text>
                    </TouchableOpacity>
                </Card>
            );
    }

    async submitFeedback() {
        await this.showLoader();

        if (this.state.feedback.length > 0) {

            if (this.state.ratings != 0) {

                let customerWithOutParse = await AsyncStorage.getItem('customer');
                let customer = JSON.parse(customerWithOutParse);

                let token = await AsyncStorage.getItem('token');

                await fetch(env.api + "/customer/feedback/" + customer.customerId + "/" + this.state.booking._id + "/" + this.state.booking.professional_id, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        professional_feedback: this.state.feedback,
                        professional_ratings: this.state.ratings
                    })
                })
                    .then(res => res.json())
                    .then(async data => {
                        if (data.error) {
                            await this.hideLoader();
                            await alert(data.error);
                        } else {
                            console.log(data.message);
                            await this.updateFeedback();
                        }
                    })
                    .catch(function (error) {
                        console.log('There has been a problem with your fetch operation: ' + error.message);
                        // ADD THIS THROW error
                        alert("request unsuccessful");
                        throw error;
                    });
            } else {
                this.hideLoader();
                alert("You have to give some rating");
            }
        } else {
            this.hideLoader();
            alert("You have to give some feedback");
        }
    }

    async updateFeedback() {


        let customerWithOutParse = await AsyncStorage.getItem('customer');
        let customer = JSON.parse(customerWithOutParse);

        let token = await AsyncStorage.getItem('token');

        await fetch(env.api + "customer/booking/" + customer.customerId + "/" + this.state.booking._id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(async data => {
                if (data.error) {
                    await this.hideLoader();
                    await this.hideRefresh();
                    await alert(data.error);
                } else {
                    // console.log(data.professional_feedback);
                    // console.log(data.professional_ratings);
                    if (data.professional_feedback != null) {
                        await this.setState({
                            feedback: data.professional_feedback,
                            feedbackSubmitted: true
                        });
                    }
                    if (data.professional_ratings != null) {
                        await this.setState({
                            ratings: data.professional_ratings,
                            ratingsSubmitted: true
                        });
                    }
                    await this.hideLoader();
                    await this.hideRefresh();
                }
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                alert("request unsuccessful");
                throw error;
            });
    }

    async handleRefresh() {
        this.showRefresh();
        await this.updateStatus();
        await this.updateFeedback();
    }

    componentDidMount() {
        this.showLoader();
        this.updateStatus();
        this.updateFeedback();
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
                        <View style={{ marginRight: 10, paddingBottom: 50 }}>
                            <View style={{ alignItems: 'center' }}>
                                {this.renderBrief()}
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                {this.renderCompletedMessage()}
                            </View>
                            <View >
                                {this.renderProfessional()}
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                {this.renderServiceDetails()}
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                {this.renderStatus()}
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                {this.renderFeedback()}
                            </View>
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

export default customerServiceDetails;

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
        maxWidth: 60,
        borderRadius: 30
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
        minHeight: 60,
        minWidth: 60,
        maxWidth: 60,
        borderRadius: 60,
        backgroundColor: '#FAAE6B',
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
    feedbackTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
        alignSelf: 'center',
        marginTop: 10
    },
    feedbackCard: {
        minWidth: '95%',
        maxWidth: '95%',
        backgroundColor: '#FCFCFC',
        borderRadius: 30
    },
    feedbackHead: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    feedbackImg: {
        flex: 1,
        maxHeight: 60,
        minHeight: 60,
        minWidth: 60,
        maxWidth: 60,
        borderRadius: 60,
        backgroundColor: '#FAAE6B',
    },
    feedbackHeadText: {
        flex: 3,
        margin: 10,
        justifyContent: 'center',
    },
    feedbackDetails: {
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
    viewPro: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    feedbackMsg1: {
        fontFamily: 'Poppins-Regular',
        color: 'gray',
        fontSize: 15,
        alignSelf: 'center',
        marginTop: 10
    },
    feedbackMsg2: {
        fontFamily: 'Poppins-Regular',
        color: 'gray',
        fontSize: 15,
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 10
    },

    submit: {
        alignSelf: 'center',
        backgroundColor: '#1c1c1c',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 100,
        borderRadius: 20,
        marginTop: 10
    },
    textareaContainer: {
        height: 120,
        padding: 5,
        // backgroundColor: '#F5FCFF',
        borderBottomWidth: 1,
        borderColor: '#FFBE85'
    },
    textarea: {
        textAlignVertical: 'top',
        height: 170,
        fontSize: 15,
        color: '#333',
        fontFamily: 'Poppins-Regular'
    },
    feedbackContentView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15
    },
    feedbackContent: {
        fontFamily: 'Poppins-SemiBold',
        color: 'gray',
        fontSize: 17,
        alignSelf: 'center',
        textAlign: 'center'
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
    payHead: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        marginBottom: 5
    },
    payTitle: {
        flex: 2,
        fontFamily: 'Poppins-Regular',
        fontSize: 15,
        marginLeft: 5,
        color: '#5E5E5E'
    },
    payValue: {
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Poppins-Medium',
        fontSize: 15
    },
    payId: {
        flex: 3,
        textAlign: 'right',
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        color: 'gray'
    },
    payStatusSuccess: {
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        color: '#49AB74'
    },
    payStatusFail: {
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        color: '#FA682E'
    },
    payStatusPending: {
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        color: '#FAAE6B'
    }
});