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
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Card Number</Text>
                <Text style={styles.detailValue}>{card.card_number}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Cardholder Name</Text>
                <Text style={styles.detailValue}>{card.cardholder_name}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Expiration Date</Text>
                <Text style={styles.detailValue}>{card.expiration_date}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>CVV</Text>
                <Text style={styles.detailValue}>{card.cvv}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Credit Limit</Text>
                <Text style={styles.detailValue}>{card.credit_limit}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Balance</Text>
                <Text style={styles.detailValue}>{card.balance}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>{card.status}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Issued At</Text>
                <Text style={styles.detailValue}>{card.issued_at}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Billing Address</Text>
                <Text style={styles.detailValue}>{card.billing_address}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Reward Points</Text>
                <Text style={styles.detailValue}>{card.reward_points}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Interest Rate</Text>
                <Text style={styles.detailValue}>{card.interest_rate}</Text>
                <View style={styles.divider} />
              </View>
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
    marginTop:70,
    marginBottom:70,
    justifyContent: 'center',
    alignItems: 'center',
  
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
    textAlign: 'center',
    color: '#003D7A',
  },
  detailSection: {
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003D7A',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
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
