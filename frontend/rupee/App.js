import { React, useEffect, useState } from 'react'; 
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Qr from './components/Qr';
import QRCodeGenerator from './components/QrGenerator';
import QRCodeScanner from './components/BarCodeScanner';

export default function App() {
  const [accountId, setAccountId] = useState('125655655');
  return (
    <View style={styles.container}>
      {/* <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" /> */}

      {/* <Qr /> */}
      {/* <QRCodeGenerator accountId={accountId}/> */}
      <QRCodeScanner />
    </View>
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
