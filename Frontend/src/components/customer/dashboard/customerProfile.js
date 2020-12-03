import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';

import Loader from '../../shared/Loader';
import { env } from '../../shared/supports';
class customerProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customer: null,
            name: '',
            email: '',
            phone: '',
            token: '',
            loaderVisible: false,
            imageChanged: false,
            profile: {
                file: null,
                fileUri: null
            },
            invalidName: false,
            invalidEmail: false,
        };
        this.getToken();
        this.getCustomer();
    }

    showLoader() {
        this.setState({ loaderVisible: true })
    }

    hideLoader() {
        this.setState({ loaderVisible: false })
    }

    onChangeText(key, value) {
        if (key == 'name') {
            if (value.length > 0) {
                this.setState({
                    invalidName: false
                });
            } else {
                this.setState({
                    invalidName: true
                });
            }
        }
        if (key == 'email') {
            let valid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
            if (valid) {
                this.setState({
                    invalidEmail: false
                });
            } else {
                this.setState({
                    invalidEmail: true
                });
            }
        }
        this.setState({
            [key]: value
        })
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

            console.log(customer);

            if (customer !== null) {
                await this.setState({
                    customer: customer,
                    name: customer.customerName,
                    email: customer.customerEmail,
                    phone: customer.customerPhone,
                });

                if (customer.customerProfile) {
                    let obj = this.state.profile;

                    obj.fileUri = env.api + 'backend/' + customer.customerProfile;

                    this.setState({
                        profile: obj
                    })
                }
            } else {

            }

        } catch (error) {
            // Error saving data
        }
    }

    async updateCustomer() {
        const customer = this.state.customer;

        customer.customerName = this.state.name;
        customer.customerEmail = this.state.email;

        await AsyncStorage.setItem('customer', JSON.stringify(customer));
    }

    async onUpdateProfile() {

        this.showLoader();

        if (this.state.name.length > 0) {

            if (this.state.email.length > 0) {

                if (!this.state.invalidEmail) {

                    if (this.state.imageChanged) {

                        const data = new FormData();

                        await data.append('profile_image', {
                            name: this.state.profile.file.fileName,
                            type: this.state.profile.file.type,
                            uri:
                                Platform.OS === 'android' ? this.state.profile.fileUri : this.state.profile.fileUri.replace('file://', ''),
                        });

                        await console.log(JSON.stringify(data));

                        await fetch(env.api + "customer/uploadProfileImage/" + this.state.customer.customerId, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "multipart/form-data",
                                "Authorization": 'Bearer ' + this.state.token
                            },
                            body: data
                        })
                            .then(res => res.json())
                            .then(async data => {
                                if (data.error) {
                                    alert(data.error);
                                } else {
                                    console.log(data.message);
                                    let customer = this.state.customer;
                                    customer.customerProfile = data.profile_image;

                                    await AsyncStorage.setItem('customer', JSON.stringify(customer));
                                    // this.props.navigation.navigate('categories');
                                }
                            })
                            .catch(function (error) {
                                console.log('There has been a problem with your fetch operation: ' + error.message);
                                // ADD THIS THROW error
                                alert("update profile unsuccessful");
                                throw error;
                            });
                    }

                    await fetch(env.api + "customer/update/" + this.state.customer.customerId, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": 'Bearer ' + this.state.token
                        },
                        body:
                            JSON.stringify(
                                {
                                    name: this.state.name,
                                    email: this.state.email
                                }
                            )
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.error) {
                                this.hideLoader();
                                alert(data.error);
                            } else {
                                this.updateCustomer();
                                this.getCustomer();
                                this.hideLoader();
                                this.props.navigation.navigate('Home');
                                console.log(data.message);
                            }
                        })
                        .catch(function (error) {
                            console.log('There has been a problem with your fetch operation: ' + error.message);
                            // ADD THIS THROW error
                            alert("update profile unsuccessful");
                            throw error;
                        });
                } else {
                    setTimeout(async () => {
                        this.hideLoader();
                        await Alert.alert('Invalid Email', 'Please enter valid email address', [
                            { text: 'Okay' }
                        ]);
                        await this.setState({
                            invalidEmail: true
                        })
                    }, 1000);
                }
            } else {
                setTimeout(async () => {
                    this.hideLoader();
                    await Alert.alert('Invalid Email', 'Email should not be null', [
                        { text: 'Okay' }
                    ]);
                    await this.setState({
                        invalidEmail: true
                    })
                }, 1000);
            }
        } else {
            setTimeout(async () => {
                this.hideLoader();
                await Alert.alert('Invalid Name', 'Name should not be null', [
                    { text: 'Okay' }
                ]);
                await this.setState({
                    invalidName: true
                })
            }, 1000);
        }
    }

    launchImageLibrary = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                // console.log('response', JSON.stringify(response));
                const obj = {
                    file: response,
                    fileUri: response.uri
                }
                this.setState({
                    profile: obj,
                    imageChanged: true
                });
            }
        });

    }

    componentDidMount() {
        this.getToken();
        this.getCustomer();
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Personal Profile</Text>
                {this.state.profile.fileUri == null
                    ?
                    <TouchableOpacity style={styles.addImage} onPress={() => this.launchImageLibrary()}>
                        <Text style={{ fontFamily: 'Poppins-Medium', color: 'white' }}>+</Text>
                        <Text style={{ fontFamily: 'Poppins-Medium', color: 'white' }}>Add Image</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.imageTouch} onPress={() => this.launchImageLibrary()}>
                        <Image
                            source={{
                                uri: this.state.profile.fileUri,
                            }}
                            style={styles.image} />
                    </TouchableOpacity>
                }
                <View style={styles.display}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.title}>Full Name</Text>
                        <Input
                            value={this.state.name}
                            placeholder="full name"
                            inputContainerStyle={this.state.invalidName ? styles.invalidInputStyle : styles.inputStyle}
                            onChangeText={(val) => this.onChangeText('name', val)}
                        />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.title}>Email</Text>
                        <Input
                            value={this.state.email}
                            placeholder="email"
                            inputContainerStyle={this.state.invalidEmail ? styles.invalidInputStyle : styles.inputStyle}
                            onChangeText={(val) => this.onChangeText('email', val)}
                        />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.title}>Phone Number</Text>
                        <Input
                            value={this.state.phone}
                            placeholder="Mobile"
                            inputContainerStyle={styles.phone}
                            editable={false}
                        // onChangeText={(val) => this.onChangeText('detail1', val)}
                        />
                    </View>
                    <View style={styles.selectDateTimeButton}>
                        <TouchableOpacity style={styles.selectDateTimeButtonOpacity} onPress={() => {
                            this.onUpdateProfile()
                        }}>
                            <Text style={styles.selectDateTimeButtonText}>Update Profile</Text>
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

export default customerProfile;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    display: {
        backgroundColor: 'white',
        marginTop: 100,
        paddingTop: 100,
        paddingHorizontal: 25,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
    },
    header: {
        fontFamily: 'Poppins-SemiBold',
        color: 'white',
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 25
    },
    imageTouch: {
        height: 140,
        width: 140,
        position: 'absolute',
        borderRadius: 70,
        alignSelf: 'center',
        marginTop: 90,
        zIndex: 99,
        backgroundColor: '#FFBE85',
    },
    image: {
        height: 140,
        width: 140,
        borderRadius: 70,
        alignSelf: 'center',
    },
    addImage: {
        height: 140,
        width: 140,
        position: 'absolute',
        borderRadius: 70,
        alignSelf: 'center',
        marginTop: 90,
        zIndex: 99,
        backgroundColor: '#FFBE85',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        marginLeft: 10
    },
    inputStyle: {
        borderColor: '#FFBE85'
    },
    invalidInputStyle: {
        borderColor: 'red'
    },
    phone: {
        borderColor: '#FFBE85',
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        paddingLeft: 5
    },
    selectDateTimeButtonOpacity: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f1f1f',
        height: 50,
        width: 350,
        borderRadius: 25,
        marginBottom: 20,
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
});