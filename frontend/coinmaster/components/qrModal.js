import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';

const QRCodeModal = ({ modalVisible, setModalVisible, qrImage }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {qrImage ? (
            <Image source={{ uri: qrImage }} style={styles.qrImage} />
          ) : (
            <Text>Loading...</Text>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
