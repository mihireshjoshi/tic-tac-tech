import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const PaymentOptions = () => {
  const navigation = useNavigation();

  const navigateToPayAcc = () => {
    navigation.navigate('pay_acc');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make Payment</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option}>
          <Icon name="qrcode" size={40} color="#0B549D" />
          <Text style={styles.optionText}>QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={navigateToPayAcc}>
          <Icon name="user" size={40} color="#0B549D" />
          <Text style={styles.optionText}>account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Image source={require('../assets/upi.png')} style={styles.icon} />
          <Text style={styles.optionText}>upi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Icon name="credit-card" size={40} color="#0B549D" />
          <Text style={styles.optionText}>cards</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2.5,
    borderColor: '#0B549D',
    borderRadius: 30,
    padding: 14,
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  option: {
    width: 100,
    height: 100,
    alignItems: 'center',
  },
  optionText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0B549D',
  },
  icon: {
    marginBottom: 5,
  },
});

export default PaymentOptions;
