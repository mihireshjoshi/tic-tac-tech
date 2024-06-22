import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseee/supacreds'; // Make sure to import supabase client
import { useNavigation, useRoute } from "@react-navigation/native";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    const payload = {
      email: email,
      password: password,
    };
    console.log('Payload: ', payload);
    try {
      const response = await fetch('http://10.20.2.124:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log('Response status: ', response.status);
      const jsonResponse = await response.json();
      console.log('JSON Response: ', jsonResponse);
      if (jsonResponse.success) {
        await AsyncStorage.setItem('auth_id', jsonResponse.auth_id);
        console.log('Logged in!!');

        // Fetch account_id from Supabase
        const { data, error } = await supabase
          .from('users_b')
          .select('account_id, language')
          .eq('auth_id', jsonResponse.auth_id)
          .single();
        
        console.log(">>>>>>", data)
        if (error) {
          Alert.alert('Error fetching account_id', error.message);
        } else {
          await AsyncStorage.setItem('account_id', data.account_id);
          await AsyncStorage.setItem('language', data.language);
          await AsyncStorage.setItem('email', email);
          console.log('Account ID stored!!');
          navigation.navigate('Home');
        }


      } else {
        Alert.alert('Login failed', jsonResponse.message);
      }
    } catch (err) {
      console.log('Error at client: ', err);
      Alert.alert('Failure', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Text>Password</Text>
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#003D7A',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login;
