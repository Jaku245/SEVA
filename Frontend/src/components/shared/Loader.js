import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { View, Modal, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

class Loader extends Component {
    render() {
        const { animationType, loaderVisible } = this.props;
        return (
            <Modal
                animationType={animationType}
                transparent={true}
                visible={loaderVisible}
            >
                <View style={styles.wrapper}>
                    <View style={styles.loaderContainer}>
                        <LottieView
                            style = {styles.loaderImage}
                            source={require('../../../resources/loading.json')}
                            autoPlay
                            loop
                        />

                    </View>
                </View>
            </Modal>
        )
    }
}

Loader.propTypes = {
    animationType: PropTypes.string.isRequired,
    loaderVisible: PropTypes.bool.isRequired
}

export default Loader;

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
        height: 120,
        width: 120,
        backgroundColor: 'white',
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    loaderImage: {
        width: "85%",
        height: "85%",
        alignSelf: 'center',
        justifyContent: 'center'
    }
})