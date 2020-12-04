import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid, KeyboardAvoidingView, Dimensions, Modal, ScrollView, FlatList, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../../../shared/Loader';
import SlidingUpPanel from 'rn-sliding-up-panel'
// import io from "socket.io-client";

// let socket = io("http://192.168.43.222:3000");

import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Location from '../../../shared/location'

const { height } = Dimensions.get('window')

import { env } from '../../../shared/supports';
import states from '../../../shared/statesCities';
class updateAddress extends Component {

    constructor(props) {
        super(props);

        if (Platform.OS == 'android') {
            this.requestCameraPermission();
        } else {
            this.handleUserLocation();
        }

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
            addrType: [
                {
                    name: 'Home',
                    value: false
                },
                {
                    name: 'Work',
                    value: false
                },
                {
                    name: 'Other',
                    value: false
                }
            ],
            id: '',
            abbrType: '',
            name: '',
            detail1: '',
            detail2: '',
            type: '',
            token: null,
            customer: null,

            //MAP STATES//
            marginBottom: 1,
            initialRegion: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0
            },
            locationChoosen: false,
            address: '',
            newPlacesAddress: '',
            placesAddress: '',

            loaderVisible: false,
            requestType: '',
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

    //MAP FUNCTIONS//
    requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.turnOnGPS()
                console.log("You can use the location");
            } else {
                console.log("Location permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    turnOnGPS = async () => {
        await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
            .then(async data => {
                this.setState({ gpsState: data })
                if (data === "already-enabled") {
                    if (this.state.requestType == 'add') {
                        await this.handleUserLocation();
                    } else if (this.state.requestType == 'update') {
                        await this.userLocation();
                    }
                } else {
                    setTimeout(async () => {
                        if (this.state.requestType == 'add') {
                            await this.handleUserLocation();
                        } else if (this.state.requestType == 'update') {
                            await this.userLocation();
                        }
                    }, 1000)
                }
            })
            .catch(err => {
                alert("Error " + err.message + ", Code : " + err.code);
            });
    };

    async userLocation() {
        const add = this.props.route.params.address;
        await this.map.animateToRegion({
            ...this.state.initialRegion,
            latitude: add.coordinates.lat,
            longitude: add.coordinates.lng,
            latitudeDelta: 0.0011,
            longitudeDelta: 0.0022
        })

        await this.setState({
            initialRegion: {
                ...this.state.initialRegion,
                latitude: add.coordinates.lat,
                longitude: add.coordinates.lng,
                latitudeDelta: 0.0011,
                longitudeDelta: 0.0022
            },
            locationChoosen: true
        })
    }

    handleUserLocation = async () => {
        await Geolocation.getCurrentPosition(
            async (pos) => {
                // alert(JSON.stringify(pos))                
                await this.map.animateToRegion({
                    ...this.state.initialRegion,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    latitudeDelta: 0.0011,
                    longitudeDelta: 0.0022
                })

                await this.setState({
                    initialRegion: {
                        ...this.state.initialRegion,
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        latitudeDelta: 0.0011,
                        longitudeDelta: 0.0022
                    },
                    locationChoosen: true
                })
            },
            (error) => { alert(JSON.stringify(error)) },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
                forceRequestLocation: true,
                showLocationDialog: true
            }
        )
    }

    getAddress = async (lat, lng) => {
        await Geocoder.from(lat, lng)
            .then((data) => {
                // console.log(json);
                console.log(this.state.initialRegion)
                if (this.state.placesAddress != this.state.newPlacesAddress) {
                    const newAddress = this.state.newPlacesAddress;
                    this.setState({
                        address: newAddress,
                        newPlacesAddress: '',
                        placesAddress: ''
                    })
                    console.log(this.state.address);
                } else {
                    var addressComponent = data.results[0].formatted_address;
                    this.setState({
                        address: addressComponent
                    })
                    console.log(this.state.address);
                }
            })
            .catch(error => console.warn(error));
    }

    openSearchModal() {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                // console.log(place);

                this.map.animateToRegion({
                    ...this.state.initialRegion,
                    latitude: place.location.latitude,
                    longitude: place.location.longitude,
                    latitudeDelta: 0.0011,
                    longitudeDelta: 0.0022
                })

                this.setState({
                    initialRegion: {
                        ...this.state.initialRegion,
                        latitude: place.location.latitude,
                        longitude: place.location.longitude,
                        latitudeDelta: 0.0011,
                        longitudeDelta: 0.0022
                    },
                    newPlacesAddress: place.address
                })
                console.log(this.state.newPlacesAddress)
                console.log(this.state.initialRegion)
            })
            .catch(error => console.log(error.message));
    }

    onRegionChange = async (initialRegion) => {
        await this.setState({
            initialRegion
        })
        this.getAddress(this.state.initialRegion.latitude, this.state.initialRegion.longitude)
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
            let customer = JSON.parse(await AsyncStorage.getItem('customer'));

            if (customer !== null) {
                this.setState({
                    customer: customer
                });
            } else {

            }

        } catch (error) {
            // Error saving data
        }
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
        this.setState({
            abbr: abbr
        });
    }

    changeAddrType(upType) {
        const addrType = this.state.addrType;
        addrType.forEach(type => {
            if (type.name === upType) {
                type.value = true;
                this.state.type = upType;
            } else {
                type.value = false;
            }
        });
        this.setState({
            addType: addrType
        });
    }

    updateState() {
        const address = this.props.route.params.address;
        this.setState({
            id: address._id,
            name: address.person_name,
            detail1: address.address_detail1,
            detail2: address.address_detail2,
            selectedCity: address.city,
            selectedState: address.state
        });
        this.changeAddrType(address.address_type);
    }

    async updateAddress() {

        await this.showLoader();

        if (this.state.detail1 != '') {

            if (this.state.detail2 != '') {

                if (this.state.selectedState != 'Select State') {

                    if (this.state.selectedCity != 'Select City') {

                        if (this.state.name != '') {

                            if (this.state.type != '') {

                                if (this.props.route.name == "updateAddress") {
                                    const id = this.state.id;
                                    const name = this.state.name;
                                    const detail1 = this.state.detail1;
                                    const detail2 = this.state.detail2;
                                    const city = this.state.selectedCity;
                                    const state = this.state.selectedState;
                                    const type = this.state.type;
                                    const latitude = this.state.initialRegion.latitude;
                                    const longitude = this.state.initialRegion.longitude;

                                    await fetch(env.api + "customer/viewaddress/" + id, {
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": 'Bearer ' + this.state.token
                                        },
                                        body:
                                            JSON.stringify(
                                                {
                                                    // abbrType: '',
                                                    name: name,
                                                    detail1: detail1,
                                                    detail2: detail2,
                                                    city: city,
                                                    state: state,
                                                    type: type,
                                                    latitude: latitude,
                                                    longitude: longitude
                                                }
                                            )
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            if (data.error) {
                                                this.hideLoader();
                                                alert(data.error);
                                            } else {
                                                console.log(data.message);
                                                this.props.navigation.navigate('selectAddress');
                                                // socket.emit("refreshAddress", {});
                                            }
                                        })
                                        .catch(function (error) {
                                            console.log('There has been a problem with your fetch operation: ' + error.message);
                                            // ADD THIS THROW error
                                            alert("add address unsuccessful");
                                            throw error;
                                        });
                                } else {

                                    const name = this.state.name;
                                    const detail1 = this.state.detail1;
                                    const detail2 = this.state.detail2;
                                    const city = this.state.selectedCity;
                                    const state = this.state.selectedState;
                                    const type = this.state.type;
                                    const latitude = this.state.initialRegion.latitude;
                                    const longitude = this.state.initialRegion.longitude;

                                    await fetch(env.api + "customer/addaddress", {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": 'Bearer ' + this.state.token
                                        },
                                        body:
                                            JSON.stringify(
                                                {
                                                    // abbrType: '',
                                                    name: name,
                                                    detail1: detail1,
                                                    detail2: detail2,
                                                    city: city,
                                                    state: state,
                                                    type: type,
                                                    latitude: latitude,
                                                    longitude: longitude
                                                }
                                            )
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            if (data.error) {
                                                this.hideLoader();
                                                alert(data.error);
                                            } else {

                                                console.log(data.message);
                                                this.props.navigation.navigate('selectAddress');
                                                // socket.emit("refreshAddress", {});
                                            }
                                        })
                                        .catch(function (error) {
                                            console.log('There has been a problem with your fetch operation: ' + error.message);
                                            // ADD THIS THROW error
                                            alert("add address unsuccessful");
                                            throw error;
                                        });
                                }
                            } else {
                                await this.setState({
                                    invalidType: true
                                });
                                await this.hideLoader();
                                await Alert.alert('Invalid Type', 'Please Select the address type', [
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
                            invalidCity: true
                        });
                        await this.hideLoader();
                        await Alert.alert('Invalid City', 'City should not be null', [
                            { text: 'Okay' }
                        ]);
                    }
                } else {
                    await this.setState({
                        invalidState: true
                    });
                    await this.hideLoader();
                    await Alert.alert('Invalid State', 'State should not be null', [
                        { text: 'Okay' }
                    ]);
                }
            } else {
                await this.setState({
                    invalidLocality: true
                });
                await this.hideLoader();
                await Alert.alert('Invalid Locality', 'Locality should not be null', [
                    { text: 'Okay' }
                ]);
            }
        } else {
            await this.setState({
                invalidNo: true
            });
            await this.hideLoader();
            await Alert.alert('Invalid No.', 'No. should not be null', [
                { text: 'Okay' }
            ]);
        }
    }

    onChangeText(key, value) {

        if (key == 'detail1') {
            if (value.length > 0) {
                this.setState({
                    invalidNo: false
                })
            } else {
                this.setState({
                    invalidNo: true
                })
            }
        }
        if (key == 'detail2') {
            if (value.length > 0) {
                this.setState({
                    invalidLocality: false
                })
            } else {
                this.setState({
                    invalidLocality: true
                })
            }
        }
        if (key == 'name') {
            if (value.length > 0) {
                this.setState({
                    invalidName: false
                })
            } else {
                this.setState({
                    invalidName: true
                })
            }
        }
        this.setState({
            [key]: value
        })
    }

    async componentDidMount() {
        if (this.props.route.name == 'updateAddress') {
            await this.setState({
                requestType: 'update'
            });
            await this.updateState();

        } else {
            await this.setState({
                requestType: 'add'
            });
        }
        await this.getToken();
        await this.getCustomer();
        await Geocoder.init('AIzaSyB-jyDyaOhyFGiGM0RZOBOr8H5JHjOumjo');
        await setTimeout(() => this.setState({ marginBottom: 0 }), 2000);
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
            >
                <View style={styles.mapcontainer}>
                    <MapView
                        style={{ flex: 1, marginBottom: this.state.marginBottom }}
                        onRegionChangeComplete={this.onRegionChange}
                        showsPointsOfInterest={true}
                        showsMyLocationButton={true}
                        loadingEnabled={true}
                        showsUserLocation={true}
                        ref={ref => this.map = ref}
                    />
                    <Location />
                </View>
                <SlidingUpPanel
                    ref={c => (this._panel = c)}
                    draggableRange={{ top: height / 1.10, bottom: 110 }}
                    animatedValue={this._draggedValue}
                    snappingPoints={[400]}
                    showBackdrop={true}
                    friction={0.4}
                >
                    <View style={styles.display}>
                        <ScrollView>
                            <TouchableOpacity
                                style={styles.mapPlacesButton}
                                onPress={() => this.openSearchModal()}
                            >
                                <Text style={styles.mapPlacesAddress}>{this.state.address}</Text>
                                <Text style={styles.mapPlacesChange}>CHANGE</Text>
                            </TouchableOpacity>
                            <Input
                                value={this.state.detail1}
                                placeholder="Flat / Building  / Colony No."
                                // label="AddressLine 1"
                                // keyboardType='numeric'
                                labelStyle={styles.label}
                                inputContainerStyle={this.state.invalidNo ? styles.invalidInputStyle : styles.inputStyle}
                                // value={this.state.address.addLine1}
                                onChangeText={(val) => this.onChangeText('detail1', val)}
                            />
                            <Input
                                placeholder="Landmark / Street / Locality"
                                // label="AddressLine 2"
                                labelStyle={styles.label}
                                inputContainerStyle={this.state.invalidLocality ? styles.invalidInputStyle : styles.inputStyle}
                                value={this.state.detail2}
                                onChangeText={(val) => this.onChangeText('detail2', val)}
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
                            <View style={styles.name}>
                                <View style={styles.nameBtn}>
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
                                        inputContainerStyle={this.state.invalidName ? styles.invalidInputStyle : styles.inputStyle}
                                        placeholder="Name"
                                        // label="State"
                                        labelStyle={styles.label}
                                        value={this.state.name}
                                        onChangeText={(val) => this.onChangeText('name', val)}
                                    />
                                </View>
                            </View>
                            <Text style={styles.saveAs}>Save As</Text>
                            <View style={styles.addType}>
                                <TouchableOpacity style={this.state.addrType[0].value ? styles.activeType : styles.notActiveType}
                                    onPress={() => this.changeAddrType('Home')}
                                >
                                    <Text style={this.state.addrType[0].value ? styles.activeText : styles.notActiveText}>Home</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.addrType[1].value ? styles.activeType : styles.notActiveType}
                                    onPress={() => this.changeAddrType('Work')}
                                >
                                    <Text style={this.state.addrType[1].value ? styles.activeText : styles.notActiveText}>Work</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.addrType[2].value ? styles.activeType : styles.notActiveType}
                                    onPress={() => this.changeAddrType('Other')}
                                >
                                    <Text style={this.state.addrType[2].value ? styles.activeText : styles.notActiveText}>Other</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.updateAddressButton}>
                                <TouchableOpacity style={styles.updateAddressButtonOpacity} onPress={() => {
                                    this.updateAddress()
                                    // navigate('selectAddress');
                                }}>
                                    <Text style={styles.updateAddressButtonText}>{this.props.route.name == 'updateAddress' ? 'Update Address' : 'Add Address'}</Text>
                                    <Ionicons style={styles.updateAddressButtonIcon} name="arrow-forward-outline" color="white" size={24} />
                                </TouchableOpacity>
                            </View>
                            <Loader
                                loaderVisible={this.state.loaderVisible}
                                animationType="fade"
                            />
                        </ScrollView>
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
                    </View>
                </SlidingUpPanel>
            </KeyboardAvoidingView>
        );
    }
}

