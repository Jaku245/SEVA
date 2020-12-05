import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Card, Divider } from 'react-native-elements';

import carpenter from '../../../../../resources/carpenter.jpg';

class serviceDetails extends Component {

    state = {
        name: this.props.route.params.name,
        id: this.props.route.params.id,
        serviceName: this.props.route.params.serviceName,
        price: this.props.route.params.price
    }

    render() {

        return (
            <View style={styles.container}>
                <Card containerStyle={styles.card}>
                    <Image source={carpenter} style={styles.image} />
                    <Text style={styles.serviceHeader}>{this.state.name}</Text>
                    <Divider style={styles.divider} />
                    <Text style={styles.serviceDesc}>We have the best service providers. We assure you that you will get this service done as soon as you request.</Text>
                    <Text style={styles.servicePrice}>Rs. {this.state.price}/-</Text>
                </Card>
            </View>
        );
    }
}

export default serviceDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    card: {
        borderRadius: 15,
    },
    image: {
        height: 350,
        width: 350,
        borderRadius: 10
    },
    serviceHeader: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 25,
        alignSelf: 'center',
        marginVertical: 10,
        marginHorizontal: 10
    },
    serviceDesc: {
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        color: 'gray',
        textAlign: 'justify',
        marginVertical: 15,
        marginHorizontal: 10
    },
    servicePrice: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
        textAlign: 'center',
        color: 'gray'
    },
    divider: {
        width: '75%',
        alignSelf: 'center',
        backgroundColor: '#FFBE85',
        height: 2
    }
})