import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { RefreshControl, Image, StyleSheet, Text, View } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

import carpenter from '../../../../../resources/carpenter.jpg';

class serviceCart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            cart: [],
            catName: ''
        };
        this.getServices();
        this.getProfession();
    }

    showRefresh() {
        this.setState({ refreshing: true })
    }
    hideRefresh() {
        this.setState({ refreshing: false })
    }

    showRefresh() {
        this.setState({ refreshing: true })
    }
    hideRefresh() {
        this.setState({ refreshing: false })
    }

    getProfession = async () => {
        try {
            let profession = await AsyncStorage.getItem('profession');

            if (profession != null) {
                console.log(profession);
                this.setState({
                    catName: profession
                });
            }
            await this.hideRefresh();
        } catch (error) {
            // Error saving data
            await this.hideRefresh();
        }
    };

    async setServices() {
        const cart = await this.state.cart;
        await AsyncStorage.setItem('services', JSON.stringify(cart));
    }

    getServices = async () => {
        try {
            let services = await AsyncStorage.getItem('services');
            const parsed = await JSON.parse(services);

            console.log(parsed);

            if (parsed != null) {
                // await console.log('Services exist : '+ parsed[0].quantity );
                this.setState({
                    cart: parsed
                });
            } else {

            }
            await this.hideRefresh();

        } catch (error) {
            // Error saving data
            await this.hideRefresh();
        }
    };

    addQuantity(quantity, sId) {
        const cart = this.state.cart;
        if (cart.length != 0) {
            cart.forEach(service => {
                if (service.service_id == sId) {
                    service.quantity = quantity + 1;
                }
            });
        }
        this.setState({
            cart: cart
        });
        this.setServices();
    }

    async removeQuantity(quantity, sId) {
        const cart = this.state.cart;
        if (cart.length != 0) {
            cart.forEach(service => {
                if (service.service_id == sId) {
                    service.quantity = quantity - 1;
                }
            });
        }
        let updatedCart = []
        updatedCart = cart.filter((service) => service.quantity !== 0);
        // console.log(updatedCart);
        await AsyncStorage.setItem('services', JSON.stringify(updatedCart));
        this.setState({
            cart: updatedCart
        });
    }

    renderButton(quantity, sId) {
        if (quantity == 0) {
            return (
                <TouchableOpacity style={styles.simpleButton} onPress={() => {
                    this.addQuantity(quantity, sId);
                }}>
                    <Text style={styles.buttonText}>+ Add</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <View style={styles.updatedButton}>
                    <TouchableOpacity style={styles.minusButton} onPress={() => {
                        this.removeQuantity(quantity, sId);
                    }}>
                        <Text style={{ color: 'white' }}>-</Text>
                    </TouchableOpacity>
                    <View style={styles.quantity}>
                        <Text>{quantity}</Text>
                    </View>
                    <TouchableOpacity style={styles.plusButton} onPress={() => {
                        this.addQuantity(quantity, sId);
                    }}>
                        <Text style={{ color: 'white' }}>+</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    async componentDidMount() {
        await this.getServices();
        await this.getProfession();
    }

    async handleRefresh() {
        this.showRefresh();
        await this.getServices();
        await this.getProfession();
    }

    render() {

        const { navigate } = this.props.navigation;
        let serviceTotal = 0;
        let total = 0;
        // console.log(this.state.cart);
        const cartServices = this.state.cart.map((service) => {
            const servicePrice = (service.price * service.quantity);
            serviceTotal += servicePrice;
            return (
                <View key={service.service_id} style={styles.cartList}>
                    <View style={styles.cartTitle}>
                        <Image source={carpenter} style={styles.cartImg} />
                        <View style={styles.cartTitleDetails}>
                            <Text style={styles.cartTitleText}>{service.service_name}</Text>
                            <Text style={styles.cartSubTitleText}>You will get all the mentioned services.</Text>
                        </View>
                    </View>
                    <View style={styles.cartPrice}>
                        <View style={styles.button}>
                            {this.renderButton(service.quantity, service.service_id)}
                        </View>
                        <Text style={styles.cartPriceText}>Rs. {servicePrice}</Text>
                    </View>
                </View>
            );
        })

        total = serviceTotal + 50;

        return (
            <View style={styles.container}>
                <Text style={styles.header}>Your Service Cart</Text>
                <Divider style={styles.divider} />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.handleRefresh()} />
                    }
                >
                    {
                        this.state.cart.length != 0
                            ?
                            this.state.cart[0].quantity > 0
                                ?
                                <Card containerStyle={styles.serviceCard}>
                                    <Text style={styles.cardHead}>{this.state.catName}</Text>
                                    {cartServices}
                                </Card>
                                :
                                <Card containerStyle={styles.serviceCard}>
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins-SemiBold',
                                            fontSize: 20,
                                            alignSelf: 'center'
                                        }}
                                    >
                                        Your cart is empty
                                    </Text>
                                </Card>
                            :
                            <Card containerStyle={styles.serviceCard}>
                                <Text
                                    style={{
                                        fontFamily: 'Poppins-SemiBold',
                                        fontSize: 20,
                                        alignSelf: 'center'
                                    }}
                                >
                                    Your cart is empty
                                    </Text>
                            </Card>
                    }
                    {
                        this.state.cart.length != 0
                            ?
                            this.state.cart[0].quantity > 0
                                ?
                                <Card containerStyle={styles.cartCard}>
                                    <View style={styles.totalList}>
                                        <Text style={styles.listTitle}>Service Total</Text>
                                        <Text style={styles.listPrice}>Rs. {serviceTotal}</Text>
                                    </View>
                                    <View style={styles.totalList}>
                                        <Text style={styles.listTitle}>Convenience Fees</Text>
                                        <Text style={styles.listPrice}>Rs. 50</Text>
                                    </View>
                                    <Divider style={{ marginVertical: 10 }} />
                                    <View style={styles.totalList}>
                                        <Text style={styles.listTitle}>Total</Text>
                                        <Text style={styles.listTotal}>Rs. {total}</Text>
                                    </View>
                                </Card>
                                :
                                null
                            :
                            null
                    }
                </ScrollView>
                {
                    this.state.cart.length != 0
                        ?
                        this.state.cart[0].quantity > 0
                            ?
                            <View style={styles.selectAddressButton}>
                                <TouchableOpacity style={styles.selectAddressButtonOpacity} onPress={() => {
                                    navigate('selectAddress', { total: total });
                                }}>
                                    <Text style={styles.selectAddressButtonText}>Select Address</Text>
                                    <Ionicons style={styles.selectAddressButtonIcon} name="arrow-forward-outline" color="white" size={24} />
                                </TouchableOpacity>
                            </View>
                            :
                            null
                        :
                        null
                }
            </View>
        );
    }
}