export default updateAddress;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    mapcontainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#ecf0f1",
    },
    mapPlacesButton: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginHorizontal: "3%",
        marginBottom: "5%",
        paddingBottom: "2%",
        borderBottomWidth: 1,
        borderBottomColor: "#FFBE85",
    },
    mapPlacesAddress: {
        flex: 5,
        alignSelf: "center",
        textAlign: 'left',
        paddingRight: "3%",
        fontFamily: 'Poppins-Regular',
        fontSize: 15,
        letterSpacing: 0.3,
        fontWeight: 'normal'
    },
    mapPlacesChange: {
        flex: 2,
        alignSelf: "center",
        textAlign: 'right',
        paddingRight: "2%",
        fontFamily: 'Poppins-Regular',
        fontSize: 15,
        fontWeight: 'normal',
        letterSpacing: 1,
        color: "purple"
    },
    display: {
        backgroundColor: 'white',
        marginTop: 15,
        paddingTop: 40,
        paddingBottom: 150,
        paddingHorizontal: 15,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%'
    },
    label: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        fontWeight: 'normal'
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
    updateAddressButtonOpacity: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f1f1f',
        height: 50,
        width: 350,
        borderRadius: 25,
        marginBottom: 40,
        flexDirection: 'row',
        paddingLeft: 30
    },
    updateAddressButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        marginTop: "10%"
    },
    updateAddressButtonText: {
        flex: 4,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        color: '#fff'
    },
    updateAddressButtonIcon: {
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