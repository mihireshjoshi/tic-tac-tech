import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import HeaderComponent from '../components/header';
import BottomNavBar from '../components/navBar';
import DocumentCarousel from '../components/DocumentCarousel';
import AddImageComponent from '../components/AddImageComp';

export default function OCR({ navigation }) {
  const [selectedFormType, setSelectedFormType] = useState('Loan Application'); // Default to 'Loan Application'

  return (
    <>
      <SafeAreaView style={styles.container}>
        <HeaderComponent />
        <DocumentCarousel onFormSelect={setSelectedFormType} />
        <AddImageComponent navigation={navigation} selectedFormType={selectedFormType} />
      </SafeAreaView>
      <BottomNavBar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
