import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNavBar from '../components/navBar';
import TransComponent from '../components/transactions';
import PaymentOptions from '../components/pay';
import Invests from '../components/investments';
import HeaderComponent from '../components/header';
import CardCarousel from '../components/carousel';
import Documents from '../components/docs';

export default function Home({ navigation }) {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <HeaderComponent />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <CardCarousel />
          <TransComponent navigation={navigation} />
          <PaymentOptions />
          <Invests />
          <Documents navigation={navigation} />
        </ScrollView>
      </SafeAreaView>
      <BottomNavBar style={styles.nav} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  nav: {},
});
