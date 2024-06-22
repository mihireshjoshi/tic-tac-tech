import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Animated, ActivityIndicator, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import HeaderComponent from '../components/header';
import BottomNavBar from '../components/navBar';

const FormPage = ({ route, navigation }) => {
  const { formType = 'Loan Application' } = route.params || {};
  const [images, setImages] = useState([]);
  const [ocrData, setOcrData] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
      aspect: [3, 5],
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
    setLoading(true);  // Show loading indicator
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('files', {
        uri: image.uri,
        name: `photo${index}.jpg`,
        type: 'image/jpeg',
      });
    });

    try {
      const response = await axios.post('http://10.20.2.79:8000/process_ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setOcrData(response.data.message);
      setLoading(false);  // Hide loading indicator
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
      Alert.alert('Scan Result', 'OCR data received successfully');
    } catch (error) {
      console.error('Error scanning images:', error);
      setLoading(false);  // Hide loading indicator
      Alert.alert('Error', 'Failed to scan images.');
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderOcrData = () => {
    if (!ocrData) return null;

    return ocrData.map((pageData, pageIndex) => {
      const [instructions, data] = pageData;

      return (
        <Animated.View key={pageIndex} style={[styles.pageContainer, { opacity: fadeAnim }]}>
          <View style={styles.dataContainer}>
            {data.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                {Object.entries(item).map(([label, value]) => (
                  <View key={label} style={styles.labelValueContainer}>
                    <Text style={styles.label}>{label.replace(/_/g, ' ')}</Text>
                    <Text style={styles.value}>{value}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
          <View style={styles.instructionsContainer}>
            {instructions.map((instruction, index) => (
              <Text key={index} style={styles.instruction}>{instruction}</Text>
            ))}
          </View>
        </Animated.View>
      );
    });
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
            <TouchableOpacity key={index} onPress={() => openModal(image)}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
            <Icon name="plus" size={30} color="#0B549D" />
          </TouchableOpacity>
        </ScrollView>
        {loading && (
          <ActivityIndicator size="large" color="#3B82F6" />
        )}
        <View style={styles.formContainer}>
          {renderOcrData()}
        </View>
      </ScrollView>
      <BottomNavBar />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalBackground} onPress={closeModal}>
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image source={{ uri: selectedImage.uri }} style={styles.fullImage} />
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    marginBottom: 20,
  },
  formType: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
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
    borderWidth: 2,
    borderColor: '#3B82F6',
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
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  pageContainer: {
    marginBottom: 20,
  },
  dataContainer: {
    marginBottom: 20,
  },
  itemContainer: {
    marginBottom: 10,
    backgroundColor: '#e8f0fe',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  labelValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  value: {
    color: '#555',
  },
  instructionsContainer: {
    padding: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  instruction: {
    color: '#333',
    marginBottom: 10,
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    width: 300,
    height: 400,
    borderRadius: 10,
  },
});

export default FormPage;
