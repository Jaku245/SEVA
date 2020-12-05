import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import carpenter from '../../../../../resources/carpenter.jpg';

class selectServices extends Component {

    constructor(props) {
        super(props);
        this.state = {
            SubCatId: props.route.params.SubCatId,
            subCategory: props.route.params.subCategory,
            cart: []
        };
        this.getServices();
    }

    async setServices() {
        const cart = await this.state.cart;
        await AsyncStorage.setItem('services', JSON.stringify(cart));
    }

    getServices = async () => {
        try {
            let services = await AsyncStorage.getItem('services');
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
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('serviceDetails', { name: item.name, id: item._id, price: item.price, serviceName: this.props.route.params.catName })}>
                                <Text style={styles.serviceName}>{item.name + ' >>'} </Text>
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

    renderRelatedServices = (cats) => {
        const relatedServicesDetails = cats.map((category) => {
            return (
                <View>
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

    async componentDidMount() {
        await this.getServices();
        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            () => {
                this.getServices();
            }
        );
    }

    render() {
        const { navigate } = this.props.navigation;
        const mainCat = this.state.subCategory.filter(subCat => subCat._id === this.state.SubCatId)[0];
        const relatedServices = this.state.subCategory.filter(subCat => subCat._id !== this.state.SubCatId);

        // console.log(this.state.subCategory.length);
        // console.log(mainCat);
        // console.log(relatedServices.length);

        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.categoryView}>
                        <Text style={styles.categoryHeader}>Select services</Text>
                        <Divider style={styles.divider} />
                    </View>
                    <View>
                        {this.renderServiceCategory(mainCat.name, mainCat.services)}
                    </View>
                    <View style={styles.categoryView}>
                        <Text style={styles.categoryHeader}>Related services</Text>
                        <Divider style={styles.divider} />
                    </View>
                    <View style={{ marginBottom: 70 }}>
                        {this.renderRelatedServices(relatedServices)}
                    </View>
                </ScrollView>
                <View style={
                    this.state.cart.length != 0
                        ?
                        this.state.cart[0].quantity > 0
                            ?
                            styles.viewCartButton
                            :
                            { height: 0 }
                        :
                        { height: 0 }
                }
                >
                    <TouchableOpacity style={styles.viewCartButtonOpacity} onPress={() => navigate('serviceCart', { catName: this.props.route.params.catName })}>
                        <Text style={styles.viewCartButtonText}>View Cart</Text>
                        <Ionicons style={styles.viewCartButtonIcon} name="arrow-forward-outline" color="white" size={24} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

export default selectServices;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
    viewCartButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0
    },
    viewCartButtonOpacity: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f1f1f',
        height: 50,
        width: 350,
        borderRadius: 25,
        marginBottom: 20,
        flexDirection: 'row',
        paddingLeft: 30
    },
    viewCartButtonText: {
        flex: 4,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        color: '#fff'
    },
    viewCartButtonIcon: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'flex-end',
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
    }
});