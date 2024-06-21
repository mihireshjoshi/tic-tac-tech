import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import LoanApplicationForm from '../components/LoanApplicationForm';
import CreditCardApplicationForm from '../components/CreditCardApplicationForm';
import FixedDepositForm from '../components/FixedDepositForm';

import HeaderComponent from '../components/header';
import BottomNavBar from '../components/navBar';

const FormPage = ({ route }) => {
  const { formType = 'Loan Application', imageUri = '' } = route.params || {};

  const renderForm = () => {
    switch (formType) {
      case 'Loan Application':
        return <LoanApplicationForm />;
      case 'Fixed Deposit':
        return <FixedDepositForm />;
      case 'Credit Card Application':
        return <CreditCardApplicationForm />;
      default:
        return null;
    }
  };

  return (
    <>
    <HeaderComponent />
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.formType}>{formType}</Text>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text>No image selected</Text>
        )}
      </View>
      <View style={styles.formContainer}>
        {renderForm()}
      </View>
      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => {
          // Handle form submission
          // alert('Form submitted');
        }}
      >
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>
    </ScrollView>
    <BottomNavBar />

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f3f3f3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formType: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FormPage;
