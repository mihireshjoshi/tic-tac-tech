import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



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


const CardDetailsModal = ({ visible, onClose, card }) => {
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
  



  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.detailsModalContainer}>
        <View style={styles.detailsModalContent}>
          <Text style={styles.detailTitle}>{jsonData.hin.CardDetails}</Text>
          {card && (
            <ScrollView style={styles.detailsContainer}>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>{jsonData.hin.CardNumber}</Text>
                <Text style={styles.detailValue}>{card.card_number}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>{jsonData.hin.CardholderName}</Text>
                <Text style={styles.detailValue}>{card.cardholder_name}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>{jsonData.hin.ExpirationDate}</Text>
                <Text style={styles.detailValue}>{card.expiration_date}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>{jsonData.hin.CVV}</Text>
                <Text style={styles.detailValue}>{card.cvv}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>{jsonData.hin.CreditLimit}</Text>
                <Text style={styles.detailValue}>{card.credit_limit}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>{jsonData.hin.Balance}</Text>
                <Text style={styles.detailValue}>{card.balance}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>{jsonData.hin.Status}</Text>
                <Text style={styles.detailValue}>{card.status}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>{jsonData.hin.IssuedAt}</Text>
                <Text style={styles.detailValue}>{card.issued_at}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>{jsonData.hin.BillingAddress}</Text>
                <Text style={styles.detailValue}>{card.billing_address}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>{jsonData.hin.RewardPoints}</Text>
                <Text style={styles.detailValue}>{card.reward_points}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>{jsonData.hin.InterestRate}</Text>
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
