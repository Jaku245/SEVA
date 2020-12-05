import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

class terms extends Component {

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.display}>
                    <Text style={styles.text}>Here will be our terms and conditions</Text>
                </View>
            </View>
        );
    }
}

export default terms;

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C'
    },
    display: {
        backgroundColor: 'white',
        marginTop: 30,
        paddingTop: 50,
        paddingHorizontal: 25,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
        justifyContent: 'center'
    },
    text: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
        alignSelf: 'center',
        textAlign: 'center'
    }
});