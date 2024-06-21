import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import * as ImagePicker from "expo-image-picker";

const QRCodeModal = ({ modalVisible, setModalVisible, qrImage }) => {

  const [image, setImage] = useState(null);

  const saveImage = async (image) => {
    setImage(image);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 5],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      await saveImage(result.assets[0].uri); // Show modal on image select
    }
  };


  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert(jsonData.PhotoBtn.CameraPersmissionRequiredMessage);
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true,
      aspect: [3, 5],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      saveImage(result.assets[0].uri); // Show modal on image capture
    }
  };


  const uploadImage = async () => {
    if (!image) {
      Alert.alert("No Image", "Pick an Image first");
      return;
    }
    const uriParts = image.split(".");
    const fileType = uriParts[uriParts.length - 1];

    const formData = new FormData();
    const language = await AsyncStorage.getItem("language");
    formData.append("file", {
      uri: image,
      type: `image/png`,
      name: `photo.png`,
    });
    formData.append("operation", "add");
    formData.append("language", language);

    try {
      const baseUrl = await AsyncStorage.getItem("baseUrl");
      const endpoint = `${baseUrl}/get_imagedets`;
      setIsshowsplashsscreen(true)
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        console.log(data.data.Name);
        console.log(data.data.Brand);
        onImage(
          data.data.Name,
          data.data.Brand,
          data.data.Category,
          data.data.Price,
          data.data.Quantity,
          data.data.Netweight,
          data.data.Threshold
        );
        setIsshowsplashsscreen(false)
        Alert.alert(jsonData.PhotoBtn.Success, jsonData.PhotoBtn.UploadSuccessfulMessage);
        setImage(null);
      } else {
        setIsshowsplashsscreen(false)
        Alert.alert(jsonData.PhotoBtn.Failure,data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(jsonData.PhotoBtn.Failure, jsonData.PhotoBtn.UploadUnsuccessfulMessage);
    }
  };

  return (
    <View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#0B549D',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default QRCodeModal;
