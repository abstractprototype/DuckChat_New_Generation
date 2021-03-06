import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen'
import MessageScreen from '../screens/MessageScreen'
import CreateJoinRoomScreen from '../screens/CreateJoinRoomScreen'
import ChatRoomScreen from '../screens/ChatRoomScreen'

const Stack = createStackNavigator() 

const ChatRoomNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen 
                name="MessageScreen"
                component = {MessageScreen}
            />

            <Stack.Screen 
                name="CreateJoinRoomScreen"
                component = {CreateJoinRoomScreen}
            />

            <Stack.Screen 
                name="ChatRoomScreen"
                component = {ChatRoomScreen}
                options={{ title: 'Room 1' }}
                //options={({ route }) => ({ title: route.params.name })}
            />
            
           
        </Stack.Navigator>
    )
}

export {ChatRoomNavigator}