import React from "react";
import { View, Text, StyleSheet} from "react-native";

import * as Permissions from "expo-permissions"
import * as ImagePicker from 'expo-image-picker'

export default PostScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Post Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
