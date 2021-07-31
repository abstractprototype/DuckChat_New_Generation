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
                //createdAt: currentDate,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
        }catch (error) {
            console.log("Error @createChatRoom: ", error.message);
        }

    },
    createPost: async (avatar, uName, text, time, imageUri) => {

        const uid = Firebase.getCurrentUser().uid;
        const profilePic = Firebase.getCurrentUser().profilePhotoUrl;
        const postId = uuid.v4(); //Generates a random room id

        try{
            // const photo = Firebase.getBlob(imageUri);
            // const imageRef = firebase.storage().ref("postImages").child(uid);
            // imageRef.put(photo);
            //const downloadUrl = await imageRef.getDownloadURL();

            await db.collection("posts").doc(postId).set({
                avatar: avatar,
                userid: uid,
                username: uName,
                postid: postId,
                content: text,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                from: time
                //picture: imageUri
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
        .orderBy("timestamp", "asc")
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
        db.collection("posts")
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
            console.log(posts)
            return posts;
        });
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
