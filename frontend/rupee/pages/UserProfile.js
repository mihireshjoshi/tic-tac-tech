import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../supabaseee/supacreds';
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


const UserProfile = () => {
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
        NoTransactions: "कोई लेनदेन नहीं"
    }
  });

  useEffect(() => {
    loadLocalizedData().then((data) => {
      setJsonData(data);
    });
  }, []);
  

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const accountId = await AsyncStorage.getItem('account_id');
      if (accountId) {
        const { data, error } = await supabase
          .from('users_b')
          .select('*')
          .eq('account_id', accountId)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setUserProfile(data);
        }
      }
    } catch (error) {
      console.error('Error fetching account ID:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.errorContainer}>
        <Text>Unable to fetch user profile</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{jsonData.hin.Profile}</Text>
      <View style={styles.profileCard}>
        <View style={styles.profileDetail}>
          <Text style={styles.label}>{jsonData.hin.Email}</Text>
          <Text style={styles.value}>{userProfile.email}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>{jsonData.hin.Phone}</Text>
          <Text style={styles.value}>{userProfile.phone_number || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>{jsonData.hin.first_name}</Text>
          <Text style={styles.value}>{userProfile.first_name || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Last Name:</Text>
          <Text style={styles.value}>{userProfile.last_name || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{userProfile.date_of_birth || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{userProfile.address || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>City:</Text>
          <Text style={styles.value}>{userProfile.city || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>State:</Text>
          <Text style={styles.value}>{userProfile.state || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Country:</Text>
          <Text style={styles.value}>{userProfile.country || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Zip Code:</Text>
          <Text style={styles.value}>{userProfile.zip_code || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Registration Date:</Text>
          <Text style={styles.value}>{new Date(userProfile.registration_date).toDateString()}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Language:</Text>
          <Text style={styles.value}>{userProfile.language || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Balance:</Text>
          <Text style={styles.value}>{userProfile.balance !== null ? `$${userProfile.balance}` : 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Salary:</Text>
          <Text style={styles.value}>{userProfile.salary !== null ? `$${userProfile.salary}` : 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Occupation:</Text>
          <Text style={styles.value}>{userProfile.occupation || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>Account ID:</Text>
          <Text style={styles.value}>{userProfile.account_id || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetail}>
          <Text style={styles.label}>UPI ID:</Text>
          <Text style={styles.value}>{userProfile.upi_id || 'N/A'}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop:25,
    backgroundColor: '#f0f4f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003D7A',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  profileDetail: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003D7A',
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
});

export default UserProfile;
