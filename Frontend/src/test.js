import React, { Component } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import LottieView from 'lottie-react-native';

class test extends Component {
    render() {
        return (
            <View style={styles.container}>
                <LottieView
                    source={require('../resources/loading.json')}
                    autoPlay
                    loop
                />
            </View>
        )
    }
}


export default test;

const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 100
    }
})