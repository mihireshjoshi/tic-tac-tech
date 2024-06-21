// CardCarousel.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseee/supacreds';
import Icon from 'react-native-vector-icons/AntDesign';
import CardFormModal from './CardFormModal';
const { width } = Dimensions.get('window');
const cardWidth = width - 40;

const CardCarousel = ({ onSelectCard }) => {
  console.log("onSelectCard prop: ", onSelectCard); // Add this line

  const [cards, setCards] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      const accountId = await AsyncStorage.getItem('account_id');
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('account_id', accountId);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        const cardsWithIds = data.map((card, index) => ({ ...card, id: card.card_id || index.toString() }));
        setCards(cardsWithIds);
      }
    };

    fetchCards();
  }, []);

  const handleAddCard = (newCard) => {
    const newCardWithId = { ...newCard, id: cards.length.toString() };
    setCards([...cards, newCardWithId]);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onSelectCard(item)}>
      <View style={item.id === 'add-card' ? styles.addCard : styles.card}>
        {item.id === 'add-card' ? (
          <TouchableOpacity style={styles.addCardContent} onPress={() => setModalVisible(true)}>
            <Text style={styles.addCardText}>Add Card</Text>
            <Icon name='plus' size={24} color={'#0B549D'} />
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.cardNumber}>{item.card_number}</Text>
            <View style={styles.cardBottom}>
              <View style={styles.cardHolderContainer}>
                <Text style={styles.cardLabel}>Card Holder</Text>
                <Text style={styles.cardDetail}>{item.cardholder_name}</Text>
              </View>
              <View style={styles.validThruContainer}>
                <Text style={styles.cardLabel}>Valid Thru</Text>
                <Text style={styles.cardDetail}>{item.expiration_date}</Text>
              </View>
              <View style={styles.cvvContainer}>
                <Text style={styles.cardLabel}>CVV</Text>
                <Text style={styles.cardDetail}>{item.cvv}</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[...cards, { id: 'add-card', content: 'Add Card' }]}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 20}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 10 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <CardFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  card: {
    width: cardWidth,
    height: 200,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  addCard: {
    width: cardWidth,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F9FF',
    borderRadius: 10,
    padding: 20,
    borderColor: '#0B549D',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  addCardContent: {
    width: cardWidth,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardLabel: {
    color: '#9F9F9F',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  cardNumber: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: 3,
    textAlign: 'left',
    marginVertical: 30,
  },
  cardBottom: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  cardHolderContainer: {
    flex: 1,
  },
  validThruContainer: {
    flex: 1,
    alignItems: 'center',
  },
  cvvContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 20,
  },
  cardDetail: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  addCardText: {
    color: '#0B549D',
    fontWeight: '500',
    fontSize: 24,
  },
});

export default CardCarousel;
