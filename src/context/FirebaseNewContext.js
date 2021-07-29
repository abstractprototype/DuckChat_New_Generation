import React, { createContext, useEffect, useState } from "react";
import uuid from 'react-native-uuid';

import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import config from "../config/firebase";

import LoadingScreen from "../screens/LoadingScreen";

// if (!firebase.apps.length) {
//     firebase.initializeApp(config);
// }

// const db = firebase.firestore();

// export const fetchRooms = (setRooms) => {

//     db.collection("chatrooms")
//         .onSnapshot((querySnapshot) => {
//             var rooms = [];
//             querySnapshot.forEach((doc) => {
//                 rooms.push(doc.data());
                
//             });
//         if(setRooms){
//             setRooms(rooms)
//         }
//         console.log("Current rooms in db: ", rooms);

//         return rooms;
//     });

//     // const rooms = []
//     // const querySnapshot = await db
//     //     .collection('chatrooms')
//     //     .orderBy('createdAt', 'desc')
//     //     .get();

//     // querySnapshot.forEach((doc) => {
        
//     //     let roomData = doc.data();
//     //     roomData.roomId = doc.id;
//     //     rooms.push(roomData);
//     // });
//     // console.log("fetched room data: ", rooms)
//     // return rooms

// };