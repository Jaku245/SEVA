import React, { Component } from 'react';
import { RefreshControl, View, Text, Image, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Divider, SearchBar, Card, withBadge } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import Ionicons from 'react-native-vector-icons/Ionicons';

import carpenter from '../../../../resources/carpenter.jpg';
import barber from '../../../../resources/barber.jpg';
import plumber from '../../../../resources/plumber.jpg';
import Loader from '../../shared/Loader';
import AsyncStorage from '@react-native-community/async-storage';

import { env } from '../../shared/supports';
class customerDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            refreshing: false,
            matchedCategories: [],
            activeIndex: 0,
            profile: null,
            carouselItems: [
                {
                    src: carpenter,
                },
                {
                    src: barber,
                },
                {
                    src: plumber,
                }
            ],
            customer: null,
            categories: null,
            loaderVisible: false,
            cId: null,
            token: null,
            cartToAdd: null,
            cart: null
        };
        this.getToken();
        this.getServices();
        this.getCustomer();
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

    async getCustomer() {
        try {
            let customerWithOutParse = await AsyncStorage.getItem('customer');
            let customer = JSON.parse(customerWithOutParse);

            if (customer !== null) {
                this.setState({
                    customer: customer,
                    profile: customer.customerProfile
                });
            } else {

            }
            this.hideRefresh();
        } catch (error) {
            // Error saving data
            this.hideRefresh();
        }
    }

    getServices = async () => {
        try {
            let services = await AsyncStorage.getItem('services');
            const parsed = await JSON.parse(services);

            if (parsed != null) {
                this.setState({
                    cart: parsed
                });
            } else {
                this.setState({
                    cart: null
                });
            }
            this.hideRefresh();
        } catch (error) {
            // Error saving data
            this.hideRefresh();
        }
    };

    async saveAsyncData(customer) {
        await AsyncStorage.setItem('customer', JSON.stringify(customer));
    }

    async setProfession(profession) {
        try {
            let selectedProfession = await AsyncStorage.getItem('profession');
            if (selectedProfession != null) {
                if (selectedProfession != profession) {
                    await AsyncStorage.removeItem('services');
                    await AsyncStorage.setItem('profession', profession);
                    this.setState({
                        cart: null
                    });
                }
            } else {
                await AsyncStorage.setItem('profession', profession);
            }
        } catch {

        }
    }

    updateSearch = async (search) => {
        await this.setState({ search });
        if (search != '') {
            var matchedCategories = [];
            let availableCategories = this.state.categories;
            await availableCategories.forEach(async cat => {
                if (cat.name.toLowerCase().includes(search.toLowerCase())) {
                    await matchedCategories.push(cat);
                }
            });
            // await console.log(search);
            // await console.log(matchedCategories);
            await this.setState({
                matchedCategories: matchedCategories
            });
        } else {
            await this.setState({
                matchedCategories: this.state.categories
            });
        }
    };

    showLoader() {
        this.setState({ loaderVisible: true })
    }
    hideLoader() {
        this.setState({ loaderVisible: false })
    }

    renderItemFunction({ item, index }) {
        return (
            <View style={{
                backgroundColor: 'black',
                borderRadius: 20,
                height: 200,
                marginLeft: 25,
                marginRight: 20
            }}>
                <Image source={item.src} style={styles.carouselImage} />
            </View>

        )
    }

    async fetchDetails() {


        await this.getToken();
        await this.getServices();

        await fetch(env.api + "customer/dashboard", {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    this.hideRefresh();
                } else {
                    // console.log(data.customer.customerProfile);
                    // console.log(data.category);

                    this.saveAsyncData(data.customer);

                    this.setState({
                        customer: data.customer,
                        categories: data.category,
                        matchedCategories: data.category,
                        cId: data.customer.customerId,
                        profile: data.customer.customerProfile
                    })
                    this.hideLoader();
                    this.hideRefresh();
                }
            });
        // this.hideLoader();
    }

    renderBadge = () => {

        const BadgedIcon = withBadge('!')(Ionicons);

        if (this.state.cart !== null) {
            if (this.state.cart.length > 0) {
                if (this.state.cart[0].quantity > 0) {
                    return (
                        <BadgedIcon size={36} color="#FFBE85" name="cart" onPress={() => this.props.navigation.navigate('serviceCart')} />
                    );
                } else {
                    return (
                        <Ionicons name="cart" size={36} color="#FFBE85" onPress={() => this.props.navigation.navigate('serviceCart')} />
                    );
                }
            } else {
                return (
                    <Ionicons name="cart" size={36} color="#FFBE85" onPress={() => this.props.navigation.navigate('serviceCart')} />
                );
            }
        } else {
            return (
                <Ionicons name="cart" size={36} color="#FFBE85" onPress={() => this.props.navigation.navigate('serviceCart')} />
            );
        }

        this.hideRefresh();
    }

    async componentDidMount() {

        this.showLoader();
        await this.fetchDetails();
        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            async () => {
                await this.getServices();
                await this.renderBadge();
                await this.getCustomer();
            }
        );
    }

    async handleRefresh() {
        this.showRefresh();
        await this.fetchDetails();
        await this.getServices();
        await this.renderBadge();
        await this.getCustomer();
    }

    render() {

        const { search } = this.state;
        const { navigate } = this.props.navigation;
        // const BadgedIcon = withBadge('!')(Ionicons);

        const badge = this.renderBadge();

        const renderCards = ({ item, index }) => {
            return (
                <TouchableOpacity onPress={async () => {
                    await this.setProfession(item.profession_type);
                    await navigate('selectSubCategory', { catName: item.name, catAbout: item.about, catId: item._id });
                }}>
                    <Card containerStyle={styles.categoryCard} >
                        <Ionicons name="construct-outline" size={24} color="#FFBE85" style={styles.cardIcon} />
                        <Text style={{ fontSize: 12, textAlign: 'center', color: 'gray' }}>{item.name}</Text>
                    </Card>
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.container}>
                <View style={styles.heading}>
                    {this.state.profile == null
                        ?
                        <TouchableOpacity style={styles.addImage} onPress={() => navigate('Profile')}>
                            <Text style={{ fontFamily: 'Poppins-Medium', color: 'white', fontSize: 12 }}>+</Text>
                            <Text style={{ fontFamily: 'Poppins-Medium', color: 'white', textAlign: 'center', fontSize: 12 }}>Add{'\n'}Image</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.imageTouch} onPress={() => navigate('Profile')}>
                            <Image
                                source={{
                                    uri: env.api + 'backend/' + this.state.profile,
                                }}
                                style={styles.image} />
                        </TouchableOpacity>
                    }
                    <Text style={styles.headingText} >{this.state.customer ? this.state.customer.customerName : ''}</Text>
                    <View style={styles.headingIcon}>
                        <View>
                            {badge}
                        </View>
                    </View>
                </View>
                <View style={styles.greetings}>
                    <Text style={styles.greetingsHeader} >Good Morning</Text>
                    <Text style={styles.greetingsText} >We wish you have a good day.</Text>
                </View>
                <View style={styles.search}>
                    <SearchBar
                        placeholder="Search for a service ..."
                        onChangeText={this.updateSearch}
                        value={search}
                        containerStyle={styles.searchBackground}
                    />
                </View>
                <ScrollView
                    nestedScrollEnabled={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.handleRefresh()} />
                    }
                >
                    <View style={styles.carousel}>
                        <Carousel
                            layout={"default"}
                            ref={ref => this.carousel = ref}
                            data={this.state.carouselItems}
                            sliderWidth={325}
                            itemWidth={325}
                            // autoplay={true}
                            // autoplayInterval={3000}
                            // loop={true}
                            // loopClonesPerSide={3}
                            renderItem={this.renderItemFunction}
                            onSnapToItem={index => this.setState({ activeIndex: index })}
                        />
                    </View>
                    <View style={styles.categoryView}>
                        <Text style={styles.categoryHeader}>Services and Packages</Text>
                        <Divider style={styles.divider} />
                    </View>
                    <View style={styles.category}>
                        {
                            this.state.customer
                                ?
                                !this.state.customer.isFlagged
                                    ?
                                    this.state.matchedCategories.length > 0
                                        ?
                                        <FlatList
                                            data={this.state.matchedCategories}
                                            numColumns={3}
                                            renderItem={renderCards}
                                            keyExtractor={item => item._id}
                                        // nestedScrollEnabled={true}
                                        />
                                        :
                                        <Text
                                            style={{
                                                fontFamily: 'Poppins-Medium',
                                                textAlign: 'center',
                                                marginTop: 10,
                                                fontSize: 14,
                                                paddingHorizontal: 30
                                            }}
                                        >
                                            Sorry, we don't have services which you are looking for right now!
                                        </Text>
                                    :
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins-Medium',
                                            textAlign: 'center',
                                            marginTop: 10,
                                            fontSize: 14,
                                            paddingHorizontal: 30
                                        }}
                                    >
                                        Unfortunately, you are blocked by company. To resolve the issue please visit help page.
                                        </Text>
                                :
                                null
                        }
                    </View>
                </ScrollView>
                <Loader
                    loaderVisible={this.state.loaderVisible}
                    animationType="fade"
                />
            </View>
        )
    }
}

