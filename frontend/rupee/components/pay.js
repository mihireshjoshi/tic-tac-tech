import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const PaymentOptions = () => {
  const navigation = useNavigation();

  const navigateToPayAcc = () => {
    navigation.navigate('pay_acc');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make Payment</Text>
      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.option} onPress={navigateToPayAcc}>
          <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Icon name="user" size={20} color="#fff" />
            <Text style={styles.optionText}>Account</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Scanner')}>
          <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Icon name="qrcode" size={20} color="#fff" />
            <Text style={styles.optionText}>QR</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 30,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  option: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 25,
    overflow: 'hidden',
    width:75,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  optionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default PaymentOptions;
