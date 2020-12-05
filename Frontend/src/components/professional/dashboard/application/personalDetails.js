import React, { Component } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Divider, Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';

import Loader from '../../../shared/Loader';
import { env } from '../../../shared/supports';
import states from '../../../shared/statesCities';

class personalDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            abbr: [
                {
                    name: 'Mr.',
                    value: false
                },
                {
                    name: 'Ms.',
                    value: false
                }
            ],
            gender: null,
            abbrType: '',
            name: '',
            aadharCard: '',
            date: '',
            dob: '',
            co: '',
            detail1: '',
            detail2: '',
            pinCode: '',
            token: null,
            professional: null,
            show: false,
            invalidGender: false,
            invalidName: false,
            invalidAadhar: false,
            invalidCO: false,
            invalidAddr1: false,
            invalidAddr2: false,
            invalidPincode: false,
            loaderVisible: false,
            selectedState: 'Select State',
            selectedCity: 'Select City',
            stateVisible: false,
            cityVisible: false,
            states: states,
            cities: [],
            invalidNo: false,
            invalidLocality: false,
            invalidState: false,
            invalidCity: false,
            invalidName: false,
            invalidType: false,
        }
    }

    toggleStateModal() {
        this.setState({
            stateVisible: !this.state.stateVisible
        })
    }

    toggleCityModal() {
        this.setState({
            cityVisible: !this.state.cityVisible
        })
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
        console.log(this.state.token);

    }

    async getProfessional() {
        let professionalWithOutParse = await AsyncStorage.getItem('professional');
        let professional = JSON.parse(professionalWithOutParse);

        if (professional !== null) {
            this.setState({
                professional: professional
            });
        }

        if (professional.personal_details) {
            const data = professional.personal_details;
            if (data.gender == "Male") {
                this.changeAbbr("Mr.");
            } else if (data.gender == "Female") {
                this.changeAbbr("Mss.");
            }
            const currentDate = new Date(data.date_of_birth);
            const date = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
            await this.setState({
                name: data.name,
                aadharCard: data.aadhar_number,
                co: data.care_of,
                detail1: data.address_details1,
                detail2: data.address_details2,
                pinCode: JSON.stringify(data.pincode),
                selectedCity: data.city,
                selectedState: data.state,
                dob: date
            });
            await this.setCities(data.state);
            await console.log(professional.personal_details);
        } else {
            await this.initialDate();
        }

        await this.hideLoader();
    }

    async setCities(inputState) {

        const states = this.state.states;

        await states.forEach(async state => {
            if (state.state == inputState) {
                await this.setState({
                    cities: state.districts
                });
            }
        });

    }

    onChange = (event, selectedDate) => {
        if (selectedDate < new Date()) {
            const currentDate = selectedDate || this.state.date;
            const date = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
            this.setState({
                show: Platform.OS === 'ios',
                date: currentDate,
                dob: date
            });
        } else {
            Alert.alert('Invalid Date', 'Please select valid birth date', [
                { text: 'Okay' }
            ]);
        }
    };

    showMode = () => {
        this.setState({
            show: true
        });
    };

    async initialDate() {

        await this.setState({
            date: new Date()
        });
        await console.log(this.state.date);
    }

    changeAbbr(abbrType) {
        const abbr = this.state.abbr;
        abbr.forEach(type => {
            if (type.name === abbrType) {
                type.value = true;
                this.state.abbrType = abbrType;

            } else {
                type.value = false;
            }
        });
        if (abbrType == 'Mr.') {
            this.setState({
                gender: 'Male'
            });
        } else if (abbrType == 'Ms.') {
            this.setState({
                gender: 'Female'
            });
        }
        this.setState({
            abbr: abbr,
            invalidGender: false
        });
    }

    onChangeText(key, value) {
        if (key == 'name') {
            this.setState({
                invalidName: false
            });
        }
        if (key == 'aadharCard') {
            if (value.length == 12) {
                this.setState({
                    invalidAadhar: false
                });
            } else {
                this.setState({
                    invalidAadhar: true
                });
            }
        }
        if (key == 'co') {
            this.setState({
                invalidCO: false
            });
        }
        if (key == 'detail1') {
            this.setState({
                invalidAddr1: false
            });
        }
        if (key == 'detail2') {
            this.setState({
                invalidAddr2: false
            });
        }
        if (key == 'pinCode') {
            if (value.length == 6) {
                this.setState({
                    invalidPincode: false
                });
            } else {
                this.setState({
                    invalidPincode: true
                });
            }
        }
        this.setState({
            [key]: value
        })
    }

    async onSave() {

        await this.showLoader();

        console.log(this.state.name);
        console.log(this.state.aadharCard);
        console.log(this.state.gender);
        console.log(this.state.dob);
        console.log(this.state.co);
        console.log(this.state.detail1);
        console.log(this.state.detail2);
        console.log(this.state.pinCode);
        console.log(this.state.selectedState);
        console.log(this.state.selectedCity);

        if (this.state.gender != '') {

            if (this.state.name != '') {

                if (this.state.aadharCard != '') {

                    if (!this.state.invalidAadhar) {

                        if (this.state.co != '') {

                            if (this.state.detail1 != '') {

                                if (this.state.detail2 != '') {

                                    if (this.state.pinCode != '') {

                                        if (!this.state.invalidPincode) {

                                            if (this.state.state != 'Select State') {

                                                if (this.state.city != 'Select City') {

                                                    await fetch(env.api + "professional/submit/personalDetails/" + this.state.professional._id, {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                            "Authorization": 'Bearer ' + this.state.token
                                                        },
                                                        body: JSON.stringify({
                                                            "name": this.state.name,
                                                            "aadhar_number": this.state.aadharCard,
                                                            "gender": this.state.gender,
                                                            "date_of_birth": this.state.date,
                                                            "care_of": this.state.co,
                                                            "address_details1": this.state.detail1,
                                                            "address_details2": this.state.detail2,
                                                            "pincode": this.state.pinCode,
                                                            "city": this.state.city,
                                                            "state": this.state.state
                                                        })
                                                    })
                                                        .then(res => res.json())
                                                        .then(async data => {
                                                            if (data.error) {
                                                                this.hideLoader();
                                                                alert(data.error);
                                                            } else {
                                                                console.log(data.message);
                                                                // this.hideLoader();
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
                                                        invalidState: true
                                                    });
                                                    await this.hideLoader();
                                                    await Alert.alert('Invalid City', 'You must select City', [
                                                        { text: 'Okay' }
                                                    ]);
                                                }
                                            } else {
                                                await this.setState({
                                                    invalidCity: true
                                                });
                                                await this.hideLoader();
                                                await Alert.alert('Invalid State', 'You should select state', [
                                                    { text: 'Okay' }
                                                ]);
                                            }
                                        } else {
                                            await this.setState({
                                                invalidPincode: true
                                            });
                                            await this.hideLoader();
                                            await Alert.alert('Invalid Pincode', 'Please enter valid pincode', [
                                                { text: 'Okay' }
                                            ]);
                                        }
                                    } else {
                                        await this.setState({
                                            invalidPincode: true
                                        });
                                        await this.hideLoader();
                                        await Alert.alert('Invalid Pincode', 'Pincode should not be null', [
                                            { text: 'Okay' }
                                        ]);
                                    }
                                } else {
                                    await this.setState({
                                        invalidAddr2: true
                                    });
                                    await this.hideLoader();
                                    await Alert.alert('Invalid Address Details', 'Address line 2 should not be null', [
                                        { text: 'Okay' }
                                    ]);
                                }
                            } else {
                                await this.setState({
                                    invalidAddr1: true
                                });
                                await this.hideLoader();
                                await Alert.alert('Invalid Address Details', 'Address line 1 should not be null', [
                                    { text: 'Okay' }
                                ]);
                            }
                        } else {
                            await this.setState({
                                invalidCO: true
                            });
                            await this.hideLoader();
                            await Alert.alert('Invalid C/O', 'care of name should not be null', [
                                { text: 'Okay' }
                            ]);
                        }
                    } else {
                        await this.setState({
                            invalidAadhar: true
                        });
                        await this.hideLoader();
                        await Alert.alert('Invalid Aadhar Number', 'Please enter valid Aadhar Number', [
                            { text: 'Okay' }
                        ]);
                    }
                } else {
                    await this.setState({
                        invalidAadhar: true
                    });
                    await this.hideLoader();
                    await Alert.alert('Invalid Aadhar Number', 'Aadhar Number should not be null', [
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
        } else {
            await this.setState({
                invalidGender: true
            });
            await this.hideLoader();
            await Alert.alert('Invalid Gender', 'Please select valid abbreviation', [
                { text: 'Okay' }
            ]);
        }

    }

    componentDidMount() {
        this.initialDate();
        this.getToken();
        this.getProfessional();
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.display}>
                    <ScrollView>
                        <View style={styles.name}>
                            <View style={
                                this.state.invalidGender
                                    ?
                                    styles.invalidNameBtn
                                    :
                                    styles.nameBtn
                            }>
                                <TouchableOpacity style={this.state.abbr[0].value ? styles.mrActiveBtn : styles.mrNotActiveBtn}
                                    onPress={() => this.changeAbbr('Mr.')}
                                >
                                    <Text style={this.state.abbr[0].value ? styles.abbrActiveText : styles.abbrNotActiveText}>Mr.</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.abbr[1].value ? styles.msActiveBtn : styles.msNotActiveBtn}
                                    onPress={() => this.changeAbbr('Ms.')}
                                >
                                    <Text style={this.state.abbr[1].value ? styles.abbrActiveText : styles.abbrNotActiveText}>Ms.</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.nameText}>
                                <Input
                                    inputContainerStyle={
                                        this.state.invalidName
                                            ?
                                            styles.invalidInputStyle
                                            :
                                            styles.inputStyle
                                    }
                                    placeholder="Name"
                                    // label="State"
                                    labelStyle={styles.label}
                                    value={this.state.name}
                                    onChangeText={(val) => this.onChangeText('name', val)}
                                />
                            </View>
                        </View>
                        <Input
                            placeholder="Aadhar Card Number"
                            // label="AddressLine 2"
                            labelStyle={styles.label}
                            keyboardType='numeric'
                            inputContainerStyle={
                                this.state.invalidAadhar
                                    ?
                                    styles.invalidInputStyle
                                    :
                                    styles.inputStyle
                            }
                            value={this.state.aadharCard}
                            onChangeText={(val) => this.onChangeText('aadharCard', val)}
                        />
                        <Input
                            placeholder="Date of Birth"
                            // label="AddressLine 2"
                            labelStyle={styles.label}
                            inputContainerStyle={styles.inputStyle}
                            value={this.state.dob}
                            onFocus={() => this.showMode()}
                            leftIcon={<Ionicons name="calendar" size={30} color="gray" style={{ marginHorizontal: 10 }} onPress={() => this.showMode()} />}
                        />
                        {this.state.show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={this.state.date}
                                mode={'date'}
                                display="default"
                                onChange={this.onChange}
                            />
                        )}
                        <Input
                            placeholder="C/O ( Father's or Mother's name )"
                            // label="AddressLine 2"
                            labelStyle={styles.label}
                            inputContainerStyle={
                                this.state.invalidCO
                                    ?
                                    styles.invalidInputStyle
                                    :
                                    styles.inputStyle
                            }
                            value={this.state.co}
                            onChangeText={(val) => this.onChangeText('co', val)}
                        />
                        <Text style={styles.label}>Permanent Address</Text>
                        <Input
                            value={this.state.detail1}
                            placeholder="Flat / Building  / Colony No."
                            // label="AddressLine 1"
                            labelStyle={styles.label}
                            inputContainerStyle={
                                this.state.invalidAddr1
                                    ?
                                    styles.invalidInputStyle
                                    :
                                    styles.inputStyle
                            }
                            // value={this.state.address.addLine1}
                            onChangeText={(val) => this.onChangeText('detail1', val)}
                        />
                        <Input
                            placeholder="Landmark / Street / Locality"
                            // label="AddressLine 2"
                            labelStyle={styles.label}
                            inputContainerStyle={
                                this.state.invalidAddr2
                                    ?
                                    styles.invalidInputStyle
                                    :
                                    styles.inputStyle
                            }
                            value={this.state.detail2}
                            onChangeText={(val) => this.onChangeText('detail2', val)}
                        />
                        <Input
                            placeholder="Postal Code"
                            // label="AddressLine 2"
                            labelStyle={styles.label}
                            keyboardType='numeric'
                            inputContainerStyle={
                                this.state.invalidPincode
                                    ?
                                    styles.invalidInputStyle
                                    :
                                    styles.inputStyle
                            }
                            value={this.state.pinCode}
                            onChangeText={(val) => this.onChangeText('pinCode', val)}
                        />
                        <View style={styles.filterView} >
                            <View style={styles.filterItem} >
                                <TouchableOpacity style={this.state.invalidState ? styles.invalidFilterItemTouch : styles.filterItemTouch}
                                    onPress={() => this.toggleStateModal()}
                                >
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>
                                        <Text style={styles.itemValueText}>
                                            {this.state.selectedState}
                                        </Text>
                                        <Ionicons style={styles.itemValueIcon} size={20} name='chevron-down-outline' />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.filterItem} >
                                <TouchableOpacity style={this.state.invalidCity ? styles.invalidFilterItemTouch : this.state.selectedState == 'Select State' ? styles.filterItemTouchDisable : styles.filterItemTouch}
                                    onPress={() => this.toggleCityModal()}
                                    disabled={this.state.selectedState == 'Select State' ? true : false}
                                >
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>
                                        <Text style={styles.itemValueText}>
                                            {this.state.selectedCity}
                                        </Text>
                                        <Ionicons style={styles.itemValueIcon} size={20} name='chevron-down-outline' />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={styles.selectDateTimeButton}>
                        <TouchableOpacity style={styles.selectDateTimeButtonOpacity} onPress={() => {
                            this.onSave()
                        }}>
                            <Text style={styles.selectDateTimeButtonText}>Save</Text>
                            <Ionicons style={styles.selectDateTimeButtonIcon} name="arrow-forward-outline" color="white" size={24} />
                        </TouchableOpacity>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.stateVisible}
                        onRequestClose={() => this.toggleStateModal()}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={{ borderBottomWidth: 0.5, padding: "3%" }}>
                                    <Text
                                        style={{ fontSize: 20, fontFamily: 'Poppins-SemiBold' }}>
                                        Select State
                                    </Text>
                                </View>
                                <ScrollView>
                                    <FlatList
                                        data={this.state.states}
                                        keyExtractor={(item, index) => index.toString()}
                                        style={{ marginTop: 10 }}
                                        renderItem={
                                            ({ item }) =>
                                                <TouchableOpacity onPress={async () => {
                                                    await this.setState({
                                                        selectedState: item.state,
                                                        selectedCity: 'Select City',
                                                        cities: item.districts,
                                                        invalidState: false
                                                    });
                                                    await this.toggleStateModal();
                                                    // await console.log(item.districts);
                                                }}>
                                                    <View style={styles.countryStyle}>
                                                        <Text style={styles.textStyle}>
                                                            {item.state}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                        }
                                    />
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.cityVisible}
                        onRequestClose={() => this.toggleCityModal()}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={{ borderBottomWidth: 0.5, padding: "3%" }}>
                                    <Text
                                        style={{ fontSize: 20, fontFamily: 'Poppins-SemiBold' }}>
                                        Select City
                                    </Text>
                                </View>
                                <ScrollView>
                                    <FlatList
                                        data={this.state.cities}
                                        keyExtractor={(item, index) => index.toString()}
                                        style={{ marginTop: 10 }}
                                        renderItem={
                                            ({ item }) =>
                                                <TouchableOpacity onPress={async () => {
                                                    await this.setState({
                                                        selectedCity: item,
                                                        invalidCity: false
                                                    });
                                                    await this.toggleCityModal();
                                                    // await console.log(this.state.selectedDate);
                                                }}>
                                                    <View style={styles.countryStyle}>
                                                        <Text style={styles.textStyle}>
                                                            {item}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                        }
                                    />
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                    <Loader
                        loaderVisible={this.state.loaderVisible}
                        animationType="fade"
                    />
                </View>
            </View>
        );
    }
}

