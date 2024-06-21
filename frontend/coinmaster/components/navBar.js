// BottomNavBar.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const BottomNavBar = () => {
  const navigation = useNavigation();

//   const handleQr = async () => {
//     navigation.navigate{'QRpage'}

//   }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('home')}>
        <Icon name="home-outline" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Chatbot')}>
        <Icon name="chatbubble-outline" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('qrscan')}>
        <Icon name="qr-code-outline" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Card pressed')}>
        <Icon name="card-outline" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Profile pressed')}>
        <Icon name="person-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 6,
    paddingBottom: 30,
    backgroundColor: "#0B549D"
  },
  iconContainer: {
    alignItems: 'center',
    borderColor: 'black',
  },
});

export default BottomNavBar;
