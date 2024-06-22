import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const Invests = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Investments</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option}>
          <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Icon name="bitcoin" size={20} color="#fff" />
            <Text style={styles.optionText}>Crypto</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Icon name="line-chart" size={20} color="#fff" />
            <Text style={styles.optionText}>Stocks</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Icon name="dollar" size={20} color="#fff" />
            <Text style={styles.optionText}>Bonds</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Icon name="home" size={20} color="#fff" />
            <Text style={styles.optionText}>Properties</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
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
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  option: {
    width: 70,
    height: 70,
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
  },
});

export default Invests;