export default personalDetails;

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
    location: {
        flexDirection: 'row'
    },
    city: {
        flex: 1
    },
    inputStyle: {
        borderColor: '#FFBE85'
    },
    invalidInputStyle: {
        borderColor: 'red'
    },
    state: {
        flex: 1
    },
    name: {
        flexDirection: 'row'
    },
    nameBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 30,
        marginTop: 10
    },
    invalidNameBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 30,
        marginTop: 10,
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 20
    },
    nameText: {
        flex: 3
    },
    abbrActiveText: {
        color: 'white',
        textAlign: 'center'
    },
    abbrNotActiveText: {
        color: '#AAAAAA',
        textAlign: 'center'
    },
    mrActiveBtn: {
        backgroundColor: '#FAAE6B',
        justifyContent: 'center',
        marginRight: 1,
        paddingLeft: 5,
        width: 40,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20
    },
    mrNotActiveBtn: {
        backgroundColor: '#F3F3F3',
        justifyContent: 'center',
        marginRight: 1,
        paddingLeft: 5,
        width: 40,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20
    },
    msActiveBtn: {
        backgroundColor: '#FAAE6B',
        justifyContent: 'center',
        paddingRight: 5,
        width: 40,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20
    },
    msNotActiveBtn: {
        backgroundColor: '#F3F3F3',
        justifyContent: 'center',
        paddingRight: 5,
        width: 40,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20
    },
    saveAs: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        marginLeft: 10,
        marginBottom: 10,
    },
    addType: {
        flexDirection: 'row'
    },
    activeType: {
        borderRadius: 20,
        backgroundColor: '#FAAE6B',
        height: 40,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5
    },
    activeText: {
        color: 'white',
        fontFamily: 'Poppins-Regular',
        fontSize: 15,
    },
    notActiveType: {
        borderRadius: 20,
        backgroundColor: '#F3F3F3',
        height: 40,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5
    },
    notActiveText: {
        color: '#AAAAAA',
        fontFamily: 'Poppins-Regular',
        fontSize: 15,
    },
    label: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        marginTop: 25,
        marginBottom: 5
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
    filterView: {
        flexDirection: 'row',
        paddingRight: 5,
        marginBottom: 10
    },
    filterItem: {
        flex: 1,
        marginHorizontal: 5
    },
    filterItemText: {
        fontFamily: 'Poppins-Medium',
        textAlign: 'center'
    },
    filterItemTouch: {
        borderBottomWidth: 1,
        borderBottomColor: '#FFBE85',
        borderRadius: 10,
        minHeight: 40,
        justifyContent: 'center'
    },
    invalidFilterItemTouch: {
        borderBottomWidth: 1,
        borderBottomColor: 'red',
        borderRadius: 10,
        minHeight: 40,
        justifyContent: 'center'
    },
    filterItemTouchDisable: {
        borderBottomWidth: 1,
        borderBottomColor: '#FFBE85',
        borderRadius: 5,
        minHeight: 40,
        justifyContent: 'center',
        backgroundColor: '#e5e5e5'
    },
    itemValueText: {
        fontFamily: 'Poppins-Light',
        flex: 1,
        paddingLeft: 5,
        fontSize: 17
    }, itemValueIcon: {
        // flex:1
    },
    countryStyle: {
        padding: "3%",
    },
    textStyle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 20,
        textAlign: 'center',
        paddingRight: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    modalView: {
        backgroundColor: "white",
        // width: '80%',
        padding: 20,
        borderRadius: 20,
        elevation: 25,
        maxHeight: '60%'
    },
});