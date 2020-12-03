import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

class about extends Component {

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="menu-outline" color="white" size={28} onPress={() => this.props.navigation.toggleDrawer()} />
                    <Text style={styles.headerText}>About</Text>
                </View>
                <View style={styles.display}>
                    <Text style={styles.hello}>Hello there!</Text>
                    <Text style={styles.head1}>We are Team</Text>
                    <Text style={styles.head2}>seva.</Text>
                    <Divider style={{ width: '75%', backgroundColor: '#FFBE85', height: 2, alignSelf: 'center', marginVertical: 15 }} />
                    <Text style={styles.desc}>This application will allow customer to book premium services professionals.There will be professionals for all the household needs. The booking of services will be based on the availability of professionals and also considering the residing area of customer. Customers can also give feedback and ratings to the service or the professional.</Text>
                    <Ionicons name="hammer-outline" size={200} color="#FFBE85" />
                </View>
            </View>
        );
    }
}

export default about;

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
    hello: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        alignSelf: 'center'
    },
    head1: {
        fontFamily: 'Poppins-Regular',
        fontSize: 27,
        alignSelf: 'center',
        marginTop: 20
    },
    head2: {
        fontFamily: 'Poppins-Black',
        fontSize: 65,
        alignSelf: 'center',
        marginLeft: 10,
        lineHeight: 60
    },
    desc: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        alignSelf: 'center',
        textAlign: 'justify',
        marginTop: 20,
        marginHorizontal: 10,
    }
});