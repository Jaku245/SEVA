import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import { Card, Divider, Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';

import Loader from '../../shared/Loader';
import { env } from '../../shared/supports';

class addCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            profession: '',
            description: '',
            profile: {
                file: null,
                fileUri: null
            },
            token: null,
            loaderVisible: false
        }
    }

    showLoader() {
        this.setState({ loaderVisible: true })
    }

    hideLoader() {
        this.setState({ loaderVisible: false })
    }

    async getToken() {
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

    onChangeText(key, value) {
        this.setState({
            [key]: value
        })
    }

    logOut() {
        AsyncStorage.removeItem('token');
        // AsyncStorage.removeItem('professional');
        this.props.navigation.navigate('login');
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

    async addCategory() {

        await this.showLoader();

        const data = new FormData();

        await data.append('name', this.state.name);

        await data.append('profession_type', this.state.profession);

        await data.append('about', this.state.description);

        await data.append('display_image', {
            name: this.state.profile.file.fileName,
            type: this.state.profile.file.type,
            uri:
                Platform.OS === 'android' ? this.state.profile.fileUri : this.state.profile.fileUri.replace('file://', ''),
        });

        await console.log(JSON.stringify(data));

        await this.getToken();

        await fetch(env.api + "admin/category/create", {
            method: "POST",
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
                    // this.hideLoader();
                    this.props.navigation.navigate('categories');
                }
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                alert("update profile unsuccessful");
                throw error;
            });
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="arrow-back-outline" color="white" size={28}
                        onPress={() => this.props.navigation.navigate('categories')}
                    />
                    <Text style={styles.headerText}>Add category</Text>
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
                            <Text style={styles.title}>Name</Text>
                            <Input
                                value={this.state.name}
                                placeholder="category name"
                                inputContainerStyle={styles.inputStyle}
                                onChangeText={(val) => this.onChangeText('name', val)}
                            />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.title}>Profession</Text>
                            <Input
                                value={this.state.profession}
                                placeholder="category profession"
                                inputContainerStyle={styles.inputStyle}
                                onChangeText={(val) => this.onChangeText('profession', val)}
                            />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.title}>Description</Text>
                            <Input
                                value={this.state.description}
                                placeholder="category description"
                                inputContainerStyle={styles.inputStyle}
                                onChangeText={(val) => this.onChangeText('description', val)}
                            />
                        </View>
                    </ScrollView>
                    <Loader
                        loaderVisible={this.state.loaderVisible}
                        animationType="fade"
                    />
                </View>
                <View style={styles.selectDateTimeButton}>
                    <TouchableOpacity style={styles.selectDateTimeButtonOpacity} onPress={() => {
                        this.addCategory()
                    }}>
                        <Text style={styles.selectDateTimeButtonText}>Add category</Text>
                        <Ionicons style={styles.selectDateTimeButtonIcon} name="arrow-forward-outline" color="white" size={24} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


export default addCategory;

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
        marginTop: 90,
        paddingTop: 100,
        paddingHorizontal: 20,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
    },
    imageTouch: {
        height: 140,
        width: 140,
        position: 'absolute',
        borderRadius: 70,
        alignSelf: 'center',
        marginTop: 90,
        zIndex: 99
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
    subHead: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        marginLeft: 10,
        flex: 1
    },
    subAdd: {
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        marginRight: 30,
        color: '#0099FF',
        textAlign: 'right'
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