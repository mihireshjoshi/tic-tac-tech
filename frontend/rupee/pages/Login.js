import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseee/supacreds'; // Make sure to import supabase client
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    const payload = { email, password };
    console.log('Payload: ', payload);
    try {
      const response = await fetch('http://192.168.66.58:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <LinearGradient
      colors={['#002e4f', '#002e4f']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Image source={require('../assets/rupee_genie_logo.png')} style={styles.logo} />
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#A9A9A9"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={styles.input}
            placeholderTextColor="#A9A9A9"
          />
        </View>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: width,
    height: height,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 100,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#fff',
  },
  button: {
    backgroundColor: '#1C3FAA',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#A9A9A9',
    marginTop: 20,
  },
});

export default Login;
