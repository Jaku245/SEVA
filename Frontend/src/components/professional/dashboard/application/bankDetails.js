import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Divider, Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';

import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';

class bankDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            accNo: '',
            confirmAccNo: '',
            IFSC: '',
            cheque: {
                file: null,
                fileUri: '',
            },
            token: null,
            professional: null,
            loaderVisible: false,
            invalidName: false,
            invalidAccNo: false,
            invalidConfirmAccNo: false,
            invalidIFSC: false,
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

        if (professional.bank_details) {
            const data = professional.bank_details;
            console.log(data);

            let cheque = this.state.cheque;

            cheque.fileUri = env.api + 'backend/' + data.cancelled_cheque;

            await this.setState({
                name: data.accountholder_name,
                accNo: JSON.stringify(data.account_number),
                confirmAccNo: JSON.stringify(data.account_number),
                IFSC: data.ifsc_code,
                cheque: cheque,
            })
        }

        await this.hideLoader();
    }

    onChangeText(key, value) {
        if (key == 'name') {
            this.setState({
                invalidName: false
            });
        }
        if (key == 'accNo') {
            if (value == this.state.confirmAccNo) {
                this.setState({
                    invalidConfirmAccNo: false
                });
            } else {
                this.setState({
                    invalidConfirmAccNo: true
                });
            }
            this.setState({
                invalidAccNo: false
            });
        }
        if (key == 'confirmAccNo') {
            if (value == this.state.accNo) {
                this.setState({
                    invalidConfirmAccNo: false
                });
            } else {
                this.setState({
                    invalidConfirmAccNo: true
                });
            }
        }
        if (key == 'IFSC') {
            this.setState({
                invalidIFSC: false
            });
        }
        this.setState({
            [key]: value
        })
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
                    cheque: obj
                });
            }
        });

    }

    async onSave() {

        await this.showLoader();

        if (this.state.name != '') {

            if (this.state.accNo != '') {

                if (this.state.confirmAccNo != '') {

                    if (!this.state.invalidConfirmAccNo) {

                        if (this.state.IFSC != '') {

                            const data = new FormData();

                            await data.append('accountholder_name', this.state.name);

                            await data.append('account_number', this.state.accNo);

                            await data.append('ifsc_code', this.state.IFSC);

                            await data.append('cancelled_cheque', {
                                name: this.state.cheque.file.fileName,
                                type: this.state.cheque.file.type,
                                uri:
                                    Platform.OS === 'android' ? this.state.cheque.fileUri : this.state.cheque.fileUri.replace('file://', ''),
                            });

                            await console.log(JSON.stringify(data));

                            await fetch(env.api + "professional/submit/bankDetails/" + this.state.professional._id, {
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
                        } else {
                            await this.setState({
                                invalidIFSC: true
                            });
                            await this.hideLoader();
                            await Alert.alert('Invalid IFSC', 'IFSC should not be null', [
                                { text: 'Okay' }
                            ]);
                        }
                    } else {
                        await this.setState({
                            invalidConfirmAccNo: true
                        });
                        await this.hideLoader();
                        await Alert.alert('Invalid Account Number', 'Confirm Account Number is not same as Account Number', [
                            { text: 'Okay' }
                        ]);
                    }
                } else {
                    await this.setState({
                        invalidConfirmAccNo: true
                    });
                    await this.hideLoader();
                    await Alert.alert('Invalid Account Number', 'Confirm Account Number should not be null', [
                        { text: 'Okay' }
                    ]);
                }
            } else {
                await this.setState({
                    invalidAccNo: true
                });
                await this.hideLoader();
                await Alert.alert('Invalid Account Number', 'Account Number should not be null', [
                    { text: 'Okay' }
                ]);
            }
        } else {
            await this.setState({
                invalidName: true
            });
            await this.hideLoader();
            await Alert.alert('Invalid Name', 'Name should not be null', [
                { text: 'Okay' }
            ]);
        }
    }

    componentDidMount() {
        this.getToken();
        this.getProfessional();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.display}>
                    <ScrollView>
                        <Input
                            inputContainerStyle={
                                this.state.invalidName
                                    ?
                                    styles.invalidInputStyle
                                    :
                                    styles.inputStyle
                            }
                            placeholder="Name ( as registered in bank )"
                            value={this.state.name}
                            onChangeText={(val) => this.onChangeText('name', val)}
                        />
                        <Input
                            inputContainerStyle={
                                this.state.invalidAccNo
                                    ?
                                    styles.invalidInputStyle
                                    :
                                    styles.inputStyle
                            }
                            placeholder="Bank Account Number"
                            keyboardType='numeric'
                            value={this.state.accNo}
                            onChangeText={(val) => this.onChangeText('accNo', val)}
                        />
                        <Input
                            inputContainerStyle={
                                this.state.invalidConfirmAccNo
                                    ?
                                    styles.invalidInputStyle
                                    :
                                    styles.inputStyle
                            }
                            placeholder="Confirm Bank Account Number"
                            value={this.state.confirmAccNo}
                            keyboardType='numeric'
                            onChangeText={(val) => this.onChangeText('confirmAccNo', val)}
                        />
                        <Input
                            inputContainerStyle={
                                this.state.invalidIFSC
                                    ?
                                    styles.invalidInputStyle
                                    :
                                    styles.inputStyle
                            }
                            placeholder="IFSC Code"
                            value={this.state.IFSC}
                            onChangeText={(val) => this.onChangeText('IFSC', val)}
                        />
                        <Text style={styles.label}>Cancelled Cheque</Text>
                        <Text style={styles.smallLabel}>Please upload photo of cancelled cheque</Text>
                        {this.state.cheque.fileUri !== ''
                            ?
                            <View style={{ width: 135, alignItems: 'center', marginLeft: 15 }}>
                                <Image
                                    source={{
                                        uri: this.state.cheque.fileUri,
                                    }}
                                    style={styles.displayImage} />
                                {/* <Text style={styles.remove} onPress={() => {
                                    const obj = {
                                        filepath: null,
                                        fileUri: '',
                                    };
                                    this.setState({
                                        cheque: obj
                                    });
                                }}>Remove</Text> */}
                                <Ionicons name="trash-outline" size={30} color="red" style={{ marginTop: 5 }} onPress={() => {
                                    const obj = {
                                        filepath: null,
                                        fileUri: '',
                                    };
                                    this.setState({
                                        cheque: obj
                                    });
                                }}
                                />
                            </View>
                            :
                            <View style={{ marginLeft: 15 }}>
                                <TouchableOpacity style={styles.imageUpload} onPress={() => this.launchImageLibrary()}>
                                    <Ionicons name="add-outline" size={50} color="#FEC28E" />
                                    <Text style={styles.imageText}>Pan Card</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </ScrollView>
                    <View style={styles.selectDateTimeButton}>
                        <TouchableOpacity style={styles.selectDateTimeButtonOpacity} onPress={() => {
                            this.onSave()
                        }}>
                            <Text style={styles.selectDateTimeButtonText}>Save</Text>
                            <Ionicons style={styles.selectDateTimeButtonIcon} name="arrow-forward-outline" color="white" size={24} />
                        </TouchableOpacity>
                    </View>
                    <Loader
                        loaderVisible={this.state.loaderVisible}
                        animationType="fade"
                    />
                </View>
            </View >
        );
    }
}

export default bankDetails;

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
    inputStyle: {
        borderColor: '#FFBE85'
    },
    invalidInputStyle: {
        borderColor: 'red'
    },
    label: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        marginTop: 15,
        marginLeft: 10
    },
    smallLabel: {
        fontFamily: 'Poppins-Light',
        fontSize: 13,
        marginBottom: 15,
        marginLeft: 20
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
});