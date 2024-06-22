import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const Invests = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Investments</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option}>
          <Image source={require('../assets/crypto.png')} style={styles.icon} />
          <Text style={styles.optionText}>Crypto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Image source={require('../assets/stocks.png')} style={styles.icon} />
          <Text style={styles.optionText}>Stocks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Image source={require('../assets/bonds.png')} style={styles.icon} />
          <Text style={styles.optionText}>Bonds</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Image source={require('../assets/crypto.png')} style={styles.icon} />
          <Text style={styles.optionText}>Properties</Text>
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
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#d3d3d3',
    margin: 10,
  },
  optionText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0B549D',
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
});

export default Invests;
