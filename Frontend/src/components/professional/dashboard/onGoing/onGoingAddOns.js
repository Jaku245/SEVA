import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

import carpenter from '../../../../../resources/carpenter.jpg';
import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';

class onGoingAddOns extends Component {

    constructor(props) {
        super(props);
        this.state = {
            subCategory: [],
            cart: [],
            professional: null,
            token: null,
            loaderVisible: false
        };
        this.getServices();
    }

    showLoader() {
        this.setState({ loaderVisible: true })
    }

    hideLoader() {
        this.setState({ loaderVisible: false })
    }

    getToken = async () => {

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
    };

    async getProfessional() {
        try {
            let professionalWithOutParse = await AsyncStorage.getItem('professional');
            let professional = JSON.parse(professionalWithOutParse);

            if (professional !== null) {
                this.setState({
                    professional: professional,
                });
                // console.log(professional);
            } else {

            }

        } catch (error) {
            // Error saving data
        }
    }

    async setServices() {
        const cart = await this.state.cart;
        await AsyncStorage.setItem('addOnServices', JSON.stringify(cart));
    }

    getServices = async () => {
        try {
            let services = await AsyncStorage.getItem('addOnServices');
            const parsed = await JSON.parse(services);
            // console.log(parsed);

            if (parsed != null) {
                // await console.log('Services exist : '+ parsed[0].quantity );
                this.setState({
                    cart: parsed
                });
            } else {

            }

        } catch (error) {
            // Error saving data
        }

        await this.hideLoader();
    };

    addQuantity(quantity, sId, sName, sPrice) {

        const cart = this.state.cart;
        var added = false;
        if (cart.length != 0) {
            cart.forEach(service => {
                if (service.service_id == sId) {
                    service.quantity = quantity + 1;
                    added = true;
                }
            });
        } else if (cart.length == 0) {
            cart.push({ service_id: sId, service_name: sName, quantity: 1, price: sPrice });
            added = true;
        }

        if (!added) {
            cart.push({ service_id: sId, service_name: sName, quantity: 1, price: sPrice });
        }
        this.setState({
            cart: cart
        });
        this.setServices();
    }

    removeQuantity(quantity, sId) {

        const cart = this.state.cart;
        if (cart.length != 0) {
            cart.forEach(service => {
                if (service.service_id == sId) {
                    service.quantity = quantity - 1;
                }
            });
        }
        const updatedCart = cart.filter((service) => service.quantity != 0);
        this.setState({
            cart: updatedCart
        });
        this.setServices();
    }

    renderButton(sId, sName, sPrice) {

        const cart = this.state.cart;

        let quantity = 0;

        cart.forEach(service => {
            if (service.service_id === sId) {
                quantity = service.quantity;
            }
        });

        if (quantity == 0) {
            return (
                <TouchableOpacity key={sId} style={styles.simpleButton} onPress={() => {
                    this.addQuantity(quantity, sId, sName, sPrice);
                }}>
                    <Text style={styles.buttonText}>+ Add</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <View style={styles.updatedButton}>
                    <TouchableOpacity style={styles.minusButton} onPress={() => {
                        this.removeQuantity(quantity, sId, sName, sPrice);
                    }}>
                        <Text style={{ fontSize: 20, color: 'white' }}>-</Text>
                    </TouchableOpacity>
                    <View style={styles.quantity}>
                        <Text>{quantity}</Text>
                    </View>
                    <TouchableOpacity style={styles.plusButton} onPress={() => {
                        this.addQuantity(quantity, sId);
                    }}>
                        <Text style={{ fontSize: 20, color: 'white' }}>+</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }


    renderServices = ({ item, index }) => {
        return (
            <View>
                <Divider style={{ width: '80%', alignSelf: 'center' }} />
                <View style={styles.list}>
                    <View style={styles.serviceDetails}>
                        <Image source={carpenter} style={styles.listImage} />
                        <View style={styles.listText}>
                            <TouchableOpacity>
                                <Text style={styles.serviceName}>{item.name} </Text>
                            </TouchableOpacity>
                            <Text style={styles.price}>Rs {item.price} /-</Text>
                        </View>
                    </View>
                    <View style={styles.button}>
                        {this.renderButton(item._id, item.name, item.price)}
                    </View>
                </View>
            </View>
        );
    }

    renderRelatedServices = () => {

        let relatedServicesDetails = null;
        relatedServicesDetails = this.state.subCategory.map((category) => {
            return (
                <View key={category._id}>
                    {this.renderServiceCategory(category.name, category.services)}
                </View>
            );
        });
        
        return (
            <View>
                {relatedServicesDetails}
            </View>
        );
    }

    renderServiceCategory = (catName, services) => {
        
        return (
            <View>
                <Text style={styles.serviceHeader}>{catName}</Text>
                <FlatList
                    data={services}
                    renderItem={this.renderServices}
                    keyExtractor={item => item.id}
                    />
            </View>
        );
        
    }

    fetchServices(){
        fetch(env.api + "/professional/serviceRequest/sendaddons/"+this.state.professional._id, {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    // console.log(data.subCategory)
                    this.setState({
                        subCategory: data.subCategory
                    });
                }
            });
    }

    async componentDidMount() {
        await this.getToken();
        await this.getProfessional();
        await this.fetchServices();
        await this.getServices()
        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            () => {
                this.getToken();
                this.getServices();
            }
        );
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.display}>
                    <ScrollView>
                        <View style={styles.categoryView}>
                            <Text style={styles.categoryHeader}>Select services</Text>
                            <Divider style={styles.divider} />
                        </View>
                        <View style={{ marginBottom: 70 }}>
                            {this.renderRelatedServices()}
                            {/* {this.hideLoader()} */}
                        </View>
                    </ScrollView>
                    <View style={styles.selectDateTimeButton}>
                        <TouchableOpacity style={styles.selectDateTimeButtonOpacity} onPress={() => {
                            this.props.navigation.navigate('onGoingServiceDetails');
                        }}>
                            <Text style={styles.selectDateTimeButtonText}>Add Services </Text>
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

export default onGoingAddOns;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    display: {
        backgroundColor: 'white',
        marginTop: 15,
        paddingTop: 20,
        // paddingHorizontal: 15,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
        // alignItems: 'center'
    },

    categoryView: {
        alignItems: 'center',
        justifyContent: 'center'
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
        marginHorizontal: 5,
        marginVertical: 10,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardIcon: {
        alignSelf: 'center',
        marginBottom: 5
    },
    serviceDetails: {
        flex: 3,
        flexDirection: 'row'
    },
    list: {
        marginHorizontal: 10,
        marginVertical: 10,
        flexDirection: 'row'
    },
    listImage: {
        flex: 1,
        maxHeight: 50,
        maxWidth: 50,
        margin: 10
    },
    listText: {
        flex: 3,
        margin: 10
    },
    serviceName: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14
    },
    price: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: 'gray',
        lineHeight: 18
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    simpleButton: {
        backgroundColor: "#1f1f1f",
        fontSize: 16,
        borderRadius: 30,
        marginVertical: 10,
        paddingLeft: 25,
        paddingRight: 25,
        height: 35,
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white'
    },
    serviceHeader: {
        fontFamily: 'Poppins-Medium',
        fontSize: 20,
        marginLeft: 20,
        marginTop: 20
    },
    updatedButton: {
        flexDirection: 'row',
        width: 90
    },
    minusButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        backgroundColor: '#000',
        color: '#fff',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        height: 35
    },
    plusButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        backgroundColor: '#000',
        color: '#fff',
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        height: 35
    },
    quantity: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        borderColor: '#000',
        borderWidth: 1,
        height: 35
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