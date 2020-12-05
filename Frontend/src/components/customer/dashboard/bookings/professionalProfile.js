import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useRef } from 'react';
import { RefreshControl, View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from 'react-native';
import { AirbnbRating, Card, Divider, Rating, Slider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import Carousel from 'react-native-snap-carousel';

import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';
import carpenter from '../../../../../resources/carpenter.jpg';

class professionalProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            customer: null,
            user: null,
            refreshing: false,
            loaderVisible: false,
            feedback: [],
            total: 0,
            count1: 0,
            count2: 0,
            count3: 0,
            count4: 0,
            count5: 0,
            avg: 0,
            serviceCount: 0,
            reviewCount: 0,
            viewAll: false,
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
            carouselItems: []
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


    renderBrief() {
        const user = this.state.user;
        if (this.state.user != null)
            return (
                <Card key={user._id} containerStyle={styles.card}>
                    {
                        this.state.user.profile_image
                            ?
                            <Image source={{
                                uri: env.api + 'backend/' + this.state.user.profile_image
                            }} style={styles.cardImage} />
                            :
                            <View style={{
                                flex: 2,
                                maxHeight: 150,
                                minHeight: 150,
                                maxWidth: 150,
                                minWidth: 150,
                                borderRadius: 250,
                                backgroundColor: '#FAAE6B',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Ionicons name="person-outline" color="white" size={24} />
                            </View>
                    }
                    <View style={styles.cardHeadView}>
                        <View style={styles.cardHeadTextView}>
                            <Text style={styles.cardHeadName}>{user.name}</Text>
                            {/* <Text style={styles.cardHeadLoc}>{user.personal_details.city}, {user.personal_details.state}</Text> */}
                            <Text style={styles.cardHeadLoc}>{user.profession_type}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 30 }}>
                        <View style={{ flex: 1, alignItems: 'center' }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Ionicons name='star-outline' color='green' size={28} />
                                <Text style={styles.ratingText}>{this.state.avg}</Text>
                            </View>
                            <Text style={styles.proHighLightsText} >Average{'\n'}Rating</Text>
                        </View>
                        <View style={{ flex: 0.5 }}></View>
                        <View style={{ flex: 1, alignItems: 'center' }} >
                            {/* <View> */}
                            <Text style={styles.totalService}>{this.state.serviceCount}</Text>
                            {/* </View> */}
                            <Text style={styles.proHighLightsText} >Trusted{'\n'}Customers</Text>
                        </View>
                    </View>
                </Card>
            );
    }

    renderItemFunction({ item, index }) {
        return (
            <View style={{
                backgroundColor: 'black',
                borderRadius: 20,
                height: 200,
            }}>
                <Image
                    source={{
                        uri: env.api + 'backend/' + item.src,
                    }}
                    style={styles.carouselImage} />
            </View>

        )
    }

    renderDetails() {
        if (this.state.user != null) {
            let date = new Date(this.state.user.personal_details.date_of_birth);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            let count1Per = (this.state.count1 / this.state.serviceCount * 100);
            let count2Per = (this.state.count2 / this.state.serviceCount * 100);
            let count3Per = (this.state.count3 / this.state.serviceCount * 100);
            let count4Per = (this.state.count4 / this.state.serviceCount * 100);
            let count5Per = (this.state.count5 / this.state.serviceCount * 100);

            // console.log(count1Per);
            // console.log(count2Per);
            // console.log(count3Per);
            // console.log(count4Per);
            // console.log(count5Per);

            let reviewsArray = [];

            if (this.state.viewAll) {
                reviewsArray = this.state.feedback;
            } else {
                if (this.state.feedback.length > 2) {
                    reviewsArray.push(this.state.feedback[this.state.feedback.length - 1]);
                    reviewsArray.push(this.state.feedback[this.state.feedback.length - 2]);
                } else {
                    reviewsArray = this.state.feedback;
                }
            }

            // console.log(reviewsArray);

            let review = null
            let count = 0;
            if (reviewsArray.length > 0) {
                review = reviewsArray.map(r => {
                    count++;

                    const date = new Date(r.updatedAt);

                    return (
                        <Animatable.View key={r._id}
                            animation='fadeInUp'
                            duration={700}
                        >
                            <View style={styles.proHead}>
                                {
                                    r.customer_image != null
                                        ?
                                        <Image source={{
                                            uri: env.api + 'backend/' + r.customer_image
                                        }} style={styles.proImg} />
                                        :
                                        <View style={{
                                            flex: 2,
                                            maxHeight: 50,
                                            minHeight: 50,
                                            minWidth: 50,
                                            maxWidth: 50,
                                            borderRadius: 50,
                                            backgroundColor: '#FAAE6B',
                                            marginRight: 5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Ionicons name="person-outline" color="white" size={24} />
                                        </View>
                                }
                                <View style={styles.proDetails}>
                                    <View style={styles.proHeadText}>
                                        <View style={styles.feedView}>
                                            <Text style={styles.proName}>{r.customer_name}</Text>
                                            <Text style={styles.feedbackDate}>{this.state.month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()}</Text>
                                            {/* <Text style={styles.feedbackDate}>{ this.state.month[date.getMonth()]}</Text> */}
                                        </View>
                                        <Rating
                                            startingValue={r.professional_ratings}
                                            readonly={true}
                                            imageSize={18}
                                        />
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.feedback}>{r.professional_feedback}</Text>
                            <Divider style={count != reviewsArray.length ? { marginVertical: 20 } : { height: 0 }} />
                            <Text style={count == reviewsArray.length && (reviewsArray.length < this.state.feedback.length || this.state.viewAll) ? styles.viewAll : { height: 0 }}
                                onPress={() => {
                                    this.setState({
                                        viewAll: !this.state.viewAll
                                    });
                                }}
                            >
                                {this.state.viewAll ? 'Less Reviews' : 'More Reviews'}
                            </Text>
                        </Animatable.View>
                    );
                })
            }

            return (
                <Card containerStyle={styles.card}>
                    <Text style={styles.catHead}>Personal Details</Text>
                    <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Name</Text>
                        <Text style={styles.itemValue}>{this.state.user.name}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Contact</Text>
                        <Text style={styles.itemValue}>{this.state.user.phone}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Gender</Text>
                        <Text style={styles.itemValue}>{this.state.user.personal_details.gender}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.itemName}>Date of Birth</Text>
                        <Text style={styles.itemValue}>{day + ' / ' + month + ' / ' + year}</Text>
                    </View>

                    {
                        this.state.user.about
                            ?
                            <View>
                                <Divider style={{ marginVertical: 20 }} />

                                <Text style={styles.catHead}>About</Text>
                                <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />

                                <Text style={styles.about} >{this.state.user.about}</Text>
                            </View>
                            :
                            null
                    }

                    {
                        this.state.carouselItems.length > 0
                            ?
                            <View>
                                <Divider style={{ marginVertical: 20 }} />

                                <Text style={styles.catHead}>Awards & Certifications</Text>
                                <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                                <View style={styles.carousel}>
                                    <Carousel
                                        layout={"default"}
                                        ref={ref => this.carousel = ref}
                                        data={this.state.carouselItems}
                                        sliderWidth={250}
                                        itemWidth={250}
                                        // autoplay={true}
                                        // autoplayInterval={3000}
                                        // loop={true}
                                        // loopClonesPerSide={6}
                                        renderItem={this.renderItemFunction}
                                        onSnapToItem={index => this.setState({ activeIndex: index })}
                                    />
                                </View>
                            </View>
                            :
                            null
                    }

                    <Divider style={{ marginVertical: 20 }} />

                    <Text style={styles.catHead}>Reviews</Text>
                    <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center', marginBottom: 20 }} />
                    {
                        reviewsArray.length > 0
                            ?
                            <View style={{ paddingHorizontal: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                                    <Text style={styles.reviewsRatings}>
                                        {this.state.avg}
                                    </Text>
                                    <View style={{ alignItems: 'flex-start' }} >
                                        <Rating
                                            startingValue={this.state.avg}
                                            readonly={true}
                                            imageSize={24}
                                        />
                                        <Text style={styles.reviewsRatingsText} >{this.state.reviewCount} Ratings, {this.state.reviewCount} Reviews</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                                    <Text style={styles.ratingPartitionText}>Excellent({this.state.count5})</Text>
                                    <View style={{ flex: 3, }}>
                                        <Divider style={{ height: 5, backgroundColor: 'green', maxWidth: count5Per + '%' }} />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                                    <Text style={styles.ratingPartitionText}>Good({this.state.count4})</Text>
                                    <View style={{ flex: 3, }}>
                                        <Divider style={{ height: 5, backgroundColor: '#98CD5B', maxWidth: count4Per + '%' }} />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                                    <Text style={styles.ratingPartitionText}>Okay({this.state.count3})</Text>
                                    <View style={{ flex: 3, }}>
                                        <Divider style={{ height: 5, backgroundColor: '#C3CD04', maxWidth: count3Per + '%' }} />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                                    <Text style={styles.ratingPartitionText}>Bad({this.state.count2})</Text>
                                    <View style={{ flex: 3, }}>
                                        <Divider style={{ height: 5, backgroundColor: '#DFA70C', maxWidth: count2Per + '%' }} />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                                    <Text style={styles.ratingPartitionText}>Terrible({this.state.count1})</Text>
                                    <View style={{ flex: 3, }}>
                                        <Divider style={{ height: 5, backgroundColor: 'red', maxWidth: count1Per + '%' }} />
                                    </View>
                                </View>
                                <View style={{ marginTop: 50 }} >
                                    {review}
                                </View>
                            </View>
                            :
                            <Text
                                style={{
                                    fontFamily: 'Poppins-Medium',
                                    textAlign: 'center',
                                    fontSize: 16,
                                    paddingHorizontal: 30
                                }}
                            >
                                Professional doesn't have any reviews.
                                    </Text>
                    }
                </Card>
            );
        }
    }

    async getToken() {
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

    fetchProfessional() {

        // this.showLoader();
        fetch(env.api + "customer/requestservice/" + this.state.customer.customerId + "/" + this.props.route.params.id + "/" + this.props.route.params.proId, {
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
                } else {
                    // console.log(data.Feedbacks);
                    const feedbacks = data.Feedbacks;
                    let total = 0;
                    let count1 = 0;
                    let count2 = 0;
                    let count3 = 0;
                    let count4 = 0;
                    let count5 = 0;
                    let avg = 0;
                    let serviceCount = 0;
                    await feedbacks.forEach(feedback => {
                        total += feedback.professional_ratings;
                        serviceCount += 1;
                        if (feedback.professional_ratings == 1) {
                            count1++;
                        } else if (feedback.professional_ratings == 2) {
                            count2++;
                        } else if (feedback.professional_ratings == 3) {
                            count3++;
                        } else if (feedback.professional_ratings == 4) {
                            count4++;
                        } else if (feedback.professional_ratings == 5) {
                            count5++;
                        }
                    });
                    avg = serviceCount != 0 ? total / serviceCount : 0;

                    let attachments = [];
                    await data.Professional.attachments.forEach(attach => {
                        if (attach != '') {
                            let obj = {
                                src: attach
                            };
                            attachments.push(obj);
                        }
                    });
                    // console.log(attachments);
                    await this.setState({
                        user: data.Professional,
                        feedback: data.Feedbacks,
                        total: total,
                        count1: count1,
                        count2: count2,
                        count3: count3,
                        count4: count4,
                        count5: count5,
                        avg: avg,
                        serviceCount: data.ServiceCount,
                        reviewCount: serviceCount,
                        carouselItems: attachments
                    });
                    await this.hideLoader();
                    await this.hideRefresh();
                }
            });
    }

    async componentDidMount() {

        await this.getToken();
        await this.getCustomer();

        await this.showLoader();

        await this.fetchProfessional();
        // this.willFocusSubscription = await this.props.navigation.addListener(
        //     'focus',
        //     () => {
        //         this.fetchCustomer();
        //     }
        // );
    }

    async handleRefresh() {
        this.showRefresh();
        await this.getToken();
        await this.getCustomer();
        await this.fetchProfessional();
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
                        {this.renderBrief()}
                        <View style={{ paddingBottom: 30 }}>
                            {this.renderDetails()}
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

export default professionalProfile;

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
    },
    card: {
        backgroundColor: '#FCFCFC',
        borderRadius: 50,
        marginBottom: 10,
        paddingBottom: 20,
        // alignItems: 'center'
    },
    cardHeadView: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    cardImage: {
        maxHeight: 150,
        minHeight: 150,
        maxWidth: 150,
        minWidth: 150,
        borderRadius: 250,
        backgroundColor: '#FAAE6B',
        alignSelf: 'center',
        marginTop: 20
    },
    cardHeadTextView: {
        alignItems: 'center',
        marginTop: 20,
        alignSelf: 'center'
    },
    cardHeadName: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        textAlign: 'center'
    },
    cardHeadLoc: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: 'gray',
        lineHeight: 13,
        textAlign: 'center'
    },
    about: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        paddingHorizontal: 10,
        textAlign: 'justify',
        marginTop: 10
    },
    proHighLightsText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 15
    },
    ratingText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
        textAlign: 'center',
        marginLeft: 5,
        paddingRight: 5
    },
    totalService: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
        textAlign: 'center'
    },
    catHead: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        alignSelf: 'center'
    },
    listItem: {
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    itemName: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
    },
    itemValue: {
        flex: 1,
        textAlign: 'right',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        color: '#808080',
    },
    serviceName: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
    },
    serviceValue: {
        flex: 2,
        textAlign: 'right',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#808080',
    },
    carousel: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginVertical: 10,
        marginLeft: 10
    },
    carouselImage: {
        height: '100%',
        width: '100%',
        borderRadius: 20,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    reviewsRatings: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 48,
        marginRight: 20
    },
    reviewsRatingsText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: 'gray'
    },
    ratingCard: {
        borderRadius: 15,
        paddingVertical: 10
    },
    ratingPartitionText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: 'gray',
        flex: 2,
    },
    proHead: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    proImg: {
        flex: 1,
        maxHeight: 50,
        minHeight: 50,
        minWidth: 50,
        maxWidth: 50,
        borderRadius: 50,
        backgroundColor: '#FAAE6B',
        marginRight: 5
    },
    proHeadText: {
        flex: 3,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    proDetails: {
        flex: 3,
        flexDirection: 'row',
    },
    feedView: {
        flexDirection: 'row'
    },
    proName: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    feedbackDate: {
        flex: 1,
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        textAlign: 'right',
        color: 'gray'
    },
    feedback: {
        fontFamily: 'Poppins-Regular',
        color: 'gray',
        fontSize: 15,
        marginTop: 10,
        paddingHorizontal: 15
    },
    viewAll: {
        fontFamily: 'Poppins-Regular',
        color: '#0099FF',
        fontSize: 15,
        marginTop: 20,
        alignSelf: 'center'
    }
});