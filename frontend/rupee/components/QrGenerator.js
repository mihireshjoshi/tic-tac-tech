// QRCodeGenerator.js
import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeGenerator = ({ accountId }) => {
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

export default QRCodeGenerator;
