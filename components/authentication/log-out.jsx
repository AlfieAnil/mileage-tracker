import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { auth } from "../../firebaseConfig";

export default function LogoutScreen() {
    useEffect(() => {
        auth.signOut();
    })
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Logging out</Text>
            <ActivityIndicator />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },

    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 12
    },
});