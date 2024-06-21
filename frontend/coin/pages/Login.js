import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const payload = {
            email: email,
            password: password
        }
        console.log("Payload: ", payload);
        try {
            const response = await fetch("http://10.20.2.79:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Corrected header
                },
                body: JSON.stringify(payload),
            });
            console.log("Response status: ", response.status);
            const jsonResponse = await response.json();
            console.log("JSON Response: ", jsonResponse);
            if (jsonResponse.success) {
                await AsyncStorage.setItem("auth_id", jsonResponse.auth_id);
                // await AsyncStorage.setItem("account_id", jsonResponse.account_id);
                // await AsyncStorage.getItem("auth_id")
                console.log("Logged in!!");
            }
        } catch (err) {
            console.log("Error at client: ", err);
            Alert.alert("Failure", err.message);
        }
    }

    return (
        <View>
            <Text>Email</Text>
            <TextInput
                placeholder="email"
                value={email}
                onChangeText={setEmail}
                // style={styles.input}
            />
            <Text>Password</Text>
            <TextInput
                placeholder="password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                // style={styles.input}
            />
            <TouchableOpacity onPress={handleLogin}>
                <Text>Login</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Login
