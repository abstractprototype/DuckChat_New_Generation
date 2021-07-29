import React, { createContext, useEffect, useState } from "react";
import uuid from 'react-native-uuid';

import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import config from "../config/firebase";

import moment from "moment";

//import LoadingScreen from "../screens/LoadingScreen";

const FirebaseContext = createContext();

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const db = firebase.firestore();
const currentDate = moment().format('MMMM Do YYYY, h:mm:ss a');

const Firebase = {

    getCurrentUser: () => {
        return firebase.auth().currentUser;
    },

    createChatRoom: async (roomName) => {

        const roomId = uuid.v4(); //Generates a random room id

        try {
            await db.collection("chatrooms").doc(roomId).set({
                name: roomName,
                id: roomId,
                createdAt: currentDate
            });
        }catch (error) {
            console.log("Error @createChatRoom: ", error.message);
        }

    },
    createPost: async (text) => {

        const postId = uuid.v4(); //Generates a random room id

        try{
            await db.collection("posts").doc(postId).set({
                postid: postId,
                content: text,
               
            })
        }catch(error){
            console.log("Error @createPost: ", error.message);
        }

    
    },

    createUser: async (user) => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            const uid = Firebase.getCurrentUser().uid;

            let profilePhotoUrl = "default";

            await db.collection("users").doc(uid).set({
                username: user.username,
                email: user.email,
                password: user.password,
                profilePhotoUrl,
            });

            if (user.profilePhoto) {
                profilePhotoUrl = await Firebase.uploadProfilePhoto(user.profilePhoto);
            }

            //delete user.password;

            return { ...user, profilePhotoUrl, uid };
        } catch (error) {
            console.log("Error @createUser: ", error.message);
        }
    },

    uploadProfilePhoto: async (uri) => {
        const uid = Firebase.getCurrentUser().uid;

        try {
            const photo = await Firebase.getBlob(uri);

            const imageRef = firebase.storage().ref("profilePhotos").child(uid);
            await imageRef.put(photo);

            const url = await imageRef.getDownloadURL();

            await db.collection("users").doc(uid).update({
                profilePhotoUrl: url,
            });

            return url;
        } catch (error) {
            console.log("Error @uploadProfilePhoto: ", error);
        }
    },

    getBlob: async (uri) => {
        return await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onload = () => {
                resolve(xhr.response);
            };

            xhr.onerror = () => {
                reject(new TypeError("Network request failed."));
            };

            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
    },

    getUserInfo: async (uid) => {
        try {
            const user = await db.collection("users").doc(uid).get();

            if (user.exists) {
                return user.data();
            }
        } catch (error) {
            console.log("Error @getUserInfo: ", error);
        }
    },

    fetchRooms: (setRooms) => {

        db.collection("chatrooms")
        .onSnapshot((querySnapshot) => {
            var rooms = [];
            querySnapshot.forEach((doc) => {
                rooms.push(doc.data());
                
            });

            console.log("Current rooms in fetchRooms: ", rooms);
            if(setRooms){
                setRooms(rooms)
            }
          
            return rooms;
        });
        

        // if(loading) {
        //     return <LoadingScreen />
        // }

    // const [threads, setThreads] = useState([]);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const unsubscribe = db
    //         .collection('chatrooms')
    //         .onSnapshot(querySnapshot => {
    //             const threads = [];
    //             querySnapshot.forEach(documentSnapshot => {
    //                 threads.push({
    //                     ...documentSnapshot.data(),
    //                     //key: documentSnapshot.id,
    //                 });
    //             });
    //             setThreads(threads);
    //             console.log("fetched rooms: ", threads)
    //             setLoading(false);

    //             return {threads};
    //         })
    //     return () => unsubscribe();
    // }, [])
    // if(loading){
    //     return <LoadingScreen />;
    // }

        // const rooms = [];
        // const querySnapshot = await db
        //     .collection("chatrooms")
        //     .get();
        // querySnapshot.forEach((doc) => {
        //     let roomData = doc.data();
        //     //roomData.id = doc.name;
        //     rooms.push(roomData)
        // });
        // //console.log("Room Data: ", rooms);
        // return {rooms};

        // const [threads, setThreads] = useState([]);
        // const [loading, setLoading] = useState(true);

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

        // useEffect(() => {

        //     const unsubscribe = db
        //         .collection('chatrooms')
        //         .onSnapshot((querySnapshot) => {
        //             const threads = [];
        //             querySnapshot.forEach((doc) => {
        //                 threads.push(doc.data().name);
        //             });
                    

        //             setThreads(threads);
        //             console.log("Threads: ", threads)

        //             if(loading) {
        //                 setLoading(false);
        //             }
        //         });
            
        //     //unsubscribe listener, cleanup/remove the listener so the app doesn't become slow
        //     return () => unsubscribe();

        // }, []);

        // if(loading) {
        //     return <LoadingScreen />
        // }
    },
        

    logOut: async () => {
        try {
            await firebase.auth().signOut();

            return true;
        } catch (error) {
            console.log("Error @logOut: ", error);
        }

        return false;
    },

    signIn: async (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    },
};

const FirebaseProvider = (props) => {
    return <FirebaseContext.Provider value={Firebase}>{props.children}</FirebaseContext.Provider>;
};

export { FirebaseContext, FirebaseProvider };
