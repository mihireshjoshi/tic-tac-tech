import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TransComponent = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Account number</Text>
        <Text style={styles.accountNumber}>1234 5678 1234</Text>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balance}>$ XXX, XXX. XX</Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('RecentTransacs')}
        >
          <Text style={styles.buttonText}>View Transactions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: '#1C1C2E', // dark background color
    borderRadius: 15,
    padding: 20,
    position: 'relative', // Ensure the button is positioned relative to this card
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 5,
  },
  accountNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  balanceLabel: {
    color: '#C0C0C0',
    fontSize: 14,
    marginBottom: 5,
  },
  balance: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    position: 'absolute',
    bottom: 24,
    right: 10,
    padding: 10,
    borderRadius: 10,
    borderColor:"#FFFFFF",
    borderWidth:1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
});

export default  TransComponent;
