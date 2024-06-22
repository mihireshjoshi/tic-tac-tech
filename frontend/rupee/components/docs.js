import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

const Documents = ({ navigation }) => {
  const [selectedFormType, setSelectedFormType] = useState(null);

  const handleDocumentClick = (formType) => {
    setSelectedFormType(formType);
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        navigation.navigate('FormPage', { formType: selectedFormType, imageUri: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error opening camera: ", error);
      alert('An error occurred while opening the camera.');
    }
  };

  const openGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need media library permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        navigation.navigate('FormPage', { formType: selectedFormType, imageUri: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error opening gallery: ", error);
      alert('An error occurred while opening the gallery.');
    }
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
