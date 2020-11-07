import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Loader from '../../shared/Loader';
import { env } from '../../shared/supports';

class categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            token: null,
            admin: null,
            loaderVisible: false
        }
    }

    showLoader() {
        this.setState({ loaderVisible: true })
    }

    hideLoader() {
        this.setState({ loaderVisible: false })
    }

    async getAdmin() {
        try {
            let adminWithOutParse = await AsyncStorage.getItem('admin');
            let admin = JSON.parse(adminWithOutParse);
            // console.log(token);

            if (admin != null) {
                this.setState({
                    admin: admin
                });
            } else {

            }

        } catch (error) {
            // Error saving data
        }
    }

    async getToken() {
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
    }

    async fetchCategories() {
        await fetch(env.api + "admin/category", {
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
                    // console.log(data.category);
                    this.setState({
                        categories: data.category
                    });
                }
            });
        await this.hideLoader();
    }

    async componentDidMount() {
        await this.getToken();
        await this.getAdmin();
        await this.fetchCategories();
        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            () => {
                this.getToken();
                this.fetchCategories();
            }
        );
    }

    logOut() {
        this.showLoader();
        fetch(env.api + "admin/logout/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.hideLoader();
                    alert(data.error);
                } else {
                    console.log(data.message);
                    AsyncStorage.removeItem('token');
                    this.hideLoader();
                    this.props.navigation.navigate('login');
                }
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                throw error;
            });
    }

    render() {

        const { navigate } = this.props.navigation;

        const renderCards = ({ item, index }) => {
            return (
                <TouchableOpacity onPress={async () => {
                    // await this.setProfession(item.profession_type);
                    await navigate('updateCategory', { cat: item });
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
                <View style={styles.header}>
                    <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="home-outline" color="white" size={28}
                        onPress={() => this.props.navigation.navigate('dashboard')}
                    />
                    <Text style={styles.headerText}>Manage Services</Text>
                    <View style={{ flex: 2, flexDirection: 'row' }}>
                        <Text style={{
                            flex: 2,
                            fontFamily: 'Poppins-Regular',
                            fontSize: 14,
                            color: 'white',
                            alignSelf: 'center'
                        }}
                            onPress={() => this.logOut()}
                        >Logout</Text>
                        <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="log-out-outline" color="white" size={28}
                            onPress={() => this.logOut()}
                        />
                    </View>
                </View>
                <View style={styles.display}>
                    <Text style={styles.catHead}>Categories</Text>
                    <Divider style={{ width: '50%', height: 2, backgroundColor: '#FEC28E', alignSelf: 'center' }} />
                    <View style={styles.category}>
                        <FlatList
                            data={this.state.categories}
                            numColumns={3}
                            renderItem={renderCards}
                            keyExtractor={item => item._id}
                        // nestedScrollEnabled={true}
                        />
                    </View>
                    <TouchableOpacity style={styles.addTouch}
                        onPress={() => {
                            navigate('addCategory');
                        }}
                    >
                        <Ionicons name="add-outline" size={35} color="white" style={styles.addIcon} />
                    </TouchableOpacity>
                    <Loader
                        loaderVisible={this.state.loaderVisible}
                        animationType="fade"
                    />
                </View>
            </View>
        );
    }
}


export default categories;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    header: {
        flexDirection: 'row',
        marginVertical: 20,
        marginHorizontal: 20,
    },
    headerText: {
        flex: 5,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: 'white',
    },
    display: {
        backgroundColor: 'white',
        paddingTop: 30,
        paddingHorizontal: 20,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
    },
    catHead: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        alignSelf: 'center'
    },
    category: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 10
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
    },
    addTouch: {
        backgroundColor: '#1c1c1c',
        minHeight: 60,
        maxHeight: 60,
        minWidth: 60,
        maxWidth: 60,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        marginBottom: '25%',
        marginRight: '7%',
        right: 0
    },
});