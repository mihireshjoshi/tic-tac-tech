import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import Login from './pages/Login';
import Home from './pages/homePage';
import RecentTransactions from './pages/recent_trans';
import OCR from './pages/OCR';
import FormPage from './pages/FormPage';
import QRScannerComponent from './pages/QrScanner';
import PayScreen from './pages/Pay_acc';
import QRCodeScanner from './pages/BarCodeScanner';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ocr"
          component={OCR}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pay_acc"
          component={PayScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="qrscan"
          component={QRScannerComponent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FormPage"
          component={FormPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecentTransacs"
          component={RecentTransactions}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Scanner"
          component={QRCodeScanner}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
