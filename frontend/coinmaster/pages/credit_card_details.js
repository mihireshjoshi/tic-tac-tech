// CardDetailsPage.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CardCarousel from '../components/carousel';

const CardDetailsPage = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardSelect = (card) => {
    console.log("Card selected: ", card);
    setSelectedCard(card);
  };

  return (
    <View style={styles.container}>
      <CardCarousel onSelectCard={handleCardSelect} />
      {selectedCard && (
        <ScrollView style={styles.detailsContainer}>
          <Text style={styles.detailTitle}>Card Details</Text>
          <Text style={styles.detailLabel}>Card Number: {selectedCard.card_number}</Text>
          <Text style={styles.detailLabel}>Cardholder Name: {selectedCard.cardholder_name}</Text>
          <Text style={styles.detailLabel}>Expiration Date: {selectedCard.expiration_date}</Text>
          <Text style={styles.detailLabel}>CVV: {selectedCard.cvv}</Text>
          <Text style={styles.detailLabel}>Credit Limit: {selectedCard.credit_limit}</Text>
          <Text style={styles.detailLabel}>Balance: {selectedCard.balance}</Text>
          <Text style={styles.detailLabel}>Status: {selectedCard.status}</Text>
          <Text style={styles.detailLabel}>Issued At: {selectedCard.issued_at}</Text>
          <Text style={styles.detailLabel}>Billing Address: {selectedCard.billing_address}</Text>
          <Text style={styles.detailLabel}>Reward Points: {selectedCard.reward_points}</Text>
          <Text style={styles.detailLabel}>Interest Rate: {selectedCard.interest_rate}</Text>
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
