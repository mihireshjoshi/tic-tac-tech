import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const Documents = ({ navigation }) => {
  const handleDocumentClick = (formType) => {
    navigation.navigate('FormPage', { formType });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Documents</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => handleDocumentClick('Fixed Deposit')}>
          <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Icon name="bank" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.optionText}>Fixed Deposit</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => handleDocumentClick('Loan Application')}>
          <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Icon name="file-text-o" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.optionText}>Loan Application</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => handleDocumentClick('Credit Card Application')}>
          <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Icon name="credit-card" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.optionText}>Credit Card Application</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderRadius: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: 'black',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  option: {
    width: 95,
    height: 85,
    borderRadius: 20,
    margin: 10,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  optionText: {
    marginTop: 5,
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    marginBottom: 5,
  },
});

export default Documents;
