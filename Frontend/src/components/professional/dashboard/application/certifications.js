import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';

import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';

class certifications extends Component {

    constructor(props) {
        super(props);
        this.state = {
            att1: {
                file: null,
                fileUri: '',
            },
            att2: {
                file: null,
                fileUri: '',
            },
            att3: {
                file: null,
                fileUri: '',
            },
            att4: {
                file: null,
                fileUri: '',
            },
            att5: {
                file: null,
                fileUri: '',
            },
            att6: {
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
            await this.setState({
                professional: professional
            });
        }

        if (professional.attachments) {
            const data = professional.attachments;
            console.log(data);

            let att1 = this.state.att1;
            let att2 = this.state.att2;
            let att3 = this.state.att3;
            let att4 = this.state.att4;
            let att5 = this.state.att5;
            let att6 = this.state.att6;

            if (data[0] != '' && data.length > 0)
                att1.fileUri = env.api + 'backend/' + data[0];

            if (data[1] != '' && data.length > 1)
                att2.fileUri = env.api + 'backend/' + data[1];

            if (data[2] != '' && data.length > 2)
                att3.fileUri = env.api + 'backend/' + data[2];

            if (data[3] != '' && data.length > 3)
                att4.fileUri = env.api + 'backend/' + data[3];

            if (data[4] != '' && data.length > 4)
                att5.fileUri = env.api + 'backend/' + data[4];

            if (data[5] != '' && data.length > 5)
                att6.fileUri = env.api + 'backend/' + data[5];

            await this.setState({
                att1: att1,
                att2: att2,
                att3: att3,
                att4: att4,
                att5: att5,
                att6: att6
            })
        }

        await this.hideLoader();
    }

    launchImageLibrary = (type) => {
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
                if (type === 'att1') {
                    this.setState({
                        att1: obj
                    });
                } else if (type === 'att2') {
                    this.setState({
                        att2: obj
                    });
                } else if (type === 'att3') {
                    this.setState({
                        att3: obj
                    });
                } else if (type === 'att4') {
                    this.setState({
                        att4: obj
                    });
                } else if (type === 'att5') {
                    this.setState({
                        att5: obj
                    });
                } else if (type === 'att6') {
                    this.setState({
                        att6: obj
                    });
                }
            }
        });

    }

    async onUpload() {

        await this.showLoader();

        const data = new FormData();

        if (this.state.att1.file) {
            await data.append('att_1', {
                name: this.state.att1.file.fileName,
                type: this.state.att1.file.type,
                uri:
                    Platform.OS === 'android' ? this.state.att1.fileUri : this.state.att1.fileUri.replace('file://', ''),
            });
        }
        // else {
        //     await data.append('att_1', {
        //         name: '',
        //         type: '',
        //         uri: ''
        //     });
        // }

        if (this.state.att2.file) {
            await data.append('att_2', {
                name: this.state.att2.file.fileName,
                type: this.state.att2.file.type,
                uri:
                    Platform.OS === 'android' ? this.state.att2.fileUri : this.state.att2.fileUri.replace('file://', ''),
            });
        }
        // else {
        //     await data.append('att_2', {
        //         name: '',
        //         type: '',
        //         uri: ''
        //     });
        // }

        if (this.state.att3.file) {
            await data.append('att_3', {
                name: this.state.att3.file.fileName,
                type: this.state.att3.file.type,
                uri:
                    Platform.OS === 'android' ? this.state.att3.fileUri : this.state.att3.fileUri.replace('file://', ''),
            });
        }
        // else {
        //     await data.append('att_3', {
        //         name: '',
        //         type: '',
        //         uri: ''
        //     });
        // }

        if (this.state.att4.file) {
            await data.append('att_4', {
                name: this.state.att4.file.fileName,
                type: this.state.att4.file.type,
                uri:
                    Platform.OS === 'android' ? this.state.att4.fileUri : this.state.att4.fileUri.replace('file://', ''),
            });
        }
        // else {
        //     await data.append('att_4', {
        //         name: '',
        //         type: '',
        //         uri: ''
        //     });
        // }

        if (this.state.att5.file) {
            await data.append('att_5', {
                name: this.state.att5.file.fileName,
                type: this.state.att5.file.type,
                uri:
                    Platform.OS === 'android' ? this.state.att5.fileUri : this.state.att5.fileUri.replace('file://', ''),
            });
        }
        // else {
        //     await data.append('att_5', {
        //         name: '',
        //         type: '',
        //         uri: ''
        //     });
        // }

        if (this.state.att6.file) {
            await data.append('att_6', {
                name: this.state.att6.file.fileName,
                type: this.state.att6.file.type,
                uri:
                    Platform.OS === 'android' ? this.state.att6.fileUri : this.state.att6.fileUri.replace('file://', ''),
            });
        }
        // else {
        //     await data.append('att_6', {
        //         name: '',
        //         type: '',
        //         uri: ''
        //     });
        // }

        console.log(JSON.stringify(data));

        await fetch(env.api + "professional/submit/attachPhotos/" + this.state.professional._id, {
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
                    this.props.navigation.navigate('ProProfile');
                }
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                alert("update profile unsuccessful");
                throw error;
            });

    }

    componentDidMount() {
        this.getToken();
        this.getProfessional();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.display}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.headerView}>
                            <Text style={styles.headerText}>Upload photo of certificate or award from govt. recognized institute or trade body</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginVertical: 10, marginTop: 20 }}>
                            {this.state.att1.fileUri !== ''
                                ?
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <Image
                                        source={{
                                            uri: this.state.att1.fileUri,
                                        }}
                                        style={styles.displayImage} />
                                    <Ionicons name="trash-outline" size={30} color="red" style={{ marginTop: 5 }} onPress={() => {
                                        const obj = {
                                            filepath: null,
                                            fileUri: '',
                                        };
                                        this.setState({
                                            att1: obj
                                        });
                                    }}
                                    />
                                </View>
                                :
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.imageUpload} onPress={() => this.launchImageLibrary('att1')}>
                                        <Ionicons name="add-outline" size={50} color="#FEC28E" />
                                        <Text style={styles.imageText}>Attach Photo</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {this.state.att2.fileUri !== ''
                                ?
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <Image
                                        source={{
                                            uri: this.state.att2.fileUri,
                                        }}
                                        style={styles.displayImage} />
                                    <Ionicons name="trash-outline" size={30} color="red" style={{ marginTop: 5 }} onPress={() => {
                                        const obj = {
                                            filepath: null,
                                            fileUri: '',
                                        };
                                        this.setState({
                                            att2: obj
                                        });
                                    }}
                                    />
                                </View>
                                :
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.imageUpload} onPress={() => this.launchImageLibrary('att2')}>
                                        <Ionicons name="add-outline" size={50} color="#FEC28E" />
                                        <Text style={styles.imageText}>Attach Photo</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                            {this.state.att3.fileUri !== ''
                                ?
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <Image
                                        source={{
                                            uri: this.state.att3.fileUri,
                                        }}
                                        style={styles.displayImage} />
                                    <Ionicons name="trash-outline" size={30} color="red" style={{ marginTop: 5 }} onPress={() => {
                                        const obj = {
                                            filepath: null,
                                            fileUri: '',
                                        };
                                        this.setState({
                                            att3: obj
                                        });
                                    }}
                                    />
                                </View>
                                :
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.imageUpload} onPress={() => this.launchImageLibrary('att3')}>
                                        <Ionicons name="add-outline" size={50} color="#FEC28E" />
                                        <Text style={styles.imageText}>Attach Photo</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {this.state.att4.fileUri !== ''
                                ?
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <Image
                                        source={{
                                            uri: this.state.att4.fileUri,
                                        }}
                                        style={styles.displayImage} />
                                    <Ionicons name="trash-outline" size={30} color="red" style={{ marginTop: 5 }} onPress={() => {
                                        const obj = {
                                            filepath: null,
                                            fileUri: '',
                                        };
                                        this.setState({
                                            att4: obj
                                        });
                                    }}
                                    />
                                </View>
                                :
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.imageUpload} onPress={() => this.launchImageLibrary('att4')}>
                                        <Ionicons name="add-outline" size={50} color="#FEC28E" />
                                        <Text style={styles.imageText}>Attach Photo</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                            {this.state.att5.fileUri !== ''
                                ?
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <Image
                                        source={{
                                            uri: this.state.att5.fileUri,
                                        }}
                                        style={styles.displayImage} />
                                    <Ionicons name="trash-outline" size={30} color="red" style={{ marginTop: 5 }} onPress={() => {
                                        const obj = {
                                            filepath: null,
                                            fileUri: '',
                                        };
                                        this.setState({
                                            att5: obj
                                        });
                                    }}
                                    />
                                </View>
                                :
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.imageUpload} onPress={() => this.launchImageLibrary('att5')}>
                                        <Ionicons name="add-outline" size={50} color="#FEC28E" />
                                        <Text style={styles.imageText}>Attach Photo</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {this.state.att6.fileUri !== ''
                                ?
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <Image
                                        source={{
                                            uri: this.state.att6.fileUri,
                                        }}
                                        style={styles.displayImage} />
                                    <Ionicons name="trash-outline" size={30} color="red" style={{ marginTop: 5 }} onPress={() => {
                                        const obj = {
                                            filepath: null,
                                            fileUri: '',
                                        };
                                        this.setState({
                                            att6: obj
                                        });
                                    }}
                                    />
                                </View>
                                :
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.imageUpload} onPress={() => this.launchImageLibrary('att6')}>
                                        <Ionicons name="add-outline" size={50} color="#FEC28E" />
                                        <Text style={styles.imageText}>Attach Photo</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    </ScrollView>
                    <View style={styles.selectDateTimeButton}>
                        <TouchableOpacity style={styles.selectDateTimeButtonOpacity} onPress={() => {
                            this.onUpload()
                        }}>
                            <Text style={styles.selectDateTimeButtonText}>Attach Photos</Text>
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

export default certifications;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    display: {
        backgroundColor: 'white',
        marginTop: 10,
        paddingTop: 30,
        paddingHorizontal: 25,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
    },
    headerView: {
        backgroundColor: '#B5E0FC',
        height: 70,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30
    },
    headerText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        textAlign: 'center',
        color: '#356ABB'
    },
    aadhar: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 10
    },
    pan: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        marginTop: 40,
        marginLeft: 20,
        marginBottom: 10
    },
    proof: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        marginTop: 40,
        marginLeft: 20,
        marginBottom: 10
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
    imageUpload: {
        backgroundColor: '#FFFAF5',
        height: 135,
        maxWidth: 135,
        minWidth: 135,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#FEC28E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        color: '#FEC28E',
        lineHeight: 18
    },
    displayImage: {
        height: 135,
        width: 135,
        borderRadius: 30,
        backgroundColor: '#FEC28E'
    },
    remove: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        alignSelf: 'center',
        color: '#FF3838',
        marginTop: 5
    }
});