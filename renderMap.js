import React, { Component } from 'react'
import { SafeAreaView, View, Image, ToastAndroid, Dimensions, Button, TouchableOpacity, Text, StyleSheet, PermissionsAndroid, Platform } from 'react-native'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';


export default class map extends Component {

    constructor(props) {
        super(props);

        if (Platform.OS == 'android') {
            this.requestCameraPermission();
        } else {
            this.handleUserLocation();
        }

        this.state = {
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
        }
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
                    var addressComponent = data.results[0].address_components[0];
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
                // console.log(this.state.newPlacesAddress)
                // console.log(this.state.initialRegion)
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    }

    onChangeValue = async (initialRegion) => {
        await this.setState({
            initialRegion
        })
        this.getAddress(this.state.initialRegion.latitude, this.state.initialRegion.longitude)
    }

    componentDidMount() {
        Geocoder.init('AIzaSyB-jyDyaOhyFGiGM0RZOBOr8H5JHjOumjo');
        setTimeout(() => this.setState({ marginBottom: 0 }), 2000);
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <MapView
                        style={{ flex: 1, marginBottom: this.state.marginBottom }}
                        // region={this.state.initialRegion}
                        onRegionChangeComplete={this.onChangeValue}
                        showsPointsOfInterest={true}
                        showsMyLocationButton={true}
                        showsUserLocation={true}
                        loadingEnabled={true}
                        ref={ref => this.map = ref}
                    />
                    <View style={{ alignSelf: "center", position: 'absolute' }}>
                        <Image style={{ height: 60, width: 60 }} source={require('./Frontend/resources/user.png')} />
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.openSearchModal()}
                >
                    <Text>CHANGE</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#ecf0f1",
    },
    item: {
        margin: 24,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    },
    button: {
        backgroundColor: "#fff",
        fontSize: 20,
        borderRadius: 30,
        marginVertical: '5%',
        marginHorizontal: '15%',
        paddingLeft: 25,
        paddingRight: 25,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
