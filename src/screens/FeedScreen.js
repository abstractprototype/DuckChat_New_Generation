import React, {useState, useContext} from 'react'
import { Image, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal, Button } from 'react-native'
import {Ionicons} from "@expo/vector-icons"
import { MaterialCommunityIcons } from '@expo/vector-icons'

import Colors from '../../constants/Colors'
import tempData from '../../tempData'
import moment from 'moment'
import { FirebaseContext } from "../context/FirebaseContext";
import { UserContext } from "../context/UserContext";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { add } from 'react-native-reanimated'
import { render } from 'react-dom'


   //Temporary posts data
   post = [
    {
        id: "1",
        name: "Joe McKay",
        text:
            "I'm hungry",
        timestamp: 1569109273726,
        avatar: require("../../assets/avocado-halves.jpg"),
        image: require("../../assets/ice-cream.jpg"),
        likes: 4340,
        comments: 325,
    },
        {
            id: "2",
            name: "Karyn Kim",
            text:
                "I love my waifus",
            timestamp: 1569109273726,
            avatar: require("../../assets/nezuko.png"),
            image: require("../../assets/shinobu.jpg"),
            likes: 15621,
            comments: 634,
        },
            {
                id: "3",
                name: "Emerson Parsons",
                text:
                    "Apex legends is fun",
                timestamp: 1569109273726,
                avatar: require("../../assets/wraith.jpg"),
                image: require("../../assets/kanao.jpg"),
                likes: 1,
                comments: 15,
            },
                {
                    id: "4",
                    name: "Mike Hawk",
                    text:
                        "I love React Native",
                    timestamp: 1569109273726,
                    avatar: require("../../assets/ducklogo.png"),
                    image: require("../../assets/voidwalker.png"),
                    likes: 69,
                    comments: 23,
                },

];

export default FeedScreen = () => {

    const [modalOpen, setModalOpen] = useState(false);
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const firebase = useContext(FirebaseContext);

    const getPermission = async () => {
        if (Platform.OS !== "web") {
            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

            return status;
        }
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
            });

            if (!result.cancelled) {
                setImage(result.uri);
            }
        } catch (error) {
            console.log("Error @pickImage: ", error);
        }
    };

    const addMedia = async () => {
        const status = await getPermission();

        if (status !== "granted") {
            alert("We need permission to access your camera roll.");

            return;
        }

        pickImage();
    };

    const handlePost = async () => {
        // firebase.shared
        //     .addPost({ text: this.state.text.trim(), localUri: this.state.image })
        //     .then(ref => {
        //         this.setState({ text: "", image: null });
        //     })
        //     .catch(error => {
        //         alert(error);
        //     });

        setLoading(true);
        const message = { text };

        if(text.length > 0) {
            try {
                const createdPost = await firebase.createPost(message);
    
            } catch (error) {
                console.log("Error @createChatRoom: ", error);
            } finally {
                setLoading(false);
            }
        }
        //Resets text back to placeholder after making a post
       setText("")

    };

    //Code for everything inside a single Post
    const renderPost = ({ item }) => {
 
            <View style={styles.feedItem}>
                <Image source={item.avatar} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.timestamp}>{moment(item.timestamp).fromNow()}</Text>
                        </View>
                        <Ionicons name="reorder-three-outline" size={24} color="#73788B" />
                    </View>
                    <Text style={styles.post}>{item.text}</Text>
                    <Image source={item.image} style={styles.postImage} resizeMode="cover" />
                    <View style={{ flexDirection: "row" }}>
                        <View style={styles.postLikes}>
                            <Ionicons name="heart-outline" size={24} color="#73788B" style={{ marginRight: 5 }} />
                            <Text>
                                {item.likes}
                            </Text>
                        </View>
                        <View style={styles.postComments}>
                            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#73788B" style={{ marginRight: 5 }} />
                            <Text>
                                {item.comments}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
    
    }; //End code for single Post



    //Code for the whole Feed screen
    return(
    
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Feed</Text>
            </View>

            <FlatList 
                style={styles.feed} 
                data={post} 
                renderItem={renderPost} 
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                >
            </FlatList>

            <Modal visible={modalOpen} animationType='slide'>
                <View>

                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={ () => setModalOpen(false)}>
                            <MaterialCommunityIcons name={"close-thick"} size={30}/>
                        </TouchableOpacity>
                        <View style={styles.sendPostButton}>
                            <Button 
                                title="Post" 
                                color="#2196F3"
                                onPress={() => handlePost()}
                            >
                            </Button>
                        </View>
                        
                    </View>
                    
                    

                    <View style={styles.inputContainer}>
                        <Image source={require("../../assets/shinobu.jpg")} style={styles.avatar}></Image>
                        <TextInput 
                            autoFocus={true} 
                            multiline={true} 
                            numberOfLines={4} 
                            style={{flex: 1}} 
                            placeholder="What's on your mind?"
                            onChangeText={(a) => setText(a)}
                            value={text}>
                        </TextInput>
                    </View>
                    

                    <TouchableOpacity style={styles.photo} onPress={addMedia}>
                        <Ionicons name="md-camera" size={40} color="#D8D9DB" ></Ionicons>
                    </TouchableOpacity>

                    {/* <View style={{ marginHorizontal: 32, marginTop: 32, height: 150}}>
                        <Image source={{ uri: this.state.image }} style={{ width: "100%", height: "100%" }}></Image>
                    </View> */}
                </View>
            </Modal>

            <TouchableOpacity activeOpacity={0.5} style={styles.TouchableOpacityStyle} onPress={ () => setModalOpen(true)}>
                <MaterialCommunityIcons name={"pencil-plus"} size={30} color="white" style={styles.FloatingButtonStyle}/>
            </TouchableOpacity>

            

        </View>
    ); //End code for whole Feed screen
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EFECF4"
    },
    header: {
        paddingTop: 15,
        paddingBottom: 10,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: { height: 5},
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "500"
    },
    feed: {
        marginHorizontal: 16
    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16
    },
    name: {
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65"
    },
    timestamp: {
        fontSize: 11,
        color: "#C4C6CE",
        marginTop: 4
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: "#838899"
    },
    postImage: {
        width: undefined,
        height: 150,
        borderRadius: 5,
        marginVertical: 16
    },
    postLikes: {
        flexDirection: "row",
        alignItems: "center",
        
    },
    postComments: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 16
    },
    TouchableOpacityStyle : {
        backgroundColor: Colors.light.tint,
        position:'absolute',
        bottom: 30,
        right: 40,
        width: 70,
        height: 70,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    FloatingButtonStyle: {
        // position: "absolute",
        // width: 50,
        // height: 50,
        // alignItems: "center",
        // justifyContent: "center",
        // right: 30,
        // bottom: 30
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 24,
        marginRight: 16
    },
    modalHeader: {
        // alignItems: 'center',
        // justifyContent: 'center',
        // paddingLeft: 500,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    sendPostButton: {
        paddingTop: 10,
        paddingRight: 10
    },
    inputContainer: {
        margin: 32,
        flexDirection: "row"
    },
    photo: {
        alignItems: "flex-end",
        marginHorizontal: 32
    }
  

  
  
});