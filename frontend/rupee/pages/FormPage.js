import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import LoanApplicationForm from '../components/LoanApplicationForm';
import CreditCardApplicationForm from '../components/CreditCardApplicationForm';
import FixedDepositForm from '../components/FixedDepositForm';

import HeaderComponent from '../components/header';
import BottomNavBar from '../components/navBar';

const FormPage = ({ route, navigation }) => {
  const { formType = 'Loan Application' } = route.params || {};
  const [images, setImages] = useState([]);

  const handleAddImage = () => {
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
      setImages([...images, result.assets[0]]);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need media library permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const handleScan = async () => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('files', {
        uri: image.uri,
        name: `photo${index}.jpg`,
        type: 'image/jpeg',
      });
    });

    try {
      const response = await axios.post('http://10.20.2.124:8001/scan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload success', response.data);
      Alert.alert('Scan Result', response.data.message);
    } catch (error) {
      console.error('Error scanning images:', error);
      Alert.alert('Error', 'Failed to scan images.');
    }
  };

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
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleAddImage}>
              <Text style={styles.buttonText}>Add Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleScan}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView horizontal style={styles.imageList}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image.uri }} style={styles.imagePreview} />
          ))}
          <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
            <Icon name="plus" size={30} color="#0B549D" />
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.formContainer}>
          {renderForm()}
        </View>
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
    marginBottom: 20,
  },
  formType: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageList: {
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F9FF',
    borderRadius: 10,
    borderColor: '#0B549D',
    borderWidth: 2,
    borderStyle: 'dashed',
    width: 100,
    height: 100,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
});

export default FormPage;
