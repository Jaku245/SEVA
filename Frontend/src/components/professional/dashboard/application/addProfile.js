import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';

import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';

class addProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: {
                file: null,
                fileUri: '',
            },
            token: null,
            professional: null,
            loaderVisible: false
        };
    }

    showLoader() {
        this.setState({ loaderVisible: true })
    }
    hideLoader() {
        this.setState({ loaderVisible: false })
    }

    async getToken() {

        await this.showLoader();

        let token = await AsyncStorage.getItem('token');

        if (token !== null) {
            this.setState({
                token: token
            });
        }
        // console.log(this.state.token);

    }

    async getProfessional() {
        let professionalWithOutParse = await AsyncStorage.getItem('professional');
        let professional = JSON.parse(professionalWithOutParse);

        if (professional !== null) {
            this.setState({
                professional: professional
            });
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
                    profile: obj
                });
            }
        });

    }

    async onSave() {

        await this.showLoader();

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
                    console.log(data.error);
                    await this.hideLoader();
                    alert(data.error);
                } else {
                    console.log(data.message);
                    let pro = this.state.professional;
                    pro.profile_image = data.profile_image;

                    await AsyncStorage.setItem('professional', JSON.stringify(pro));
                    await this.getProfessional();
                    await this.hideLoader();
                    await this.props.navigation.navigate('ProProfile');
                }
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                alert("update profile unsuccessful");
                throw error;
            });
    }

    async updateProfile() {
        let professionalWithOutParse = await AsyncStorage.getItem('professional');
        let professional = JSON.parse(professionalWithOutParse);

        if (professional.profile_image !== '') {
            const profile = {
                file: this.state.profile.file,
                fileUri: env.api + 'backend/' + professional.profile_image
            }
            await this.setState({
                profile: profile
            });
        } else {
            const profile = {
                file: this.state.profile.file,
                fileUri: ''
            }
            await this.setState({
                profile: profile
            });
        }

        await this.hideLoader();
    }

    async componentDidMount() {
        this.getToken();
        this.getProfessional();
        this.updateProfile();

        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            async () => {
                await this.getToken();
                await this.getProfessional();
                await this.updateProfile();
            }
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.display}>
                    <View style={{ flex: 1 }}>
                        {this.state.profile.fileUri !== ''
                            ?
                            <View>
                                <Image source={{
                                    uri: this.state.profile.fileUri,
                                }}
                                    style={styles.displayProfile} />
                                <TouchableOpacity style={styles.displayEdit} onPress={() => this.launchImageLibrary('front')}>
                                    <Ionicons name="create-outline" size={30} color="white" />
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={styles.profile}>
                                <Ionicons name="person-outline" size={300} color="white" />
                                <TouchableOpacity style={styles.edit} onPress={() => this.launchImageLibrary('front')}>
                                    <Ionicons name="create-outline" size={30} color="white" />
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.header}>Guidelines for a good profile picture</Text>
                        <Divider style={{ width: '85%', alignSelf: 'center', height: 2, backgroundColor: '#FFCB9E', marginTop: 5, marginBottom: 15 }} />
                        <View style={styles.guidelinesView}>
                            <Ionicons style={styles.guidelinesIcon} name="checkmark-done-circle-outline" size={25} color="green" />
                            <Text style={styles.guidelinesText}>No shades / sunglasses</Text>
                        </View>
                        <View style={styles.guidelinesView}>
                            <Ionicons style={styles.guidelinesIcon} name="checkmark-done-circle-outline" size={25} color="green" />
                            <Text style={styles.guidelinesText}>No group photos</Text>
                        </View>
                        <View style={styles.guidelinesView}>
                            <Ionicons style={styles.guidelinesIcon} name="checkmark-done-circle-outline" size={25} color="green" />
                            <Text style={styles.guidelinesText}>Face the camera</Text>
                        </View>
                        <View style={styles.guidelinesView}>
                            <Ionicons style={styles.guidelinesIcon} name="checkmark-done-circle-outline" size={25} color="green" />
                            <Text style={styles.guidelinesText}>Neither too dark nor too bright</Text>
                        </View>
                        <View style={styles.selectDateTimeButton}>
                            <TouchableOpacity style={styles.selectDateTimeButtonOpacity} onPress={() => {
                                this.onSave();
                            }}>
                                <Text style={styles.selectDateTimeButtonText}>Update Profile</Text>
                                <Ionicons style={styles.selectDateTimeButtonIcon} name="arrow-forward-outline" color="white" size={24} />
                            </TouchableOpacity>
                        </View>
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

export default addProfile;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    display: {
        backgroundColor: 'white',
        marginTop: 10,
        paddingTop: 50,
        paddingHorizontal: 25,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
    },
    displayProfile: {
        // backgroundColor: '#FFCB9E',
        // alignItems: 'center',
        // justifyContent: 'center',
        borderRadius: 150,
        minHeight: '95%',
        maxHeight: '95%',
        minWidth: '88%',
        maxWidth: '88%',
        alignSelf: 'center'
    },
    displayEdit: {
        position: 'absolute',
        backgroundColor: '#1F1F1F',
        height: 70,
        width: 70,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        top: 0,
        right: 0,
        marginTop: 10,
        marginRight: 30,
    },
    profile: {
        backgroundColor: '#FFCB9E',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 150,
        minHeight: '92%',
        maxHeight: '92%',
        minWidth: '88%',
        maxWidth: '88%',
        paddingTop: '28%',
        alignSelf: 'center'
    },
    edit: {
        position: 'absolute',
        backgroundColor: '#1F1F1F',
        height: 70,
        width: 70,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        top: 0,
        right: 0,
        marginTop: 10,
        marginRight: 10,
    },
    header: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        alignSelf: 'center'
    },
    guidelinesView: {
        flexDirection: 'row',
        marginHorizontal: '5%',
        marginBottom: '1%'
    },
    guidelinesIcon: {
        flex: 1
    },
    guidelinesText: {
        flex: 7,
        fontFamily: 'Poppins-Medium',
        fontSize: 18
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
        marginTop: 30
    },
    selectAddressButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
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
    }
});