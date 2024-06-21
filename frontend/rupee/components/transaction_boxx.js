import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TransactionBox = ({ person, accountNum, amount, dateTime }) => {
  return (
    <View style={styles.container}>
      <View style={styles.nameAccContainer}>
        <Text style={styles.person}>{person}</Text>
        <Text style={styles.accountNum}>{accountNum}</Text>
      </View>
      <View style={styles.amountDateContainer}>
        <Text style={styles.amount}>{`+ $${amount}`}</Text>
        <Text style={styles.dateTime}>{dateTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameAccContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  person: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountNum: {
    fontSize: 14,
    color: '#666',
  },
  amountDateContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  dateTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default TransactionBox;
