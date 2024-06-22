import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const CardDetailsModal = ({ visible, onClose, card }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.detailsModalContainer}>
        <View style={styles.detailsModalContent}>
          <Text style={styles.detailTitle}>Card Details</Text>
          {card && (
            <ScrollView style={styles.detailsContainer}>
              <Text style={styles.detailLabel}>Card Number: {card.card_number}</Text>
              <Text style={styles.detailLabel}>Cardholder Name: {card.cardholder_name}</Text>
              <Text style={styles.detailLabel}>Expiration Date: {card.expiration_date}</Text>
              <Text style={styles.detailLabel}>CVV: {card.cvv}</Text>
              <Text style={styles.detailLabel}>Credit Limit: {card.credit_limit}</Text>
              <Text style={styles.detailLabel}>Balance: {card.balance}</Text>
              <Text style={styles.detailLabel}>Status: {card.status}</Text>
              <Text style={styles.detailLabel}>Issued At: {card.issued_at}</Text>
              <Text style={styles.detailLabel}>Billing Address: {card.billing_address}</Text>
              <Text style={styles.detailLabel}>Reward Points: {card.reward_points}</Text>
              <Text style={styles.detailLabel}>Interest Rate: {card.interest_rate}</Text>
            </ScrollView>
          )}
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  detailsModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  detailsModalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#003D7A',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CardDetailsModal;
