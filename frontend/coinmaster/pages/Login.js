import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert , StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const payload = {
            email: email,
            password: password
        }
        console.log("Payload: ", payload);
        try {
            const response = await fetch("http://10.20.2.124:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            console.log("Response status: ", response.status);
            const jsonResponse = await response.json();
            console.log("JSON Response: ", jsonResponse);
            if (jsonResponse.success) {
                await AsyncStorage.setItem("auth_id", jsonResponse.auth_id);
                console.log("Logged in!!");
                navigation.navigate("Home");
            } else {
                Alert.alert("Login failed", jsonResponse.message);
            }
        } catch (err) {
            console.log("Error at client: ", err);
            Alert.alert("Failure", err.message);
        }
    }

    return (
        <View style = {styles.container}>
            <Text>Email</Text>
            <TextInput
                placeholder="email"
                value={email}
                onChangeText={setEmail}
            />
            <Text>Password</Text>
            <TextInput
                placeholder="password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <TouchableOpacity onPress={handleLogin}>
                <Text>Login</Text>
            </TouchableOpacity>
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
  });

export default Login;
