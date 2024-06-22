import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Documents = ({ navigation }) => {
  const handleDocumentClick = (formType) => {
    navigation.navigate('FormPage', { formType });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Documents</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => handleDocumentClick('Fixed Deposit')}>
          <Icon name="bank" size={28} color="#0B549D" style={styles.icon} />
          <Text style={styles.optionText}>Fixed Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => handleDocumentClick('Loan Application')}>
          <Icon name="file-text-o" size={28} color="#0B549D" style={styles.icon} />
          <Text style={styles.optionText}>Loan Application</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => handleDocumentClick('Credit Card Application')}>
          <Icon name="credit-card" size={28} color="#0B549D" style={styles.icon} />
          <Text style={styles.optionText}>Credit Card Application</Text>
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  option: {
    width: 110,
    height: 110,
    alignItems: 'center',
  },
  optionText: {
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
    color: '#0B549D',
  },
  icon: {
    marginBottom: 5,
  },
});

export default Documents;
