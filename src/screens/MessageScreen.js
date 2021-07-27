import React, {useState, useEffect, useContext} from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import { List, Divider } from 'react-native-paper';
import {Body, Container, H3, Header, ListItem, Title} from 'native-base'

import { FirebaseContext } from "../context/FirebaseContext";
import { fetchRooms } from "../context/FirebaseNewContext";

// import firebase from "firebase";
// import "firebase/firestore";

const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      name: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      name: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      name: 'Third Item',
    },
  ];

export default MessageScreen = ({ navigation }) => {

    //const firebase = useContext(FirebaseContext);
   
    //const cRooms = firebase.fetchRooms;

    const [rooms, setRooms] = useState([])

    useEffect(() => {
        getRooms();

    }, [])

    async function getRooms() {
        const roomsData = await fetchRooms();
        setRooms(roomsData);
        
    }
    console.log("fetched rooms in message screen: ", rooms)

   
    // if(loading) {
    //     return <LoadingScreen />
    // }

    // useEffect(() => {
    //     getRooms();
    // }, []);
 
    // async function getRooms(){
    //     const roomsData = await firebase.fetchRooms();
    //     setThreads(roomsData.threads);
    // }

    // console.log("Room data in MessageScreen", threads);



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

        // if(loading) {
        //     return <LoadingScreen />
        // }


    // function renderPosts({item}) {
    //     // <List.Item
    //     //     title={item.name}
    //     //     description='Item description'
    //     //     titleNumberOfLines={1}
    //     //     titleStyle={styles.listTitle}
    //     //     descriptionStyle={styles.listDescription}
    //     //     descriptionNumberOfLines={1}
    //     // />

    //     return(
    //     <ListItem key={item.id} button>
    //         <Body>
    //             <H3 style={{lineHeight: 30,}}>
    //                 {item.name}
    //             </H3>
    //             <Text numberOfLines={1}>{item.toString()}</Text>
    //         </Body>
    //     </ListItem>
    //     );
        
    //}

    // const renderPost = ({ item }) => {
    //     <List.item
    //                     title={item}
    //                     description='Item description'
    //                     titleNumberOfLines={1}
    //                     titleStyle={styles.listTitle}
    //                     descriptionStyle={styles.listDescription}
    //                     descriptionNumberOfLines={1}
    //     />
    //}
 

    const myKeyExtractor = ({item}) => {
        return item.id
    }

    const renderItem = ({item}) => {
        return <View>
            <Text>{item.name}</Text>
        </View>
    }

        return (
            <View style={styles.container}>
                
                {/* <FlatList
                    data={rooms}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <Divider />}
                    renderItem={({ renderPost })}
                /> */}

                <FlatList>
                    style={styles.rooms}
                    data={DATA}
                    renderItem={renderItem}
                    keyExtractor={myKeyExtractor}
                    ItemSeparatorComponent={() => <Divider />}
                    showsVerticalScrollIndicator={false}
                
                </FlatList>

                

                <Text>{DATA.name}</Text>
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
});
