import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen'
import MessageScreen from '../screens/MessageScreen'
import CreateJoinRoomScreen from '../screens/CreateJoinRoomScreen'

const Stack = createStackNavigator() 

const ChatRoomNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen 
                name="ChatRoomScreen"
                component = {MessageScreen}
            />

            <Stack.Screen 
                name="CreateJoinRoomScreen"
                component = {CreateJoinRoomScreen}
            />
        </Stack.Navigator>
    )
}

export {ChatRoomNavigator}