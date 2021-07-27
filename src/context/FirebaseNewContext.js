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

const db = firebase.firestore();

export const fetchRooms = async () => {
    const rooms = []
    const querySnapshot = await db
        .collection('chatrooms')
        .get();
    querySnapshot.forEach((doc) => {
        
        let roomData = doc.data();
        rooms.push(roomData);
    });
    console.log("fetched room data: ", rooms)
    return rooms
};