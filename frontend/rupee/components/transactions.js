import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseee/supacreds'; // Adjust the path as needed

const TransComponent = ({ navigation }) => {
  const [accountId, setAccountId] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    const fetchAccountIdAndBalance = async () => {
      try {
        const accountId = await AsyncStorage.getItem('account_id');
        if (!accountId) {
          Alert.alert('Error', 'No account ID found');
          return;
        }

        setAccountId(accountId);

        const { data, error } = await supabase
          .from('users_b') // Replace 'users_b' with your actual table name
          .select('balance')
          .eq('account_id', accountId)
          .single();

        if (error) {
          Alert.alert('Error fetching balance', error.message);
        } else {
          setBalance(data.balance);
        }
      } catch (error) {
        console.error('Error fetching account ID or balance:', error);
        Alert.alert('Error', 'Failed to fetch account ID or balance');
      }
    };

    fetchAccountIdAndBalance();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Account ID</Text>
        <Text style={styles.accountNumber}>{accountId}</Text>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balance}>{balance ? `$ ${balance}` : 'Loading...'}</Text>
        
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
    borderColor: "#FFFFFF",
    borderWidth: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
});

export default TransComponent;