export default serviceCart;

const styles = new StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: '100%'
    },
    header: {
        marginTop: 30,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 25,
        alignSelf: 'center'
    },
    divider: {
        width: '35%',
        backgroundColor: '#FFBE85',
        height: 2,
        alignSelf: 'center',
        marginBottom: 20
    },
    serviceCard: {
        backgroundColor: '#f0f0f0',
        borderRadius: 30,
        padding: 25
    },
    cartCard: {
        backgroundColor: '#f0f0f0',
        borderRadius: 30,
        padding: 25,
        marginBottom: 90
    },
    cardHead: {
        alignSelf: 'center',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        marginBottom: 20
    },
    cartList: {
        flexDirection: 'row'
    },
    cartTitle: {
        flex: 2,
        marginBottom: 10,
        flexDirection: 'row'
    },
    cartImg: {
        flex: 1,
        maxHeight: 50,
        maxWidth: 50,
        margin: 5,
        marginRight: 10,
        borderRadius: 5
    },
    cartTitleDetails: {
        flex: 3,
    },
    cartPrice: {
        flex: 1
    },
    cartTitleText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
    },
    cartSubTitleText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: 'gray',
        lineHeight: 15
    },
    cartPriceText: {
        textAlign: 'right',
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'gray'
    },
    totalList: {
        flexDirection: 'row'
    },
    listTitle: {
        flex: 4,
        fontFamily: 'Poppins-Medium',
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
    selectAddressButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0
    },
    selectAddressButtonOpacity: {
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
    selectAddressButtonText: {
        flex: 4,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        color: '#fff'
    },
    selectAddressButtonIcon: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'flex-end',
    },
    button: {
        flex: 1,
        alignItems: 'flex-end',
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
    updatedButton: {
        flexDirection: 'row',
        width: 90
    },
    minusButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        backgroundColor: '#000',
        color: '#fff',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        height: 35,
        width: 30
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
        height: 35,
        width: 30
    },
    quantity: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        borderColor: '#000',
        borderWidth: 1,
        height: 35,
        width: 30
    },
    emptyCartCard: {
        backgroundColor: '#f0f0f0',
        borderRadius: 30,
        padding: 25,
        marginBottom: 90
    },
    emptyCartCardText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        alignSelf: 'center'
    }
});