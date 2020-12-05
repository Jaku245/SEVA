import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Textarea from 'react-native-textarea';
import ImagePicker from 'react-native-image-picker';

import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';

class updateProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            professional: null,
            name: '',
            email: '',
            phone: '',
            about: '',
            token: '',
            imageChanged: false,
            profile: {
                file: null,
                fileUri: null
            },
            loaderVisible: false,
            invalidName: false,
            invalidEmail: false,
            invalidAbout: false
        };
        this.getToken();
        this.getProfessional();
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
        if (key == 'about') {
            if (value.length > 0) {
                this.setState({
                    invalidAbout: false
                });
            } else {
                this.setState({
                    invalidAbout: true
                });
            }
        }
        this.setState({
            [key]: value
        })
    }

    getToken = async () => {

        await this.showLoader();

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

    async getProfessional() {
        try {
            let professionalWithOutParse = await AsyncStorage.getItem('professional');
            let professional = JSON.parse(professionalWithOutParse);

            // console.log(professional.profile_image);

            if (professional !== null) {
                let obj = {
                    file: null,
                    fileUri: env.api + 'backend/' + professional.profile_image
                };

                // console.log(professional);
                await this.setState({
                    professional: professional,
                    name: professional.name,
                    email: professional.email,
                    phone: professional.phone,
                    about: professional.about,
                    profile: obj
                });
            } else {

            }

        } catch (error) {
            // Error saving data
        }

        await this.hideLoader();
    }

    logOut() {

        this.showLoader();

        fetch(env.api + "professional/logout/", {
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
                    this.hideLoader();
                    console.log(data.message);
                    AsyncStorage.removeItem('token');
                    this.props.navigation.navigate('SelectRole');
                }
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                throw error;
            });
    }

    async updateProfessional() {
        const professional = this.state.professional;

        professional.name = this.state.name;
        professional.email = this.state.email;
        professional.about = this.state.about;

        await AsyncStorage.setItem('professional', JSON.stringify(professional));
    }

    async onUpdateProfile() {

        await this.showLoader();

        if (this.state.name.length > 0) {

            if (this.state.email.length > 0) {

                if (!this.state.invalidEmail) {

                    if (this.state.about.length > 0) {

                        if (this.state.imageChanged) {

                            const data = new FormData();

                            await data.append('profile_image', {
                                name: this.state.profile.file.fileName,
                                type: this.state.profile.file.type,
                                uri:
                                    Platform.OS === 'android' ? this.state.profile.fileUri : this.state.profile.fileUri.replace('file://', ''),
                            });

                            await console.log(JSON.stringify(data));

                            await fetch(env.api + "professional/uploadProfileImage/" + this.state.professional._id, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                    "Authorization": 'Bearer ' + this.state.token
                                },
                                body: data
                            })
                                .then(res => res.json())
                                .then(async data => {
                                    if (data.error) {
                                        this.hideLoader();
                                        alert(data.error);
                                    } else {
                                        console.log(data.message);
                                        let pro = this.state.professional;
                                        pro.profile_image = data.profile_image;

                                        await AsyncStorage.setItem('professional', JSON.stringify(pro));
                                        // await this.getProfessional();
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

                        await fetch(env.api + "professional/update/" + this.state.professional._id, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": 'Bearer ' + this.state.token
                            },
                            body:
                                JSON.stringify(
                                    {
                                        name: this.state.name,
                                        email: this.state.email,
                                        about: this.state.about
                                    }
                                )
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data.error) {
                                    this.hideLoader();
                                    alert(data.error);
                                } else {
                                    this.updateProfessional();
                                    this.setState({
                                        imageChanged: false
                                    });
                                    this.getProfessional();
                                    this.hideLoader();
                                    alert(data.message);
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
                            await Alert.alert('Invalid About', 'About should not be null', [
                                { text: 'Okay' }
                            ]);
                        }, 1000);
                    }
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
        this.getProfessional();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="menu-outline" color="white" size={28} onPress={() => this.props.navigation.toggleDrawer()} />
                    <Text style={styles.headerText}>History</Text>
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
                        <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="log-out-outline" color="white" size={28} onPress={() => this.logOut()} />
                    </View>
                </View>
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
                    <ScrollView>
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
                        <View style={{ marginBottom: 50 }}>
                            <Text style={styles.title}>About</Text>
                            <Textarea
                                containerStyle={this.state.invalidAbout ? styles.invalidTextareaContainer : styles.textareaContainer}
                                style={styles.textarea}
                                onChangeText={(val) => this.onChangeText('about', val)}
                                defaultValue={this.state.about}
                                placeholder={'About yourself'}
                                placeholderTextColor={'#c7c7c7'}
                            />
                        </View>
                    </ScrollView>
                    <View style={styles.selectDateTimeButton}>
                        <TouchableOpacity style={styles.selectDateTimeButtonOpacity} onPress={() => {
                            this.onUpdateProfile();
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

export default updateProfile;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    headerView: {
        flexDirection: 'row',
        marginVertical: 20,
        marginHorizontal: 20,
    },
    headerText: {
        flex: 5,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        color: 'white'
    },
    display: {
        backgroundColor: 'white',
        marginTop: 80,
        paddingVertical: 100,
        paddingHorizontal: 25,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        // height: '100%',
    },
    // display: {
    //     backgroundColor: 'white',
    //     paddingTop: 30,
    //     paddingHorizontal: 25,
    //     borderTopLeftRadius: 45,
    //     borderTopRightRadius: 45,
    //     height: '100%',
    // },
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
        marginBottom: 80,
        flexDirection: 'row',
        paddingLeft: 30,
        marginTop: 10
    },
    selectDateTimeButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
        paddingBottom: 20
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
    textareaContainer: {
        height: 170,
        padding: 5,
        width: '95%',
        // backgroundColor: '#F5FCFF',
        borderBottomWidth: 1,
        borderColor: '#FFBE85',
        paddingHorizontal: 10,
        marginBottom: 20
    },
    invalidTextareaContainer: {
        height: 120,
        padding: 5,
        width: '95%',
        // backgroundColor: '#F5FCFF',
        borderBottomWidth: 1,
        borderColor: 'red',
        marginHorizontal: 10,
        marginBottom: 20
    },
    textarea: {
        textAlignVertical: 'top',
        height: 170,
        fontSize: 18,
        color: '#333',
        fontFamily: 'Poppins-Regular',
        marginRight: 5,
    },
});