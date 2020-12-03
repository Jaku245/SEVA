import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { SafeAreaView, Image, PermissionsAndroid, Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SlidingUpPanel from 'rn-sliding-up-panel';


// IMPORTS FOR MAP
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Location from '../../../shared/location';

const { height } = Dimensions.get('window')

import { env } from '../../../shared/supports';
import Loader from '../../../shared/Loader';
// import io from "socket.io-client";

// let socket = io("http://192.168.43.222:3000");

class updateManageAddress extends Component {

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
            city: '',
            state: '',
            type: '',
            token: '',
            customer: null,
            loaderVisible: false,

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
            placesAddress: ''
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
                    await this.handleUserLocation()
                } else {
                    setTimeout(async () => {
                        await this.handleUserLocation()
                    }, 1000)
                }
            })
            .catch(err => {
                alert("Error " + err.message + ", Code : " + err.code);
            });
    };

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
            .catch(error => console.log(error.message));  // error is a Javascript Error object
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
            city: address.city,
            state: address.state
        });
        this.changeAddrType(address.address_type);
    }

    updateAddress() {

        this.showLoader();

        if (this.props.route.name == "updateAddress") {
            const id = this.state.id;
            const name = this.state.name;
            const detail1 = this.state.detail1;
            const detail2 = this.state.detail2;
            const city = this.state.city;
            const state = this.state.state;
            const type = this.state.type;

            fetch(env.api + "customer/viewaddress/" + id, {
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
                            type: type
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
                        this.props.navigation.navigate('manageAddresses');
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
            const city = this.state.city;
            const state = this.state.state;
            const type = this.state.type;

            fetch(env.api + "customer/addaddress", {
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
                            type: type
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
                        this.props.navigation.navigate('manageAddresses');
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
    }

    onChangeText(key, value) {
        this.setState({
            [key]: value
        })
    }

    async componentDidMount() {
        if (this.props.route.name == 'updateAddress') {
            await this.updateState();
        }
        await this.getToken();
        await this.getCustomer();
        Geocoder.init('AIzaSyB-jyDyaOhyFGiGM0RZOBOr8H5JHjOumjo');
        setTimeout(() => this.setState({ marginBottom: 0 }), 2000);
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
                    draggableRange={{ top: height / 1.30, bottom: 100 }}
                    animatedValue={this._draggedValue}
                    snappingPoints={[400]}
                    showBackdrop={true}>
                    <View style={styles.display}>
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
                            inputContainerStyle={styles.inputStyle}
                            // value={this.state.address.addLine1}
                            onChangeText={(val) => this.onChangeText('detail1', val)}
                        />
                        <Input
                            placeholder="Landmark / Street / Locality"
                            // label="AddressLine 2"
                            labelStyle={styles.label}
                            inputContainerStyle={styles.inputStyle}
                            value={this.state.detail2}
                            onChangeText={(val) => this.onChangeText('detail2', val)}
                        />
                        <View style={styles.location}>
                            <Input
                                containerStyle={styles.city}
                                inputContainerStyle={styles.inputStyle}
                                placeholder="City"
                                // label="City"
                                labelStyle={styles.label}
                                value={this.state.city}
                                onChangeText={(val) => this.onChangeText('city', val)}
                            />
                            <Input
                                containerStyle={styles.state}
                                inputContainerStyle={styles.inputStyle}
                                placeholder="State"
                                // label="State"
                                labelStyle={styles.label}
                                value={this.state.state}
                                onChangeText={(val) => this.onChangeText('state', val)}
                            />
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
                                    inputContainerStyle={styles.inputStyle}
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
                    </View>
                </SlidingUpPanel>
            </KeyboardAvoidingView >
        );
    }
}

export default updateManageAddress;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    display: {
        backgroundColor: 'white',
        marginTop: 15,
        paddingTop: 35,
        paddingHorizontal: 15,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%'
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
        height: "6%"
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
        flex: 1,
        alignSelf: "center",
        textAlign: 'right',
        paddingRight: "2%",
        fontFamily: 'Poppins-Regular',
        fontSize: 15,
        fontWeight: 'normal',
        letterSpacing: 1,
        color: "purple"
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
    }
});