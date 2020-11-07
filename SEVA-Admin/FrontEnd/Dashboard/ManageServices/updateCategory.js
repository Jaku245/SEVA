import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import { Card, Divider, Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';

import Loader from '../../shared/Loader';
import { env } from '../../shared/supports';

class updateCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cat: this.props.route.params.cat,
            name: '',
            profession: '',
            description: '',
            subcategories: [],
            token: null,
            admin: null,
            imageChanged: false,
            profile: {
                file: null,
                fileUri: null
            },
            loaderVisible: false
        }
    }

    showLoader() {
        this.setState({ loaderVisible: true })
    }

    hideLoader() {
        this.setState({ loaderVisible: false })
    }

    async getAdmin() {
        try {
            let adminWithOutParse = await AsyncStorage.getItem('admin');
            let admin = JSON.parse(adminWithOutParse);
            // console.log(token);

            if (admin != null) {
                this.setState({
                    admin: admin
                });
            } else {

            }

        } catch (error) {
            // Error saving data
        }
    }

    async getToken() {
        await this.showLoader();

        try {
            let token = await AsyncStorage.getItem('token');
            // console.log(token);

            if (token != null) {
                this.setState({
                    token: token
                });
            } else {

            }

        } catch (error) {
            // Error saving data
        }
    }

    async fetchSubCategories() {
        
        await fetch(env.api + "admin/subcategory/" + this.state.cat._id, {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    // console.log(data.subCategory);
                    this.setState({
                        subCategories: data.subCategory
                    });
                }
            });
        await this.hideLoader();
    }

    async componentDidMount() {
        await this.getToken();
        await this.getDetails();
        await this.getAdmin();
        await this.fetchSubCategories();
        this.willFocusSubscription = await this.props.navigation.addListener(
            'focus',
            () => {
                this.getToken();
                this.fetchSubCategories();
            }
        );
    }

    onChangeText(key, value) {
        this.setState({
            [key]: value
        })
    }

    async delete() {

        await this.showLoader();

        fetch(env.api + "admin/category/delete/" + this.props.route.params.cat._id, {
            method: "DELETE",
            headers: {
                "Authorization": 'Bearer ' + this.state.token
            },
        })
            .then(res => res.json())
            .then(async data => {
                if (data.error) {
                    this.hideLoader();
                    alert(data.error);
                } else {
                    console.log(data.message);
                    this.props.navigation.navigate('categories');
                }
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                alert("update profile unsuccessful");
                throw error;
            });
    }

    launchImageLibrary = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                // console.log('response', JSON.stringify(response));
                const obj = {
                    file: response,
                    fileUri: response.uri
                }
                this.setState({
                    profile: obj,
                    imageChanged: true
                });
            }
        });

    }

    async update() {

        await this.showLoader();

        const data = new FormData();

        if (this.state.imageChanged) {

            await data.append('name', this.state.name);

            await data.append('about', this.state.description);

            await data.append('profession', this.state.profession);

            await data.append('display_image', {
                name: this.state.profile.file.fileName,
                type: this.state.profile.file.type,
                uri:
                    Platform.OS === 'android' ? this.state.profile.fileUri : this.state.profile.fileUri.replace('file://', ''),
            });

            await console.log(JSON.stringify(data));

            await fetch(env.api + "admin/category/modifyImage/" + this.props.route.params.cat._id, {
                method: "PUT",
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": 'Bearer ' + this.state.token
                },
                body: data
            })
                .then(res => res.json())
                .then(async data => {
                    if (data.error) {
                        this.hideLoader();
                        alert(data.error);
                    } else {
                        console.log(data.message);
                        this.props.navigation.navigate('categories');
                    }
                })
                .catch(function (error) {
                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    // ADD THIS THROW error
                    alert("update profile unsuccessful");
                    throw error;
                });
        } else {

            await data.append('name', this.state.name);

            await data.append('about', this.state.description);

            await data.append('categoryName', this.state.profession);

            await console.log(JSON.stringify(data));

            await fetch(env.api + "admin/category/modify/" + this.props.route.params.cat._id, {
                method: "PUT",
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": 'Bearer ' + this.state.token
                },
                body: data
            })
                .then(res => res.json())
                .then(async data => {
                    if (data.error) {
                        this.hideLoader();
                        alert(data.error);
                    } else {
                        console.log(data.message);
                        this.props.navigation.navigate('categories');
                    }
                })
                .catch(function (error) {
                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    // ADD THIS THROW error
                    alert("update profile unsuccessful");
                    throw error;
                });
        }
    }

    getDetails() {

        const cat = this.props.route.params.cat;

        let obj = {
            file: null,
            fileUri: cat.display_image
        };

        this.setState({
            name: cat.name,
            profession: cat.profession_type,
            description: cat.about,
            profile: obj
        });
    }

    render() {

        const { navigate } = this.props.navigation;

        const renderCards = ({ item, index }) => {
            return (
                <TouchableOpacity onPress={async () => {
                    // await this.setProfession(item.profession_type);
                    await navigate('updateSubCategory', { subCat: item });
                }}>
                    <Card containerStyle={styles.categoryCard} >
                        <Ionicons name="construct-outline" size={24} color="#FFBE85" style={styles.cardIcon} />
                        <Text style={{ fontSize: 12, textAlign: 'center', color: 'gray' }}>{item.name}</Text>
                    </Card>
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons style={{ flex: 1, alignSelf: 'center' }} name="arrow-back-outline" color="white" size={28}
                        onPress={() => this.props.navigation.navigate('categories')}
                    />
                    <Text style={styles.headerText}>{this.state.cat.name}</Text>
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 10 }}>
                        <Ionicons name="trash-outline" color="red" size={28}
                            onPress={() => this.delete()}
                        />
                    </View>
                </View>
                {this.state.profile.fileUri == null
                    ?
                    <TouchableOpacity style={styles.addImage} onPress={() => this.launchImageLibrary()}>
                        <Text style={{ fontFamily: 'Poppins-Medium', color: 'white' }}>+</Text>
                        <Text style={{ fontFamily: 'Poppins-Medium', color: 'white' }}>Add Image</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.imageTouch} onPress={() => this.launchImageLibrary()}>
                        <Image
                            source={{
                                uri: this.state.profile.fileUri,
                            }}
                            style={styles.image} />
                    </TouchableOpacity>
                }
                <View style={styles.display}>
                    <ScrollView>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.title}>Name</Text>
                            <Input
                                value={this.state.name}
                                placeholder="category name"
                                inputContainerStyle={styles.inputStyle}
                                onChangeText={(val) => this.onChangeText('name', val)}
                            />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.title}>Profession</Text>
                            <Input
                                value={this.state.profession}
                                placeholder="category profession"
                                inputContainerStyle={styles.inputStyle}
                                onChangeText={(val) => this.onChangeText('profession', val)}
                            />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.title}>Description</Text>
                            <Input
                                value={this.state.description}
                                placeholder="category description"
                                inputContainerStyle={styles.inputStyle}
                                onChangeText={(val) => this.onChangeText('description', val)}
                            />
                        </View>
                        <Divider style={{ width: '50%', height: 1, backgroundColor: '#e3e3e3', alignSelf: 'center', marginBottom: 30, marginTop: 10 }} />
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.subHead}>Sub categories</Text>
                            <TouchableOpacity style={{ flex: 1 }}
                                onPress={() => {
                                    navigate('addSubCategory', { cat: this.props.route.params.cat });
                                }}
                            >
                                <Text style={styles.subAdd}>+ Add</Text>
                            </TouchableOpacity>
                        </View>
                        <Divider style={{ width: '95%', height: 1, backgroundColor: '#FFBE85', alignSelf: 'center', marginBottom: 10, marginTop: 5 }} />
                        <View style={styles.category}>
                            <FlatList
                                data={this.state.subCategories}
                                numColumns={3}
                                renderItem={renderCards}
                                keyExtractor={item => item._id}
                            // nestedScrollEnabled={true}
                            />
                        </View>
                    </ScrollView>
                    <Loader
                        loaderVisible={this.state.loaderVisible}
                        animationType="fade"
                    />
                </View>
                <View style={styles.selectDateTimeButton}>
                    <TouchableOpacity style={styles.selectDateTimeButtonOpacity} onPress={() => {
                        this.update();
                    }}>
                        <Text style={styles.selectDateTimeButtonText}>Update Category</Text>
                        <Ionicons style={styles.selectDateTimeButtonIcon} name="arrow-forward-outline" color="white" size={24} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


