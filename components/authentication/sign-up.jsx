import React, { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { View, StyleSheet, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function SignUp({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        console.log(" in sign up")
    })
    const createUser = async() => {
        // console.log("going to start", email);
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Success: ", user);
        }).catch((e) => console.log(e));
    }
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Sign Up</Text>
            <TextInput style={styles.input} mode="outlined" label="Email" value={email} onChangeText={(value) => setEmail(value)} keyboardType="email-address"/>
            <TextInput style={styles.input} mode="outlined" label="Password" secureTextEntry={true} value={password} onChangeText={(value) => setPassword(value)}/>
            <Button onPress={createUser} mode="contained" style={styles.mainButton}>Sign Up</Button>

            <Button style={{marginTop: 10}} onPress={() => navigation.navigate('Sign-in')}>Already have an account?</Button>
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

    input: {
        width: "80%"
    },

    mainButton: {
        marginTop: 4,
        width: "80%",
        borderRadius: 15
    }
});