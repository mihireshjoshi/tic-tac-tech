import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';

const HeaderComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/Logo.png')} style={styles.icon} />
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Icon name="qr-code-outline" size={28} color="#0B549D" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Notification clicked')}>
          <FontAwesome5 name="bell" size={28} color="#0B549D" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Profile clicked')}>
          <FontAwesome5 name="user-circle" size={28} color="#0B549D" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    
    borderBottomWidth: 3,
    borderBottomColor: '#ccc',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 130, // Set a maximum width
    overflow: 'hidden',
  },
  icon: {
    width: 130,
    height: 70,
    resizeMode: 'contain',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 120,
  },
});

export default HeaderComponent;
