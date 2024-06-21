import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const CreditCardApplicationForm = () => {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Credit Card Application</Text>
      
      <TextInput style={styles.input} placeholder="Full Name" />
      <TextInput style={styles.input} placeholder="Date of Birth" />
      <TextInput style={styles.input} placeholder="Address" />
      <TextInput style={styles.input} placeholder="Annual Income" keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Employment Status" />
      <TextInput style={styles.input} placeholder="Bank Name" />
      <TextInput style={styles.input} placeholder="Existing Credit Card Number (if any)" keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Preferred Credit Limit" keyboardType="numeric" />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default CreditCardApplicationForm;
