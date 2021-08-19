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

    createMessage: async (threadId, uid, uName, userEmail, userAvatar, messages) => {
        //const messageId = uuid.v4(); //Generates a random message id

        const {
            _id,
            createdAt,
            text,
            user
          } = messages[0]
        try {
            await db.collection('chatrooms').doc(threadId).collection('messages').add({
                _id,
                createdAt,
                text,
                user:{
                    _id: uid,
                    name: uName,
                    email: userEmail,
                    avatar: userAvatar
                }
            });
        }catch (error){
            console.log("Error @createMessage: ", error.message);
        }


    },
    createChatRoom: async (createRoomName, roomOwnerId) => {

        const roomId = uuid.v4(); //Generates a random room id
        var inviteID = ""; //Generates a 5 digit invite ID 
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++)
            inviteID += possible.charAt(Math.floor(Math.random() * possible.length));
    

        try {
            await db.collection("chatrooms").doc(roomId).set({
                room_owner: roomOwnerId,
                name: createRoomName,
                id: roomId,
                inviteLink: inviteID,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
        }catch (error) {
            console.log("Error @createChatRoom: ", error.message);
        }

    },
    createPost: async (avatar, uName, text, imageUri) => {
        
        const uid = Firebase.getCurrentUser().uid;
        const profilePic = Firebase.getCurrentUser().profilePhotoUrl;
        const postId = uuid.v4(); //Generates a random room id
        const areaId = uuid.v4(); //Generates a random area id
        
        try{
            // const photo = Firebase.getBlob(imageUri);
            // const imageRef = firebase.storage().ref("postImages").child(uid);
            // imageRef.put(photo);
            //const downloadUrl = await imageRef.getDownloadURL();

            await db.collection("posts").doc(postId).set({
                _id: postId,
                avatar: avatar,
                userid: uid,
                username: uName,
                content: text,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                //picture: imageUri
            })

        }catch(error){
            console.log("Error @createPost: ", error.message);
        }

    },
    
    fetchMessages: (setMessages, threadId) => {
        db.collection("chatrooms")
        .doc(threadId)
        .collection('messages')
        .orderBy("createdAt", "desc")
        .onSnapshot(snapshot => setMessages(
            snapshot.docs.map(doc => ({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user
            }))
        ))
        
    },

    fetchRooms: (setRooms) => {

        db.collection("chatrooms")
        .orderBy("createdAt", "asc")
        .onSnapshot((querySnapshot) => {
            var rooms = [];
            querySnapshot.forEach((doc) => {
                rooms.push(doc.data());
                
            });

            //console.log("Current rooms in fetchRooms: ", rooms);
            if(setRooms)
            {
                setRooms(rooms)
            }
          
            return rooms;
        });
    },

    fetchPosts: (setPosts) => {
        db
        .collection("posts")
        .orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {
            var posts = [];
            querySnapshot.forEach((doc) => {
                posts.push(doc.data());
                
            });
            //console.log("Current posts in fetchPosts: ", posts);
            if(setPosts)
            {
                setPosts(posts)
            }
            
            return posts;
        });
    },

    createUser: async (user) => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            const uid = Firebase.getCurrentUser().uid;

            let profilePhotoUrl = "default";

            await db.collection("users").doc(uid).set({
                displayName: user.username,
                username: user.username,
                email: user.email,
                password: user.password,
                profilePhotoUrl,
                photoUrl: user.profilePhoto
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
