// CardFormModal.js
import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseee/supacreds';

const CardFormModal = ({ visible, onClose, onSubmit }) => {
  const [cardDetails, setCardDetails] = useState({
    card_number: '',
    cardholder_name: '',
    expiration_date: '',
    cvv: '',
    credit_limit: '',
    balance: '',
    status: '',
    issued_at: '',
    billing_address: '',
    reward_points: '',
    interest_rate: '',
  });

  const handleAddCard = async () => {
    const accountId = await AsyncStorage.getItem('account_id');
    const newCard = {
      ...cardDetails,
      account_id: accountId,
    };

    const { data, error } = await supabase
      .from('credit_cards')
      .insert([newCard]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      onSubmit(cardDetails);
      setCardDetails({
        card_number: '',
        cardholder_name: '',
        expiration_date: '',
        cvv: '',
        credit_limit: '',
        balance: '',
        status: '',
        issued_at: '',
        billing_address: '',
        reward_points: '',
        interest_rate: '',
      });
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Card Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            value={cardDetails.card_number}
            onChangeText={(text) => setCardDetails({ ...cardDetails, card_number: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Cardholder Name"
            value={cardDetails.cardholder_name}
            onChangeText={(text) => setCardDetails({ ...cardDetails, cardholder_name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Expiration Date"
            value={cardDetails.expiration_date}
            onChangeText={(text) => setCardDetails({ ...cardDetails, expiration_date: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="CVV"
            value={cardDetails.cvv}
            onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Credit Limit"
            value={cardDetails.credit_limit}
            onChangeText={(text) => setCardDetails({ ...cardDetails, credit_limit: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Balance"
            value={cardDetails.balance}
            onChangeText={(text) => setCardDetails({ ...cardDetails, balance: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Status"
            value={cardDetails.status}
            onChangeText={(text) => setCardDetails({ ...cardDetails, status: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Issued At"
            value={cardDetails.issued_at}
            onChangeText={(text) => setCardDetails({ ...cardDetails, issued_at: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Billing Address"
            value={cardDetails.billing_address}
            onChangeText={(text) => setCardDetails({ ...cardDetails, billing_address: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Reward Points"
            value={cardDetails.reward_points}
            onChangeText={(text) => setCardDetails({ ...cardDetails, reward_points: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Interest Rate"
            value={cardDetails.interest_rate}
            onChangeText={(text) => setCardDetails({ ...cardDetails, interest_rate: text })}
          />
          <View style={styles.buttons}>
            <TouchableOpacity onPress={handleAddCard} style={styles.modalBtn}>
              <Text style={styles.add_card}>Add Card</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.modalBtnCan}>
              <Text style={styles.add_card}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  add_card: {
    color: '#fff',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  modalBtn: {
    backgroundColor: '#003D7A',
    borderRadius: 10,
  },
  modalBtnCan: {
    backgroundColor: '#B70000',
    borderRadius: 10,
  },
});

export default CardFormModal;
