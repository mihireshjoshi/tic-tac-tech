import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
      <View style={styles.optionPill}>
        <TouchableOpacity style={[styles.option, styles.leftOption]} onPress={navigateToPayAcc}>
          <Icon name="user" size={28} color="#0B549D" />
          <Text style={styles.optionText}>Account</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.option}>
          <Icon name="qrcode" size={28} color="#0B549D" onPress={() => navigation.navigate('Scanner')} />
          <Text style={styles.optionText}>QR</Text>
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
  optionPill: {
    flexDirection: 'row',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#0B549D',
    backgroundColor: '#d3d3d3',
  },
  option: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  leftOption: {
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  divider: {
    width: 2,
    backgroundColor: '#0B549D',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#0B549D',
  },
});

export default PaymentOptions;

