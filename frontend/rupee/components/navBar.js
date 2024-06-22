import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const BottomNavBar = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState('home');

  const handlePress = (screen, icon) => {
    setSelected(icon);
    if (screen) {
      navigation.navigate(screen);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate('Home')}
      >
        <Icon
          name="home-outline"
          size={28}
          color={selected === 'home' ? "#fff" : "#fff"}
        />
      </TouchableOpacity>
      <View style={styles.scannerWrapper}>
        <TouchableOpacity
          style={styles.scannerIcon}
          onPress={() => handlePress('Scanner', 'scanner')}
        >
          <Icon
            name="qr-code-outline"
            size={34}
            color={selected === 'scanner' ? "#fff" : "#fff"}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => handlePress('Chatbot', 'chat')}
      >
        <Icon
          name="chatbubble-outline"
          size={28}
          color={selected === 'chat' ? "#fff" : "#fff"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 6,
    paddingBottom: 22,
    backgroundColor: "#002e4f",
    position: 'relative',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  iconContainer: {
    alignItems: 'center',
  },
  scannerWrapper: {
    position: 'absolute',
    top: -15,
    left: '50%',
    transform: [{ translateX: -30 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002e4f',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

export default BottomNavBar;
