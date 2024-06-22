import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeGeneratorModal = () => {
  const [accountId, setAccountId] = useState('');

  useEffect(() => {
    const fetchAccountId = async () => {
      const account_id = await AsyncStorage.getItem('account_id');
      if (account_id) {
        setAccountId(account_id);
      }
    };
    fetchAccountId();
  }, []);

  if (!accountId) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
      <Text>Your Account QR Code:</Text>
      <QRCode
        value={accountId}
        size={200}
      />
    </View>
  );
};

export default QRCodeGeneratorModal;
