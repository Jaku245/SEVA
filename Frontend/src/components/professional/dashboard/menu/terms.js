import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

class terms extends Component {

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="menu-outline" color="white" size={28} onPress={() => this.props.navigation.toggleDrawer()} />
                    <Text style={styles.headerText}>Terms and Conditions</Text>
                </View>
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
    header: {
        flexDirection: 'row',
        marginVertical: 20,
        marginHorizontal: 20,
    },
    headerText: {
        flex: 5,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        color: 'white'
    },
    display: {
        backgroundColor: 'white',
        paddingTop: 50,
        paddingHorizontal: 25,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
    },
    text: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
        alignSelf: 'center',
        textAlign: 'center'
    }
});