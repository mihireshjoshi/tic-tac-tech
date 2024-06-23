import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseee/supacreds';
import CardDetailsModal from './creditCardModal';

const { width } = Dimensions.get('window');
const cardWidth = width - 40;

const loadLocalizedData = async () => {
  try {
    const language = await AsyncStorage.getItem("language");
    console.log(language);
    switch (language) {
      case "Hindi":
        return require("../assets/languages/hindi.json");
      case "Marathi":
        return require("../assets/languages/marathi.json");
      case "English":
        return require("../assets/languages/english.json");
      default:
        return require("../assets/languages/english.json"); // default to English if undefined
    }
  } catch (error) {
    console.error("Failed to load the language file", error);
    return require("../assets/languages/english.json"); // default to English on error
  }
};

const CardCarousel = () => {
  const [jsonData, setJsonData] = useState({
    hin:{
      AddImage: "छवि जोड़ें",
        Camera: "कैमरा",
        Gallery: "गैलरी",
        Cancel: "रद्द करें",
        Next: "अगला",
        PleaseAddImage: "कृपया आगे बढ़ने से पहले एक छवि जोड़ें",
        CameraPermission: "क्षमा करें, हमें कैमरा अनुमतियों की आवश्यकता है",
        MediaLibraryPermission: "क्षमा करें, हमें मीडिया लाइब्रेरी अनुमतियों की आवश्यकता है",
        AddCardDetails: "कार्ड विवरण जोड़ें",
        CardNumber: "कार्ड नंबर",
        CardholderName: "कार्डधारक का नाम",
        ExpirationDate: "समाप्ति की तारीख",
        CVV: "सीवीवी",
        CreditLimit: "क्रेडिट लिमिट",
        Balance: "शेष राशि",
        Status: "स्थिति",
        IssuedAt: "जारी किया गया",
        BillingAddress: "बिलिंग पता",
        RewardPoints: "इनाम अंक",
        InterestRate: "ब्याज दर",
        AddCard: "कार्ड जोड़ें",
        CardHolder: "कार्ड धारक",
        ValidThru: "वैध तक",
        CreditCardApplication: "क्रेडिट कार्ड आवेदन",
        FullName: "पूरा नाम",
        DateOfBirth: "जन्म तिथि",
        Address: "पता",
        AnnualIncome: "वार्षिक आय",
        EmploymentStatus: "रोजगार स्थिति",
        BankName: "बैंक का नाम",
        ExistingCreditCardNumber: "मौजूदा क्रेडिट कार्ड नंबर (यदि कोई हो)",
        PreferredCreditLimit: "प्राथमिकता क्रेडिट लिमिट",
        Investments: "निवेश",
        crypto: "क्रिप्टो",
        stocks: "शेयर",
        bonds: "बॉन्ड्स",
        properties: "सम्पत्तियाँ",
        CardDetails: "कार्ड विवरण",
        Close: "बंद करें",
        LoanApplication: "ऋण आवेदन",
        FixedDeposit: "सावधि जमा",
        AddImageComp: "छवि जोड़ें",
        CreditCardApplicationForm: "क्रेडिट कार्ड आवेदन",
        Notification: "सूचना क्लिक की",
        Profile: "प्रोफ़ाइल क्लिक की",
        Logo: "लोगो",
        QRCode: "क्यूआर कोड",
        account_id: "खाता आईडी",
        bitcoin: "बिटकॉइन",
        linechart: "लाइन चार्ट",
        LoanAmount: "ऋण राशि",
        LoanTenure: "ऋण अवधि (वर्षों में)",
        PurposeOfLoan: "ऋण का उद्देश्य",
        Home: "घर",
        Chatbot: "चैटबॉट",
        QRCode: "क्यूआर कोड",
        Card: "कार्ड",
        Profile: "प्रोफ़ाइल",
        homePressed: "होम दबाया गया",
        chatbotPressed: "चैटबॉट दबाया गया",
        qrscanPressed: "क्यूआर स्कैन दबाया गया",
        cardPressed: "कार्ड दबाया गया",
        profilePressed: "प्रोफ़ाइल दबाया गया",
        EnterPassword: "पासवर्ड दर्ज करें",
        Password: "पासवर्ड",
        Submit: "जमा करें",
        MakePayment: "भुगतान करें",
        QR: "क्यूआर",
        Account: "खाता",
        UPI: "यूपीआई",
        Cards: "कार्ड",
        PayViaQR: "क्यूआर द्वारा भुगतान करें",
        PayViaAccount: "खाते द्वारा भुगतान करें",
        PayViaUPI: "यूपीआई द्वारा भुगतान करें",
        PayViaCards: "कार्ड द्वारा भुगतान करें",
        PickAnImageFromGallery: "गैलरी से छवि चुनें",
        TakeAPicture: "तस्वीर क्लिक करें",
        NoImage: "कोई छवि नहीं",
        UploadImage: "छवि अपलोड करें",
        CameraPermissionRequired: "कैमरा अनुमतियाँ आवश्यक हैं",
        UploadSuccessful: "अपलोड सफल रहा",
        UploadFailed: "अपलोड असफल रहा",
        Close: "बंद करें",
        Person: "व्यक्ति",
        Amount: "राशि",
        DateTime: "तारीख और समय",
        AccountNumber: "खाता संख्या",
        AvailableBalance: "उपलब्ध शेष राशि",
        ViewTransactions: "लेनदेन देखें",
        Balance: "शेष राशि",
        NoImageSelected: "कोई छवि चयनित नहीं",
        Apply: "आवेदन करें",
        Documents: "दस्तावेज़",
        Email: "ईमेल",
        Login: "लॉग इन करें",
        LoginFailed: "लॉगिन विफल",
        Failure: "असफल",
        LoginSuccess: "लॉगिन सफल",
        EnterAccountNumber: "खाता संख्या दर्ज करें",
        EnterAmount: "राशि दर्ज करें",
        Pay: "भुगतान करें",
        AmountTransferred: "राशि सफलतापूर्वक स्थानांतरित!",
        ReceiverDetails: "प्राप्तकर्ता का विवरण",
        Username: "उपयोगकर्ता नाम",
        UPIID: "यूपीआई आईडी",
        NoAccessToCameraOrGallery: "कैमरा या गैलरी तक पहुंच नहीं",
        Capture: "कैप्चर करें",
        FromGalleryOptions: "गैलरी विकल्पों से",
        OpenCamera: "कैमरा खोलें",
        PermissionError: "अनुमति त्रुटि",
        GalleryError: "गैलरी त्रुटि",
        CameraError: "कैमरा त्रुटि",
        FailedToGetPermissions: "अनुमतियाँ प्राप्त करने में विफल",
        FailedToOpenGallery: "गैलरी खोलने में विफल",
        FailedToCapturePhoto: "फोटो कैप्चर करने में विफल",
        Back: "वापस",
        RecentTransactions: "हाल के लेनदेन",
        NoTransactions: "कोई लेनदेन नहीं",
        FirstName: "पहला नाम",
    LastName: "अंतिम नाम",
    DateOfBirth: "जन्म तिथि",
    Address: "पता",
    City: "शहर",
    State: "राज्य",
    Country: "देश",
    ZipCode: "पिन कोड",
    RegistrationDate: "पंजीकरण तिथि",
    Language: "भाषा",
    Balance: "शेष राशि",
    Salary: "वेतन",
    Occupation: "पेशा",
    AccountID: "खाता आईडी",
    UPIID: "यूपीआई आईडी"
    }
  });

  useEffect(() => {
    loadLocalizedData().then((data) => {
      setJsonData(data);
    });
  }, []);
  



  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

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

  const handleCardClick = async (card) => {
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('account_id', card.account_id)
      .eq('card_number', card.card_number)
      .single();

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setSelectedCard(data);
      setDetailsModalVisible(true);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardClick(item)}>
      <View style={styles.card}>
        <Image source={require('../assets/lamp.png')} style={styles.logo} />
        <Text style={styles.cardNumber}>{item.card_number}</Text>
        <View style={styles.cardBottom}>
          <View style={styles.cardHolderContainer}>
            <Text style={styles.cardLabel}>{jsonData.hin.CardHolder}</Text>
            <Text style={styles.cardDetail}>{item.cardholder_name}</Text>
          </View>
          <View style={styles.validThruContainer}>
            <Text style={styles.cardLabel}>{jsonData.hin.ValidThru}</Text>
            <Text style={styles.cardDetail}>{item.expiration_date}</Text>
          </View>
          <View style={styles.cvvContainer}>
            <Text style={styles.cardLabel}>{jsonData.hin.CVV}</Text>
            <Text style={styles.cardDetail}>{item.cvv}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 20}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 10 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <CardDetailsModal
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        card={selectedCard}
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
  logo: {
    position: 'absolute',
    top: 10,
    right: 15,
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardLabel: {
    color: '#9F9F9F',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  cardNumber: {
    color: '#fff',
    fontSize: 16,
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
    fontSize: 13,
    marginTop: 5,
  },
});

export default CardCarousel;
