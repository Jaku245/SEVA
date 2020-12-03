import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

class Location extends Component {
    render() {
        const { animationType, loaderVisible } = this.props;
        return (
            <View style={styles.loaderContainer}>
                <LottieView
                    style={styles.loaderImage}
                    source={require('../../../resources/location.json')}
                    autoPlay
                    loop
                />
            </View>
        )
    }
}


export default Location;

const styles = StyleSheet.create({
    wrapper: {
        zIndex: 9,
        backgroundColor: 'rgba(0,0,0,0.7)',
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'center'
    },
    loaderContainer: {
        height: 70,
        width: 70,
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    loaderImage: {
        width: "100%",
        height: "100%",
        alignSelf: 'center',
        justifyContent: 'center'
    }
})