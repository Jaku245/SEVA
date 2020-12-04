import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, CheckBox } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import io from "socket.io-client";

// let socket = io("http://192.168.43.222:3000");


import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';

class selectAddress extends Component {


    constructor(props) {
        super(props);
        this.state = {
            AddressBook: [],
            loaderVisible: false,
            refreshing: false,
            token: null,
            addrSelected: false
        };
        this.getToken();
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

    changeCurrentAddress(id) {
        const add = this.state.AddressBook;
        add.forEach(address => {
            if (address._id === id) {
                address.default = true;
            } else {
                address.default = false;
            }
        });

        this.setState({
            AddressBook: add,
            addrSelected: true
        });
    }

    deleteAddress(id) {

        this.showLoader();

        fetch(env.api + "customer/viewaddress/" + id, {
            method: "DELETE",
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
                    // socket.emit("refreshAddress");
                    // this.hideLoader();
                    this.fetchAddresses();
                    alert(data.message);
                }
            });
    }

    async fetchAddresses() {

        await this.getToken();

        await fetch(env.api + "customer/viewaddressbook", {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.hideLoader();
                    this.hideRefresh();
                    alert(data.error);
                } else {
                    this.setState({
                        AddressBook: data.AddressBook,
                        addrSelected: false
                    })
                    // console.log(data.AddressBook);
                    this.hideLoader();
                    this.hideRefresh();
                }
            });
    }

    async addAddressToCart() {
        const add = this.state.AddressBook;
        let serviceAddress = null;
        await add.forEach(addItem => {
            if (addItem.default == true) {
                serviceAddress = addItem;
            }
        });

        console.log(serviceAddress);

        await AsyncStorage.setItem('address', JSON.stringify(serviceAddress))

        this.props.navigation.navigate('selectDateTime', { total: this.props.route.params.total });
    }

    async componentDidMount() {
        this.showLoader();
        // await this.getToken();
        // if (this.state.token != null) {
        await this.fetchAddresses();
        // }

        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            () => {
                this.fetchAddresses();
            }
        );
    }

    async handleRefresh() {
        this.showRefresh();
        await this.fetchAddresses();
    }

    render() {

        // socket.on("refreshAddressPage", async () => {
        //     // await this.getToken();
        //     await this.fetchAddresses();
        // });

        const cart = this.props.route.params.cart;

        const { navigate } = this.props.navigation;

        // const address = [];
        // if (this.state.address != null) {
        const address = this.state.AddressBook.map((add) => {
            return (
                <Card key={add._id} containerStyle={styles.card}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.check}>
                            <CheckBox
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={add.default}
                                onPress={() => this.changeCurrentAddress(add._id)}
                            />
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.addType}>{add.address_type},</Text>
                            <Text style={styles.addDetails}>{add.person_name}</Text>
                            {/* {add.abbr} */}
                            <Text style={styles.addDetails}>{add.address_detail1},</Text>
                            <Text style={styles.addDetails}>{add.address_detail2},</Text>
                            <Text style={{ color: 'gray', fontFamily: 'Poppins-SemiBold', fontSize: 16, lineHeight: 25, marginBottom: 10 }}>{add.city}, {add.state}.</Text>
                        </View>
                        <TouchableOpacity style={styles.update}>
                            <Ionicons name="create-outline" color="gray" size={24} onPress={() => navigate('updateAddress', { address: add })} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.update}>
                            <Ionicons name="trash-outline" color="red" size={24} onPress={() => this.deleteAddress(add._id)} />
                        </TouchableOpacity>
                    </View>
                </Card>
            );
        })
        // }

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
                        <TouchableOpacity style={styles.addButton} onPress={() => navigate('addAddress')} >
                            <Text style={styles.addButtonText}>+ Add a new address</Text>
                        </TouchableOpacity>
                        <View style={{ paddingBottom: 20 }}>
                            {address}
                        </View>
                    </ScrollView>
                    <View style={styles.selectDateTimeButton}>
                        <TouchableOpacity style={this.state.addrSelected ? styles.selectDateTimeButtonOpacity : { height: 0 }} onPress={() => {
                            this.addAddressToCart();
                        }}>
                            <Text style={styles.selectDateTimeButtonText}>Continue with this address</Text>
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

export default selectAddress;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    display: {
        backgroundColor: 'white',
        marginTop: 15,
        paddingTop: 30,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
        justifyContent: 'center',
    },
    addButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#1C1C1C',
        height: 55,
        width: 258,
        borderRadius: 28,
        marginBottom: 10,
    },
    addButtonText: {
        color: 'white',
        alignSelf: 'center',
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
    },
    selectDateTimeButtonOpacity: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f1f1f',
        height: 50,
        width: 350,
        borderRadius: 25,
        marginBottom: 40,
        flexDirection: 'row',
        paddingLeft: 30,
        marginTop: 10
    },
    selectAddressButton: {
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
    card: {
        minHeight: '10%',
        width: '90%',
        borderRadius: 11,
    },
    check: {
        flex: 1
    },
    details: {
        flex: 4
    },
    update: {
        flex: 1,
        textAlign: 'right',
        alignItems: 'flex-end',
    },
    addType: {
        color: 'gray',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 17,
        marginBottom: 20,
        marginTop: 10
    },
    addDetails: {
        color: 'gray',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        lineHeight: 25
    }
})