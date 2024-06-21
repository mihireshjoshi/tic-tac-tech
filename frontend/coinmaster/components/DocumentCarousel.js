import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = width - 40;

const DocumentCarousel = ({ onFormSelect }) => {
  const documentTypes = [
    { id: 1, type: 'Loan Application' },
    { id: 2, type: 'Fixed Deposit' },
    { id: 3, type: 'Credit Card Application' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => onFormSelect(item.type)}>
      <Text style={styles.cardTitle}>{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={documentTypes}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 20}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 10 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  card: {
    width: cardWidth,
    height: 200,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DocumentCarousel;