export default customerDashboard;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    heading: {
        flexDirection: 'row',
        marginTop: 50,
        marginLeft: 20,
        alignItems: 'center'
    },
    addImage: {
        flex: 2,
        backgroundColor: '#FFBE85',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        minHeight: 80,
        minWidth: 80,
        maxWidth: 80,
        maxHeight: 80
    },
    image: {
        borderRadius: 50,
        minHeight: 80,
        minWidth: 80,
        maxWidth: 80,
        maxHeight: 80
    },
    imageTouch: {
        flex: 2,
        backgroundColor: '#FFBE85',
        borderRadius: 50,
        minHeight: 80,
        minWidth: 80,
        maxWidth: 80,
        maxHeight: 80
    },
    headingText: {
        flex: 7,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 30,
        marginLeft: 10
    },
    headingIcon: {
        flex: 1,
        marginRight: 30
    },
    greetings: {
        marginLeft: 20,
        marginTop: 10
    },
    greetingsHeader: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 35,
        backgroundColor: 'transparent'
    },
    greetingsText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        lineHeight: 23
    },
    search: {
        marginTop: 15,
        marginHorizontal: 20,
        marginBottom: 10
    },
    searchBackground: {
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderRadius: 20
    },
    carousel: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30
    },
    carouselImage: {
        height: '100%',
        width: '100%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    categoryView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    categoryHeader: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 25,
    },
    divider: {
        width: '50%',
        backgroundColor: '#FFBE85',
        height: 2
    },
    category: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 10
    },
    categoryRow: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 20
    },
    categoryCard: {
        minHeight: 112,
        minWidth: 112,
        maxWidth: 112,
        marginHorizontal: 5,
        marginVertical: 10,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardIcon: {
        alignSelf: 'center',
        marginBottom: 5
    }
});