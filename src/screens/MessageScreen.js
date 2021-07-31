import React, {useState, useEffect, useContext} from "react";
import { View, Text, StyleSheet, Button, FlatList, RefreshControl } from "react-native";
import { List, Divider } from 'react-native-paper';
import {Body, Container, H3, Header, ListItem, Title} from 'native-base'
import LoadingScreen from "./LoadingScreen";

import { FirebaseContext } from "../context/FirebaseContext";
import { fetchRooms } from "../context/FirebaseNewContext";

// import firebase from "firebase";
// import "firebase/firestore";


export default MessageScreen = ({ navigation }) => {

     const firebase =  useContext(FirebaseContext);
     //const mRooms = firebase.fetchRooms;

    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true);

    // const getRooms = async() => {
    //     const roomsData =  fetchRooms();
    //     console.log("fetched rooms in getRooms(): ", roomsData)//undefined
    //     //return roomsData
    //     setRooms(roomsData);
    // }
    

    useEffect(() => {

        console.log("fetching my rooms: ", firebase.fetchRooms(setRooms))
        
        if (loading) {
            setLoading(false);
        }
        
    }, [])

    useEffect(() => {
        
        console.log("rooms is now: ", rooms)

    }, [rooms])

    if(loading) {
        return <LoadingScreen />
    }

        // getRooms().then((rooms) => {
        //     setRooms(rooms)
        //     console.log("inside useEffect: ", rooms)
        // }
            
        // ).catch((error) => 
        //     console.log("Error: ", error.message)
        // )
        
    

        // useEffect(() => {

        //     // const unsubscribe = firebase.firestore()
        //     //     .collection('chatrooms')
        //     //     .get()
        //     //     .then(snapshot => {
        //     //         const threads = snapshot.map(doc => {
        //     //             const roomObject = doc.data();
        //     //             return{name: roomObject.name};
        //     //         });

        //     //         setThreads(threads);
        //     //         console.log(threads)

        //     //         if(loading) {
        //     //             setLoading(false);
        //     //         }
        //     //     });


            // const unsubscribe = firebase.firestore()
            //     .collection('chatrooms')
            //     .onSnapshot((querySnapshot) => {

            //         querySnapshot.forEach((doc) => {
            //             threads.push(doc.data().name);
            //         });
                    
            //         setThreads(threads);
            //         console.log("Threads: ", threads)
            //         console.log("Fetched data: ", threads)

            //         if(loading) {
            //             setLoading(false);
            //         }
            //     });
            
            // //unsubscribe listener, cleanup/remove the listener so the app doesn't become slow
            // return unsubscribe();

        // }, []);

       

        const Item = ({ title }) => (
            <View style={styles.item}>
              <Text style={styles.title}>{title}</Text>
            </View>
        );

        const renderItem = ({ item }) => (
            <Item title={item.name.roomName} />
        );
        
 
        return (
            <View style={styles.container}>
                
                <FlatList
                    data={rooms}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />

                <Button 
                    title="Press me to create a chat room"
                    color="#f194ff"
                    onPress={ () => navigation.navigate("CreateJoinRoomScreen", {next: ""}) }> 
                </Button>

            </View>
        );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listTitle: {
        fontSize: 22,
    },
    listDescription: {
        fontSize: 16,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    rooms: {
        marginHorizontal: 16
    },
    title: {
        fontSize: 32,
    },
});
