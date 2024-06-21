import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const ReceiverDetailsComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.detailsBox}>
        <Text style={styles.detailsText}>Receiver Details</Text>
        <Text style={styles.label}>Username: </Text>
        <Text style={styles.detail}>[Username]</Text>
        <Text style={styles.label}>UPI ID: </Text>
        <Text style={styles.detail}>[UPI ID]</Text>
      </View>
      <TextInput
        style={styles.inputField}
        placeholder="Enter Amount"
        keyboardType="numeric"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsBox: {
    width: '80%',
    backgroundColor: 'lightgrey',
    padding: 20,
    borderRadius: 10,
  },
  detailsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputField: {
    width: '80%',
    padding: 10,
    marginTop: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
  },
});

export default ReceiverDetailsComponent;
