import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import QRCodeGenerator from './QrGenerator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HeaderComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [accountId, setAccountID] = useState("");

  const handleAccountId = async () => {
    try {
      const account_id = await AsyncStorage.getItem("account_id");
      console.log("account ID is:", account_id)
      setAccountID(account_id);
      console.log("account id is:", accountId)
    } catch(err) {
      console.log("Error is: ",err);
    }
  }

  useEffect(() => {
    handleAccountId();
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/Logo.png')} style={styles.icon} />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
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
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Your QR Code</Text>
                {accountId ? (
                  <QRCodeGenerator accountId={accountId} />
                ) : (
                  <Text>Loading...</Text>
                )}
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HeaderComponent;
