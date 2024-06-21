// CardDetailsPage.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CardCarousel from '../components/carousel';


const CardDetailsPage = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  return (
    <View style={styles.container}>
      <CardCarousel onSelectCard={handleCardSelect} />
      {selectedCard && (
        <ScrollView style={styles.detailsContainer}>
          <Text style={styles.detailTitle}>Card Details</Text>
          <Text style={styles.detailLabel}>Card Number: {selectedCard.cardNumber}</Text>
          <Text style={styles.detailLabel}>Cardholder Name: {selectedCard.cardholderName}</Text>
          <Text style={styles.detailLabel}>Expiration Date: {selectedCard.expirationDate}</Text>
          <Text style={styles.detailLabel}>CVV: {selectedCard.cvv}</Text>
          <Text style={styles.detailLabel}>Credit Limit: {selectedCard.creditLimit}</Text>
          <Text style={styles.detailLabel}>Balance: {selectedCard.balance}</Text>
          <Text style={styles.detailLabel}>Status: {selectedCard.status}</Text>
          <Text style={styles.detailLabel}>Issued At: {selectedCard.issuedAt}</Text>
          <Text style={styles.detailLabel}>Billing Address: {selectedCard.billingAddress}</Text>
          <Text style={styles.detailLabel}>Reward Points: {selectedCard.rewardPoints}</Text>
          <Text style={styles.detailLabel}>Interest Rate: {selectedCard.interestRate}</Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
});

export default CardDetailsPage;
