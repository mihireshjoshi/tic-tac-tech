import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QRCodeScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [senderAccountId, setSenderAccountId] = useState('');
  const [email, setEmail] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    const getSenderAccountId = async () => {
      const accountId = await AsyncStorage.getItem('account_id');
      setSenderAccountId(accountId);
    };

    getBarCodeScannerPermissions();
    getSenderAccountId();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setAccountId(data);
  };

  const handlePayment = async () => {
    try {
        const email = await AsyncStorage.getItem('email');
        const payload = {
            sender_account_id: senderAccountId,  // Ensure this is correct
            receiver_account_id: accountId,     // Ensure this is correct
            amount: parseFloat(amount),         // Ensure this is correct
            password: password,                 // Ensure this is correct
            email: email,                       // Ensure this is correct
        };

        // Verify password
        const verifyResponse = await fetch('http://10.20.2.79:8000/verify-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        });

        if (verifyResponse.status !== 200) {
            Alert.alert('Invalid Password', 'The password you entered is incorrect.');
            return;
        }

        // Create the transaction
        const createResponse = await fetch('http://10.20.2.79:8000/create-transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (createResponse.status !== 200) {
            const errorResponse = await createResponse.json();
            Alert.alert('Transaction Error', errorResponse.detail || 'Failed to create transaction.');
            return;
        }

        const createJsonResponse = await createResponse.json();
        const { transaction_id } = createJsonResponse;

        // Process the transaction
        const processResponse = await fetch('http://10.20.2.79:8000/process-transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transaction_id }),
        });

        console.log('Response status: ', processResponse.status);
        const jsonResponse = await processResponse.json();
        console.log('JSON Response: ', jsonResponse);

        if (jsonResponse.success) {
            // Handle the response as needed
            setShowSplash(true);
            setTimeout(() => {
                setShowSplash(false);
                navigation.navigate("Home");
            }, 3000);
        } else {
            if (jsonResponse.message === "Fraudulent transaction detected. OTP sent for verification.") {
                // Handle OTP verification
                const otp = prompt("Enter the OTP sent to your phone:");
                if (otp) {
                    const verifyOtpResponse = await fetch('http://10.20.2.79:8000/verify-otp', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ transaction_id, otp }),
                    });
                    const verifyOtpJsonResponse = await verifyOtpResponse.json();
                    if (verifyOtpJsonResponse.success) {
                        Alert.alert('Success', 'Transaction completed successfully.');
                    } else {
                        Alert.alert('Error', verifyOtpJsonResponse.message);
                    }
                } else {
                    // If OTP is not entered, discard the transaction
                    await fetch('http://10.20.2.79:8000/discard-transaction', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ transaction_id }),
                    });
                    Alert.alert('Error', 'Transaction discarded due to missing OTP.');
                }
            } else {
                Alert.alert('Transaction Error', jsonResponse.message);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'An error occurred during the transaction.');
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
