import React, {useState, useEffect, useContext} from "react";
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from "react-native";
import { List, Divider } from 'react-native-paper';
import LoadingScreen from "./LoadingScreen";

import { FirebaseContext } from "../context/FirebaseContext";


export default MessageScreen = ({ navigation }) => {

    const firebase =  useContext(FirebaseContext);
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
     
        firebase.fetchRooms(setRooms)
        
        if (loading) {
            setLoading(false);
        }
        
    }, [])

    useEffect(() => {
     
        rooms

    }, [rooms])

    if(loading) {
        return <LoadingScreen />
    }

    const Item = ({ title }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={ () => navigation.navigate("ChatRoomScreen", {thread: item}) }>
               <Item title={item.name.createRoomName} />
        </TouchableOpacity>
     
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
