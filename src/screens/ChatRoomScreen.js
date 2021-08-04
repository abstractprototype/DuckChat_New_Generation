import React, { useContext, useState, useEffect, useLayoutEffect } from 'react';

import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import { UserContext } from "../context/UserContext";
import { FirebaseContext } from '../context/FirebaseContext';

export default ChatRoomScreen = ({ route }) => {

    const user = useContext(UserContext);
    const firebase = useContext(FirebaseContext)
    const { thread } = route.params;
    const uid = firebase.getCurrentUser().uid;
    const userInfo = firebase.getUserInfo(uid);

    
    const [messages, setMessages] = useState([]);
      /**
         * Mock message data
         */
        // example of system message
        // {
        //   _id: 0,
        //   text: 'New room created.',
        //   createdAt: new Date().getTime(),
        //   system: true
        // },
        // // example of chat message
        // {
        //   _id: 1,
        //   text: 'Hello!',
        //   createdAt: new Date().getTime(),
        //   user: {
        //     _id: 2,
        //     name: 'Test User'
        //   }
        // }


    // useEffect( () => {
    //     const getUser = async () => {
    //         const uid = firebase.getCurrentUser().uid;
    //         const userInfo = await firebase.getUserInfo(uid);
    //         console.log("current user",  userInfo)
          
    //     }
    //     getUser()
    // }, []);


    useLayoutEffect(() => {

      firebase.fetchMessages(setMessages, thread.id)
      
    }, [])


    function renderLoading() {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#6646ee' />
          </View>
        );
      }

    function scrollToBottomComponent() {
        return (
          <View style={styles.bottomComponentContainer}>
            <IconButton icon='chevron-double-down' size={36} color='#6646ee' />
          </View>
        );
      }

    function renderSend(props) {
        return (
          <Send {...props}>
            <View style={styles.sendingContainer}>
              <IconButton icon='send-circle' size={32} color='#6646ee' />
            </View>
          </Send>
        );
      }

    function renderBubble(props) {
        return (
          // Step 3: return the component
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                
                backgroundColor: '#6646ee'
              },
              left: {
              
                backgroundColor: '#000000'
              }
            }}
            textProps={{
              style: {
                //color: props.position === 'left' ? '#fff' : '#000',
              },
            }}
            textStyle={{
              right: {
                color: '#fff'
              },
              left: {
                color: '#fff',
              }
            }}
          />
        );
      }

    // helper method that creates a message to send to firebase
    const handleSend = async (messages = []) => {
      const userInfo = await firebase.getUserInfo(uid);
    
      firebase.createMessage(thread.id, uid, userInfo.username, userInfo.email, userInfo.profilePhotoUrl, messages);
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    
    }

    return (
        <GiftedChat
        messages={messages}
        onSend={messages => handleSend(messages)}
        user={{
          _id: uid,
          name: userInfo.username,
          email: userInfo.email,
          avatar: userInfo.profilePhotoUrl
        }}
        placeholder='Type your message here...'
        showUserAvatar
        showAvatarForEveryMessage={true}
        alwaysShowSend
        scrollToBottom
        renderSend={renderSend}
        renderBubble={renderBubble}
        renderLoading={renderLoading}
        scrollToBottomComponent={scrollToBottomComponent}

        />
    );



} 

const styles = StyleSheet.create({
    sendingContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    bottomComponentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

});