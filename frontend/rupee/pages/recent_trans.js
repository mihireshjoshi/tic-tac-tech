import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../supabaseee/supacreds';
import TransactionBox from '../components/transaction_boxx';

const RecentTransactions = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*');

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      console.log('Fetched transactions:', data);
      setTransactions(data);
    }
  };

  const renderItem = ({ item }) => (
    <TransactionBox 
      person={item.reciever_name} 
      accountNum={item.acc_num} 
      amount={item.amount} 
      dateTime={item.timestamp} 
    />
  );

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
          keyExtractor={item => item.id.toString()}
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
});

export default RecentTransactions;



// import { supabase } from '../supabaseee/supacreds';