import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import LottieView from 'lottie-react-native';

const QRCodeScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setAccountId(data);
  };

  const handlePayment = async () => {
    try {
      const payload = { accountId, amount, password };
      const response = await fetch('http://10.20.2.79:8000/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log('Response status: ', response.status);
      const jsonResponse = await response.json();
      console.log('JSON Response: ', jsonResponse);
      // Handle the response as needed
      setShowSplash(true);
      setTimeout(() => {
        setShowSplash(false);
        navigation.navigate("Home");
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setModalVisible(false);
      setScanned(false);
      setAmount('');
      setPassword('');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {showSplash ? (
        <LottieView
          source={require('../assets/success.json')}
          autoPlay
          loop={false}
          style={styles.splash}
        />
      ) : (
        <>
          {!scanned ? (
            <Animatable.View animation="fadeIn" style={styles.scannerContainer}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.scanner}
              />
            </Animatable.View>
          ) : (
            <Animatable.View animation="fadeInUp" style={styles.paymentContainer}>
              <Text style={styles.label}>Account ID: {accountId}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Proceed to Pay</Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <Animatable.View animation="zoomIn" style={styles.modalView}>
                <Text style={styles.modalText}>Enter Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={handlePayment}>
                  <Text style={styles.buttonText}>Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </Animatable.View>
            </View>
          </Modal>
          {scanned && (
            <TouchableOpacity style={styles.button_b} onPress={() => setScanned(false)}>
              <Text style={styles.retry}>Scan Again</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  splash: {
    width: 200,
    height: 200,
  },
  scannerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scanner: {
    height: 400,
    width: 400,
  },
  paymentContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#0B549D',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#0B549D',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    color: '#0B549D',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    height: 40,
  },
  retry: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: '#fff',
  },
  button_b: {
    backgroundColor: '#0B549D',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
});

export default QRCodeScanner;
