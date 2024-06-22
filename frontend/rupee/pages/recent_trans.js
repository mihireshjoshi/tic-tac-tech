import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseee/supacreds';
import TransactionBox from '../components/transaction_boxx';

const RecentTransactions = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [accountId, setAccountId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAccountId();
  }, []);

  const getAccountId = async () => {
    try {
      const id = await AsyncStorage.getItem('account_id');
      if (id !== null) {
        setAccountId(id);
        fetchTransactions(id);
      }
    } catch (error) {
      console.error('Error fetching account ID:', error);
    }
  };

  const fetchTransactions = async (id) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`sender_account_id.eq.${id},receiver_account_id.eq.${id}`);

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      console.log('Fetched transactions:', data);
      setTransactions(data);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => {
    const isSender = item.sender_account_id === accountId;
    const isReceiver = item.receiver_account_id === accountId;
    const amountStyle = isSender ? styles.amountRed : styles.amountGreen;
    const sign = isSender ? '-' : '+';

    return (
      <TransactionBox 
        person={item.reciever_name || 'N/A'} 
        accountNum={item.reciever_account_id?.toString() || 'N/A'} 
        amount={`${sign} $${item.amount?.toString() || 'N/A'}`} 
        dateTime={item.timestamp ? new Date(item.timestamp).toString() : 'N/A'} 
        amountStyle={amountStyle}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Recent Transactions</Text>
      {transactions.length === 0 ? (
        <Text>No transactions</Text>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={item => item.transactions_id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  amountRed: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
  amountGreen: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecentTransactions;