export default updateCategory;

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
        fontSize: 18,
        color: 'white',
    },
    display: {
        backgroundColor: 'white',
        marginTop: 90,
        paddingTop: 100,
        paddingHorizontal: 20,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        height: '100%',
    },
    imageTouch: {
        height: 140,
        width: 140,
        position: 'absolute',
        borderRadius: 70,
        alignSelf: 'center',
        marginTop: 90,
        zIndex: 99,
        backgroundColor: '#FFBE85',
    },
    image: {
        height: 140,
        width: 140,
        borderRadius: 70,
        alignSelf: 'center',
    },
    addImage: {
        height: 140,
        width: 140,
        position: 'absolute',
        borderRadius: 70,
        alignSelf: 'center',
        marginTop: 90,
        zIndex: 99,
        backgroundColor: '#FFBE85',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        marginLeft: 10
    },
    inputStyle: {
        borderColor: '#FFBE85'
    },
    subHead: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        marginLeft: 10,
        flex: 1
    },
    subAdd: {
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        marginRight: 30,
        color: '#0099FF',
        textAlign: 'right'
    },
    category: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        paddingBottom: 250,
        marginTop: 10
    },
    categoryCard: {
        minHeight: 112,
        minWidth: 112,
        maxWidth: 112,
        marginHorizontal: 5,
        marginVertical: 10,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardIcon: {
        alignSelf: 'center',
        marginBottom: 5
    },
    selectDateTimeButtonOpacity: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f1f1f',
        height: 50,
        width: 350,
        borderRadius: 25,
        flexDirection: 'row',
        paddingLeft: 30,
        marginBottom: 20
    },
    selectDateTimeButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0
    },
    selectDateTimeButtonText: {
        flex: 4,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        color: '#fff'
    },
    selectDateTimeButtonIcon: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'flex-end',
    },
});