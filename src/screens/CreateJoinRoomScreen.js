import React, {useState, useContext} from 'react' 
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Button} from 'react-native'
import {Title} from 'react-native-paper'

import { MaterialCommunityIcons } from '@expo/vector-icons';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

//import firestore from '@react-native-firebase/firestore';
import { FirebaseContext } from "../context/FirebaseContext";


const CreateJoinRoomScreen = ({ navigation }) => {

    const [createRoomName, setCreateRoomName] = useState('');
    const [joinRoomName, setJoinRoomName] = useState('');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const firebase = useContext(FirebaseContext);
    const roomOwnerId = firebase.getCurrentUser().uid;

    //console.log("current owner of room: ", roomOwnerId)

    const handleButtonPress = async () => {
        setLoading(true);

        const room =  {createRoomName};

        if(createRoomName.length > 0) {
            try {
                const createdRoom = await firebase.createChatRoom(room, roomOwnerId);
    
            } catch (error) {
                console.log("Error @createChatRoom: ", error);
            } finally {
                setLoading(false);
            }
        }

        setCreateRoomName('')
    }

    return (
        <View style={styles.rootContainer}>
            <View style={styles.closeButtonContainer}>
                <TouchableOpacity onPress={ () => navigation.goBack()}>
                    <MaterialCommunityIcons name={"close-thick"} size={30}/>
                </TouchableOpacity>
            </View>

            <View style={styles.innerContainer}>
                <Title style={styles.title}>Create or Join a Chat Room</Title>
                <FormInput
                    labelName='Room Name'
                    value={createRoomName}
                    onChangeText={(text) => setCreateRoomName(text)}
                    clearButtonMode='while-editing'
                />
                <FormButton
                    title='Create Room'
                    modeValue='contained'
                    labelStyle={styles.buttonLabel}
                    onPress={() => handleButtonPress()}
                    disabled={createRoomName.length === 0}
                />
                
                <FormInput
                    labelName='Room ID'
                    value={joinRoomName}
                    onChangeText={(joinId) => setJoinRoomName(joinId)}
                    clearButtonMode='while-editing'
                />
                <FormButton
                    title='Join Room'
                    modeValue='contained'
                    labelStyle={styles.buttonLabel}
                    onPress={() => handleButtonPress()}
                    disabled={joinRoomName.length === 0}
                />
            </View>

        </View>
    );
}

export default CreateJoinRoomScreen

const styles = StyleSheet.create({
    myText: {
        color: 'black',
        fontSize: 25,
        textAlign: 'center'
    },
    input: {
         height: 40,
         margin: 12,
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rootContainer: {
        flex: 1,
    },
    closeButtonContainer: {
        position: 'absolute',
        top: 30,
        right: 0,
        zIndex: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    buttonLabel: {
        fontSize: 22,
    },
});
