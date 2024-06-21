import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const QRScannerComponent = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');

        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(galleryStatus.status === 'granted');
      } catch (error) {
        console.error("Error requesting permissions:", error);
        Alert.alert("Permission Error", "Failed to get permissions.");
      }
    })();
  }, []);

  const openGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        console.log(result.uri);
        // handle the selected image here
      }
    } catch (error) {
      console.error("Error opening gallery:", error);
      Alert.alert("Gallery Error", "Failed to open gallery.");
    }
  };

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera or gallery</Text>;
  }

  return (
    <View style={styles.container}>
      <Modal visible={isCameraOpen} transparent={true}>
        <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={ref => setCameraRef(ref)}>
          <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={async () => {
                try {
                  if (cameraRef) {
                    let photo = await cameraRef.takePictureAsync();
                    console.log(photo.uri);
                    closeCamera();
                    // handle the captured image here
                  }
                } catch (error) {
                  console.error("Error capturing photo:", error);
                  Alert.alert("Camera Error", "Failed to capture photo.");
                }
              }}>
              <Text style={styles.captureButtonText}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeCamera}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </Modal>
      <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
        <Text style={styles.buttonText}>From Gallery Options</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.captureButton} onPress={openCamera}>
        <Text style={styles.captureButtonText}>Open Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 5,
  },
  captureButton: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
  },
  captureButtonText: {
    color: 'black',
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  closeButtonText: {
    color: 'white',
  },
});

export default QRScannerComponent;
