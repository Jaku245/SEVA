import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';

import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';

class identity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            front: {
                file: null,
                fileUri: '',
            },
            back: {
                file: null,
                fileUri: '',
            },
            pan: {
                file: null,
                fileUri: '',
            },
            proof: {
                file: null,
                fileUri: '',
            },
            token: null,
            professional: null,
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

        // console.log(professional);

        if (professional.identity_proof) {
            const data = professional.identity_proof;
            console.log(data);

            let front = this.state.front;
            let back = this.state.back;
            let pan = this.state.pan;
            let proof = this.state.proof;

            front.fileUri = env.api + 'backend/' + data.aadhar_front;
            back.fileUri = env.api + 'backend/' + data.aadhar_back;
            pan.fileUri = env.api + 'backend/' + data.pancard_image;
            proof.fileUri = env.api + 'backend/' + data.address_proof;

            await this.setState({
                front: front,
                back: back,
                pan: pan,
                proof: proof
            });

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
                if (type === 'front') {
                    this.setState({
                        front: obj
                    });
                } else if (type === 'back') {
                    this.setState({
                        back: obj
                    });
                } else if (type === 'pan') {
                    this.setState({
                        pan: obj
                    });
                } else if (type === 'proof') {
                    this.setState({
                        proof: obj
                    });
                }
            }
        });

    }

    async onUpload() {

        await this.showLoader();

        const data = new FormData();

        await data.append('aadharfront', {
            name: this.state.front.file.fileName,
            type: this.state.front.file.type,
            uri:
                Platform.OS === 'android' ? this.state.front.fileUri : this.state.front.fileUri.replace('file://', ''),
        });

        await data.append('aadharback', {
            name: this.state.back.file.fileName,
            type: this.state.back.file.type,
            uri:
                Platform.OS === 'android' ? this.state.back.fileUri : this.state.back.fileUri.replace('file://', ''),
        });

        await data.append('pancard', {
            name: this.state.pan.file.fileName,
            type: this.state.pan.file.type,
            uri:
                Platform.OS === 'android' ? this.state.pan.fileUri : this.state.pan.fileUri.replace('file://', ''),
        });

        await data.append('addressProof', {
            name: this.state.proof.file.fileName,
            type: this.state.proof.file.type,
            uri:
                Platform.OS === 'android' ? this.state.proof.fileUri : this.state.proof.fileUri.replace('file://', ''),
        });

        // await console.log(data);

        await fetch(env.api + "professional/submit/identityVerification/" + this.state.professional._id, {
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
                            <Text style={styles.headerText}>We would like to have following details from you.</Text>
                        </View>
                        <Text style={styles.aadhar}>Aadhar Card</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {this.state.front.fileUri !== ''
                                ?
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <Image
                                        source={{
                                            uri: this.state.front.fileUri,
                                        }}
                                        style={styles.displayImage} />
                                    <Ionicons name="trash-outline" size={30} color="red" style={{ marginTop: 5 }} onPress={() => {
                                        const obj = {
                                            filepath: null,
                                            fileUri: '',
                                        };
                                        this.setState({
                                            front: obj
                                        });
                                    }}
                                    />
                                </View>
                                :
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.imageUpload} onPress={() => this.launchImageLibrary('front')}>
                                        <Ionicons name="add-outline" size={50} color="#FEC28E" />
                                        <Text style={styles.imageText}>Front Image</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {this.state.back.fileUri !== ''
                                ?
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <Image
                                        source={{
                                            uri: this.state.back.fileUri,
                                        }}
                                        style={styles.displayImage} />
                                    <Ionicons name="trash-outline" size={30} color="red" style={{ marginTop: 5 }} onPress={() => {
                                        const obj = {
                                            filepath: null,
                                            fileUri: '',
                                        };
                                        this.setState({
                                            back: obj
                                        });
                                    }}
                                    />
                                </View>
                                :
                                <View style={{ flex: 1, width: 135, alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.imageUpload} onPress={() => this.launchImageLibrary('back')}>
                                        <Ionicons name="add-outline" size={50} color="#FEC28E" />
                                        <Text style={styles.imageText}>Back Image</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.pan}>Pan Card</Text>
                                {this.state.pan.fileUri !== ''
                                    ?
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ width: 135, alignItems: 'center' }}>
                                            <Image
                                                source={{
                                                    uri: this.state.pan.fileUri,
                                                }}
                                                style={styles.displayImage} />
                                            <Ionicons name="trash-outline" size={30} color="red" style={{ marginTop: 5 }} onPress={() => {
                                                const obj = {
                                                    filepath: null,
                                                    fileUri: '',
                                                };
                                                this.setState({
                                                    pan: obj
                                                });
                                            }}
                                            />
                                        </View>
                                    </View>
                                    :
                                    <View style={{ alignItems: 'center' }}>
                                        <TouchableOpacity style={styles.imageUpload} onPress={() => this.launchImageLibrary('pan')}>
                                            <Ionicons name="add-outline" size={50} color="#FEC28E" />
                                            <Text style={styles.imageText}>Pan Card</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.pan}>Address Proof</Text>
                                {this.state.proof.fileUri !== ''
                                    ?
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ width: 135, alignItems: 'center' }}>
                                            <Image
                                                source={{
                                                    uri: this.state.proof.fileUri,
                                                }}
                                                style={styles.displayImage} />
                                            <Ionicons name="trash-outline" size={30} color="red" style={{ marginTop: 5 }} onPress={() => {
                                                const obj = {
                                                    filepath: null,
                                                    fileUri: '',
                                                };
                                                this.setState({
                                                    proof: obj
                                                });
                                            }}
                                            />
                                        </View>
                                    </View>
                                    :
                                    <View style={{ alignItems: 'center' }}>
                                        <TouchableOpacity style={styles.imageUpload} onPress={() => this.launchImageLibrary('proof')}>
                                            <Ionicons name="add-outline" size={50} color="#FEC28E" />
                                            <Text style={styles.imageText}>Address Proof</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        </View>
                    </ScrollView>
                    <View style={styles.selectDateTimeButton}>
                        <TouchableOpacity style={styles.selectDateTimeButtonOpacity} onPress={() => {
                            this.onUpload()
                        }}>
                            <Text style={styles.selectDateTimeButtonText}>Upload Documents</Text>
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

export default identity;

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
        paddingHorizontal: 50
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
        textAlign: 'left',
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