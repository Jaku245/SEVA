import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Linking } from 'react-native';
import { AirbnbRating, Card, Divider, Input, Rating } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Textarea from 'react-native-textarea';


import carpenter from '../../../../../resources/carpenter.jpg';
import { env } from '../../../shared/supports';

class historyServiceDetails extends Component {

    state = {
        booking: this.props.route.params.booking,
        feedback: this.props.route.params.feedback,
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
    }

    renderBrief() {
        // console.log(this.state.booking);
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
                                    marginLeft: 20,
                                    marginRight: 10,
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Ionicons name="person-outline" color="white" size={24} />
                                </View>
                        }
                        <View style={styles.briefDetails}>
                            <View style={styles.briefHeadText}>
                                <Text style={styles.serviceName}>{this.state.booking.customer_name} </Text>
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

    renderCompletedMessage() {

        const dateArray = this.state.booking.service_date.split('/');
        // const date = dateArray[0];
        // const month = dateArray[1];
        // const year = dateArray[2];
        const day = dateArray[3];

        const updatedDate = new Date(this.state.booking.updatedAt);
        const date = updatedDate.getDate();
        const month = this.state.month[updatedDate.getMonth()];
        const year = updatedDate.getFullYear();
        // const day = updatedDate.getDay();

        if (this.state.booking.service_status == "Payment done") {
            return (
                <View style={styles.competedMessage}>
                    <Text style={styles.competedMessageText}>Service completed on {day}, {date} {month}, {year} at {this.state.booking.service_time} pm </Text>
                </View>
            );
        } else {
            return (
                <View style={styles.cancelledMessage}>
                    <Text style={styles.cancelledMessageText}>Service cancelled on {day}, {date} {month}, {year} at {this.state.booking.service_time} pm </Text>
                </View>
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
                <Text style={styles.serviceDetailsHead}>{this.state.booking.service_status != "Payment done" ? 'Service Details' : 'Amount Paid'}</Text>
                <Text style={this.state.booking.service_status == "Payment done" ? styles.serviceDetailsHead : { height: 0 }}>{this.state.booking.service_status == "Payment done" ? this.state.booking.total_price : null}</Text>
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
                <Divider style={{ marginVertical: 10, height: 2 }} />
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

    renderFeedback() {
        if (this.state.feedback.msg != '') {
            return (
                <Card containerStyle={styles.feedbackCard}>
                    <Text style={styles.feedbackTitle}>Customer's Feedback</Text>
                    <Divider style={{ width: '30%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    <AirbnbRating
                        showRating
                        defaultRating={this.state.feedback.ratings}
                        reviews={["Terrible ", "Bad ", "Okay ", "Good ", "Excellent  "]}
                        isDisabled={true}
                    />
                    <View style={styles.feedbackContentView}>
                        <Text style={styles.feedbackContent}>"{this.state.feedback.msg}"</Text>
                    </View>
                </Card>
            );
        } else if (this.state.booking.service_status != "Service Cancelled") {
            return (
                <Card containerStyle={styles.feedbackCard}>
                    <Text style={styles.feedbackTitle}>Customer's Feedback</Text>
                    <Divider style={{ width: '30%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    <View style={styles.feedbackContentView}>
                        <Text style={{
                            fontFamily: 'Poppins-SemiBold',
                            color: 'gray',
                            fontSize: 14,
                            alignSelf: 'center',
                            textAlign: 'center'
                        }}>Customer has not given feedback yet.</Text>
                    </View>
                </Card>
            );
        }
    }
    render() {

        return (
            <View style={styles.container}>
                <View style={styles.display}>
                    <ScrollView>
                        <View style={{ marginRight: 10, paddingBottom: 30 }}>
                            <View style={{ alignItems: 'center' }}>
                                {this.renderBrief()}
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                {this.renderCompletedMessage()}
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                {this.renderServiceDetails()}
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                {this.renderFeedback()}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

export default historyServiceDetails;

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
        marginLeft: 20,
        marginRight: 10,
        alignSelf: 'center'
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
        fontSize: 18,
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
    cancelledMessage: {
        marginTop: 10,
        height: 40,
        backgroundColor: '#FF9E9E',
        width: '90%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cancelledMessageText: {
        fontFamily: 'Poppins-SemiBold',
        color: '#B30000',
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
        maxWidth: 60,
        borderRadius: 30,
        marginLeft: 20,
        marginRight: 10
    },
    feedbackHeadText: {
        flex: 1,
        margin: 10,
        justifyContent: 'center',
    },
    feedbackDetails: {
        flex: 1,
        flexDirection: 'row',
    },
    proName: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
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