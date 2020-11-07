import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import { AirbnbRating, Card, Divider, Input, Rating } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Textarea from 'react-native-textarea';


import carpenter from '../../resources/carpenter.jpg';

class serviceDetails extends Component {

    state = {
        booking: this.props.route.params.booking,
        // booking: {
        //     __v: 0,
        //     _id: "5f6397719db862898d0bafe1",
        //     add_ons: [],
        //     createdAt: "2020-09-17T17:05:53.585Z",
        //     customer_id: "5f6314f334c26651e0c0a128",
        //     profession_type: "Electrician",
        //     professional_name: "Ritesh Nair",
        //     service_address: {
        //         address_detail1: "21",
        //         address_detail2: "Shreeji Bapa Nagar Society",
        //         city: "Mahesana",
        //         geometry: { "type": "Point" },
        //         person_name: "Jaimin Desai",
        //         state: "Gujarat"
        //     },
        //     service_date: "20/9/2020/Sun",
        //     service_details: [
        //         {
        //             price: 200,
        //             quantity: 1,
        //             service_name: "Fan Repairing",
        //             service_id: "5f6314c11091f41272cbef01"
        //         },
        //         {
        //             price: 150,
        //             quantity: 2,
        //             service_name: "Fan Installation",
        //             service_id: "5f6314c11091f41272cbef02"
        //         }],
        //     service_status: "Service Requested",
        //     service_time: "2:30",
        //     total_price: 550,
        //     updatedAt: "2020-09-17T17:05:53.585Z",
        //     // feedback: 'Wonderful Service, will recommend to everyone.'
        // },
        feedback: {
            ratings: 4,
            msg: 'Service was really good'
        },
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
    }

    updateStatus() {
        const statusWord = this.state.statusWords;

        statusWord.forEach((s, key) => {
            if (s === this.state.booking.service_status) {
                this.setState({
                    status: key
                });
            }
        });
    }

    renderBrief() {
        return (
            <View>
                <Card containerStyle={styles.briefCard}>
                    <View style={styles.briefHead}>
                        <Image source={carpenter} style={styles.briefImg} />
                        <View style={styles.briefDetails}>
                            <View style={styles.briefHeadText}>
                                <Text style={styles.serviceName}>{this.state.booking.profession_type} </Text>
                                <Text style={styles.status}>{this.state.booking.service_status}</Text>
                            </View>
                        </View>
                        <View style={styles.help}>
                            <Text style={{ color: 'red', fontFamily: 'Poppins-Medium', fontSize: 15 }}>HELP</Text>
                        </View>
                    </View>
                    <Divider />
                    <View style={styles.briefBottom}>
                        <TouchableOpacity style={styles.statusBtn} onPress={this.downButtonHandler}>
                            <Ionicons name="locate-outline" size={24} />
                            <Text>Status</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rescheduleBtn}>
                            <Ionicons name="sync-outline" size={24} color={this.state.status == 0 || this.state.status > 4 ? 'gray' : 'black'} />
                            <Text style={
                                this.state.status == 0 || this.state.status > 4
                                    ? { color: 'gray' }
                                    : { color: 'black' }} >Reschedule</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.statusBtn}>
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

        const dateArray = this.state.booking.service_date.split('/');
        const date = dateArray[0];
        const month = dateArray[1];
        const year = dateArray[2];
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
                <View>
                    <Card containerStyle={styles.proCard}>
                        <Text style={styles.proTitle}>Customer Details</Text>
                        <Divider style={{ width: '30%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center' }} />
                        <View style={styles.proHead}>
                            <Image source={carpenter} style={styles.proImg} />
                            <View style={styles.proDetails}>
                                <View style={styles.proHeadText}>
                                    <Text style={styles.proName}>{this.state.booking.customer_name} </Text>
                                    <Text style={styles.proType}>{this.state.booking.service_status}</Text>
                                </View>
                            </View>
                            <View style={styles.call}>
                                <Ionicons name="call-outline" color="green" size={36} />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.viewPro} onPress={() => {
                            this.props.navigation.navigate('customer', { id: this.state.booking.customer_id })
                        }} >
                            <Text style={{ fontFamily: 'Poppins-Medium', color: 'blue', fontSize: 15 }} >View Profile {" >>"}</Text>
                        </TouchableOpacity>
                    </Card>
                    <Card containerStyle={styles.proCard}>
                        <Text style={styles.proTitle}>Appointed Professional</Text>
                        <Divider style={{ width: '30%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center' }} />
                        <View style={styles.proHead}>
                            <Image source={carpenter} style={styles.proImg} />
                            <View style={styles.proDetails}>
                                <View style={styles.proHeadText}>
                                    <Text style={styles.proName}>{this.state.booking.professional_name} </Text>
                                    <Text style={styles.proType}>{this.state.booking.profession_type}</Text>
                                </View>
                            </View>
                            <View style={styles.call}>
                                <Ionicons name="call-outline" color="green" size={36} />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.viewPro}
                            onPress={() => {
                                this.props.navigation.navigate('professional', { id: this.state.booking.professional_id })
                            }}
                        >
                            <Text style={{ fontFamily: 'Poppins-Medium', color: 'blue', fontSize: 15 }} >View Profile {" >>"}</Text>
                        </TouchableOpacity>
                    </Card>
                </View>
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
            </Card>
        );
    }

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
                    <Text style={styles.feedbackTitle}>Customer Feedback</Text>
                    <Divider style={{ width: '30%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    <View style={styles.proHead}>
                        <Image source={carpenter} style={styles.feedbackImg} />
                        <View style={styles.feedbackDetails}>
                            <View style={styles.feedbackHeadText}>
                                <Text style={styles.proName}>{this.state.booking.professional_name} </Text>
                                <Text style={styles.proType}>{this.state.booking.profession_type}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.viewPro}>
                            <Text style={{ fontFamily: 'Poppins-Medium', color: 'green', fontSize: 14, textAlign: 'center' }}>View{'\n'}Profile</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={this.state.feedback ? { height: 0 } : styles.feedbackMsg1}>Customer has not given feedback yet</Text>
                    {this.state.feedback
                        ?
                        <AirbnbRating
                            showRating
                            defaultRating={this.state.feedback.ratings}
                            reviews={["Terrible ", "Bad ", "Okay ", "Good ", "Excellent  "]}
                        />
                        : null
                    }
                    <View style={this.state.feedback ? styles.feedbackContentView : { height: 0 }}>
                        <Text style={this.state.feedback ? styles.feedbackContent : { height: 0 }}>"{this.state.feedback.msg}"</Text>
                    </View>
                </Card>
            );
    }

    componentDidMount() {
        this.updateStatus();
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={styles.display}>
                    <ScrollView
                    >
                        <View style={{ marginRight: 10, paddingBottom: 50 }}>
                            {/* <View style={{ alignItems: 'center' }}>
                                {this.renderBrief()}
                            </View> */}
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
                </View>
            </View>
        );
    }
}

export default serviceDetails;

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
    homeButtonOpacity: {
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
    homeButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
    },
    homeButtonText: {
        flex: 4,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        color: '#fff'
    },
    homeButtonIcon: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'flex-end',
    },
});