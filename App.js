import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from 'react-native';

import { UserProvider } from "./src/context/UserContext";
import { FirebaseProvider } from "./src/context/FirebaseContext";

import AppStackScreens from "./src/stacks/AppStackScreens";

export default App = () => {
    LogBox.ignoreLogs(['Setting a timer']);
    
    return (
        <FirebaseProvider>
            <UserProvider>
                <NavigationContainer>
                    <AppStackScreens />
                </NavigationContainer>
            </UserProvider>
        </FirebaseProvider>
    );
};
