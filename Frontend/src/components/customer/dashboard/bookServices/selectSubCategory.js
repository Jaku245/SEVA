import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Divider, SearchBar, Card } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import Ionicons from 'react-native-vector-icons/Ionicons';

import carpenter from '../../../../../resources/carpenter.jpg';
import barber from '../../../../../resources/barber.jpg';
import plumber from '../../../../../resources/plumber.jpg';
import Loader from '../../../shared/Loader';
import AsyncStorage from '@react-native-community/async-storage';

import { env } from '../../../shared/supports';
class selectSubCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.route.params.catName,
            id: this.props.route.params.catId,
            about: this.props.route.params.catAbout,
            search: '',
            activeIndex: 0,
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
            subCategory: null,
            matchedSubCategory: [],
            loaderVisible: false,
            token: null,
            customer: null,
        };
        this.getToken();
        // this.getCustomer();
        this.getProfession();
    }

    getToken = async () => {
        try {
            let token = await AsyncStorage.getItem('token');

            if (token != null) {
                this.setState({
                    token: token
                });
            }

        } catch (error) {
            // Error saving data
        }
    };

    updateSearch = async (search) => {
        this.setState({ search });
        if (search != '') {
            var matchedSubCategory = [];
            let availableSubCategories = this.state.subCategory;
            await availableSubCategories.forEach(async subCat => {
                if (subCat.name.toLowerCase().includes(search.toLowerCase())) {
                    await matchedSubCategory.push(subCat);
                }
            });
            // await console.log(search);
            // await console.log(matchedSubCategory);
            await this.setState({
                matchedSubCategory: matchedSubCategory
            });
        } else {
            await this.setState({
                matchedSubCategory: this.state.subCategory
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

    async getCustomer() {
        try {
            let customerWithOutParse = await AsyncStorage.getItem('customer');
            let customer = JSON.parse(customerWithOutParse);

            if (customer !== null) {
                this.setState({
                    customer: customer
                });
            } else {

            }

        } catch (error) {
            // Error saving data
        }
    }

    getProfession = async () => {
        try {
            let profession = await AsyncStorage.getItem('profession');

            // console.log(profession);

            // if (cart != null) {
            //     this.setState({
            //         cart: cart
            //     });
            // }
        } catch (error) {
            // Error saving data
        }
    };

    async componentDidMount() {

        this.showLoader();

        await this.getToken();
        // await this.getCustomer();
        await this.getProfession();

        await fetch(env.api + "customer/dashboard/" + this.state.id, {
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
                        subCategory: data.subCategory,
                        matchedSubCategory: data.subCategory
                    })
                    // console.log(data.subCategory);
                    this.hideLoader();
                }
            });
    }

    render() {

        const { search } = this.state;
        const { navigate } = this.props.navigation;

        const renderCards = ({ item, index }) => {
            return (
                <TouchableOpacity onPress={() => { navigate('selectServices', { catName: this.state.name, SubCatId: item._id, subCategory: this.state.subCategory }); }}>
                    <Card containerStyle={styles.categoryCard} >
                        <Ionicons name="construct-outline" size={24} color="#FFBE85" style={styles.cardIcon} />
                        <Text style={{ fontSize: 12, textAlign: 'center', color: 'gray' }}>{item.name}</Text>
                    </Card>
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.container}>
                <View style={styles.search}>
                    <SearchBar
                        placeholder="Search for a service or a professional ... "
                        onChangeText={this.updateSearch}
                        value={search}
                        containerStyle={styles.searchBackground}
                    />
                </View>
                <ScrollView nestedScrollEnabled={true}>
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
                            renderItem={this.renderItemFunction}
                            onSnapToItem={index => this.setState({ activeIndex: index })}
                        />
                    </View>
                    <View style={styles.categoryView}>
                        <Text style={styles.categoryInfo}> "{this.state.about}"</Text>
                    </View>
                    <View style={styles.categoryView}>
                        <Text style={styles.categoryHeader}>Select A service</Text>
                        <Divider style={styles.divider} />
                    </View>
                    <View style={styles.category}>
                        {
                            this.state.matchedSubCategory.length > 0
                                ?
                                <FlatList
                                    data={this.state.matchedSubCategory}
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
                                    fontSize: 16,
                                    paddingHorizontal: 30
                                }}
                                >
                                    Sorry, we don't have services which you are looking for right now!
                                </Text>
                        }
                    </View>
                </ScrollView>
                <Loader
                    loaderVisible={this.state.loaderVisible}
                    animationType="fade"
                />
            </View>
        );
    }
}

export default selectSubCategory;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
    categoryInfo: {
        fontFamily: 'Poppins-SemiBoldItalic',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
        marginHorizontal: 20,
        marginBottom: 10,
        color: 'gray'
    },
    carousel: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
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
        width: '35%',
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