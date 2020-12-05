import React, { Component } from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Input } from 'react-native-elements';
import Textarea from 'react-native-textarea';
import Ionicons from 'react-native-vector-icons/Ionicons';
import qs from 'qs';

class contact extends Component {

    state = {
        subject: '',
        mailBody: ''
    };

    onChangeText(key, value) {
        this.setState({
            [key]: value
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="menu-outline" color="white" size={28} onPress={() => this.props.navigation.toggleDrawer()} />
                    <Text style={styles.headerText}>Contact</Text>
                </View>
                <View style={styles.display}>
                    <Text style={styles.title}>We are here to solve your queries</Text>
                    <Text style={styles.mailUs}>Mail Us</Text>
                    <Divider style={{ width: '25%', backgroundColor: '#FFBE85', height: 2, alignSelf: 'center', marginBottom: 15 }} />
                    <Input
                        inputContainerStyle={styles.inputStyle}
                        placeholder="Subject"
                        // label="State"
                        labelStyle={styles.label}
                        value={this.state.subject}
                        onChangeText={(val) => this.onChangeText('subject', val)}
                    />
                    <Textarea
                        containerStyle={styles.textareaContainer}
                        style={styles.textarea}
                        onChangeText={(val) => this.onChangeText('mailBody', val)}
                        defaultValue={this.state.mailBody}
                        placeholder={'Feedback'}
                        placeholderTextColor={'#a0a0a0'}
                    />
                    <TouchableOpacity style={styles.button}
                        onPress={async () => {
                            let url = `mailto:desaijaimin5@gmail.com`;

                            const query = await qs.stringify({
                                subject: this.state.subject,
                                body: this.state.mailBody
                            });

                            if (query.length) {
                                url += `?${query}`;
                            }

                            const canOpen = await Linking.canOpenURL(url);

                            if (!canOpen) {
                                throw new Error('Provided URL can not be handled');
                            }

                            await Linking.openURL(url);
                        }}
                    >
                        <Ionicons name="send-outline" size={18} color="white" style={{ flex: 1, margin: 5, alignSelf: 'center', textAlign: 'right', marginRight: 10, }} />
                        <Text style={styles.buttonText}>
                            Send</Text>
                    </TouchableOpacity>
                    <View style={styles.or}>
                        <Divider style={styles.leftLine} />
                        <Text style={styles.orText}>OR</Text>
                        <Divider style={styles.rightLine} />
                    </View>
                    <TouchableOpacity style={styles.button}
                        onPress={async () => {
                            let number = "+91 9726925105";
                            if (Platform.OS === 'ios') {
                                number = 'telprompt:${' + number + '}';
                            }
                            else {
                                number = 'tel:${' + number + '}';
                            }
                            await Linking.openURL(number);
                        }}
                    >
                        <Ionicons name="call-outline" size={18} color="white" style={{ flex: 1, margin: 5, alignSelf: 'center', textAlign: 'right', marginRight: 10, }} />
                        <Text style={styles.buttonText}>
                            Call</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default contact;

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
    button: {
        alignSelf: 'center',
        width: '40%',
        height: 50,
        backgroundColor: '#1c1c1c',
        borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingRight: 30,
        marginVertical: '5%'
    },
    buttonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
        flex: 1
    },
    or: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10
    },
    orText: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        alignSelf: 'center',
        textAlign: 'center'
    },
    leftLine: {
        flex: 3,
        width: '25%',
        alignSelf: 'center',
        height: 2
    },
    rightLine: {
        flex: 3,
        width: '25%',
        alignSelf: 'center',
        height: 2
    },
    title: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        alignSelf: 'center',
    },
    mailUs: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        alignSelf: 'center',
        marginTop: 15
    },  
    inputStyle: {
        borderColor: '#FFBE85'
    },
    textareaContainer: {
        height: 120,
        padding: 5,
        width: '95%',
        // backgroundColor: '#F5FCFF',
        borderBottomWidth: 1,
        borderColor: '#FFBE85',
        marginHorizontal: 10,
        marginBottom: 20
    },
    textarea: {
        textAlignVertical: 'top',
        height: 170,
        fontSize: 18,
        color: '#333',
        fontFamily: 'Poppins-Regular',
        marginRight: 5,
    },
});