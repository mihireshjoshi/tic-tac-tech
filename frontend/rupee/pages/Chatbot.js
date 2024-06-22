import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';  // Make sure to install expo-av if you haven't already


// const loadLocalizedData = async () => {
//   try {
//     const language = await AsyncStorage.getItem("language");
//     console.log(language);
//     switch (language) {
//       case "Hindi":
//         return require("../assets/assets/Hindi/static.json");
//       case "Marathi":
//         return require("../assets/assets/Marathi/static.json");
//       case "Tamil":
//         return require("../assets/assets/Tamil/static.json");
//       case "English":
//         return require("../assets/assets/English/static.json");
//       case "Bengali":
//         return require("../assets/assets/Bengali/static.json");
//       case "Telugu":
//         return require("../assets/assets/Telugu/static.json");
//       case "Kannada":
//         return require("../assets/assets/Kannada/static.json");
//       case "Punjabi":
//         return require("../assets/assets/Punjabi/static.json");
//       case "Assamese":
//         return require("../assets/assets/Assamese/static.json");
//       case "Gujarati":
//         return require("../assets/assets/Gujarati/static.json");
//       case "Malayalam":
//         return require("../assets/assets/Malayalam/static.json");
//       case "Oriya":
//         return require("../assets/assets/Oriya/static.json");
//       default:
//         return require("../assets/assets/English/static.json"); // default to English if undefined
//     }
//   } catch (error) {
//     console.error("Failed to load the language file", error);
//     return require("../assets/assets/English/static.json"); // default to English on error
//   }
// };

const ChatScreen = () => {
  const [recording, setRecording] = useState();
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [Isshowsplashsscreen, setIsshowsplashsscreen] = useState(false);
//   const [jsonData, setJsonData] = useState({
//     ChatBot: {
//       Back: "Back",
//       HELP: "Help",
//       TypeHere: "Type Here..",
//       PermissionsRequired: "a",
//       PleaseGrantAudioRecordingPermissions: "b",
//       RecrodingFailed: "c",
//       AnErrorOccuredWhileTryingToStartRecording: "d",
//     }
//   });
//   useEffect(() => {
//     // Load the localized data when component mounts
//     loadLocalizedData().then(setJsonData);
//   }, []);
  const navigation = useNavigation();

  const sendMessage = async () => {
    if (messageText.trim()) {
        const language = "English"
        const account_id = await AsyncStorage.getItem("account_id")
        console.log("Account ID is : ", account_id);
        const newMessage = { id: Date.now(), text: messageText, sender: 'user', language: language };
        setMessages([...messages, newMessage]);
        setIsLoading(true);
        setMessageText('');
        console.log(newMessage);
        try {
            const response = await fetch("http://10.20.2.79:8000/chattext", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: newMessage.text, account_id: account_id, language: language }),
            });
            const responseData = await response.json();
            console.log(responseData)
            if (responseData.success) {
                setMessages([...messages, { ...newMessage, id: Date.now() }, { id: Date.now() + 1, text: responseData.message, sender: 'bot' }]);
                console.log(responseData.message);
            } else {
                throw new Error(responseData.message || "Server error");
            }
        } catch (error) {
            console.error('Error fetching response:', error);
            setMessages(prevMessages => [...prevMessages, newMessage, { id: Date.now(), text: 'Error getting response', sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    }
};


//   const handleBack = async () => {
//     navigation.navigate('Dashboard');
//   }

//   const handleAccount = async () => {
//     navigation.navigate('Account');
//   }

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
        setIsListening(true);
      } else {
        Alert.alert(
          jsonData.ChatBot.PermissionsRequired,
          jsonData.ChatBot.PleaseGrantAudioRecordingPermissions
        );
      }
    } catch (err) {
      Alert.alert(
        jsonData.ChatBot.RecrodingFailed,
        jsonData.ChatBot.AnErrorOccuredWhileTryingToStartRecording
      );
    }
  }

  async function stopRecording() {
    try {
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);
      sendAudioToServer(uri);
      setIsListening(false);
    } catch (error) {
      console.error("Stop recording error:", error);
    }
  }

  const sendAudioToServer = async (audioPath) => {
    // const language = await AsyncStorage.getItem('language');
    const language = "English"
    const formData = new FormData();
    formData.append("file", {
      uri: audioPath,
      type: "audio/3gp", // Make sure the MIME type matches the actual file format
      name: "audio.3gp",
    });
    formData.append("language", language);
  
    try {
      // Read the audio file and convert it to a base64 string
    //   const baseUrl = await AsyncStorage.getItem('baseUrl');
      console.log('Sending audio to server with the following formData:', formData);
      
      // Send the base64 string to the backend
      const response = await fetch(`/chat_audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      const data = await response.json();
      console.log('Response from server:', data);
  
      if (data.success) {
        setMessageText(data.message);  // Set the TextInput with the transcribed text
      } else {
        throw new Error(data.message || "Server error");
      }
  
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: 'Error getting response', sender: 'bot' }]);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.containkeyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 2} // Adjust this value if needed
    >
      {/* Header */}
      <View style={styles.container}>
        {/* <View style={styles.header}>
          {/* <View style={styles.backLogo}>
            <TouchableOpacity style={styles.back_view} onPress={handleBack}>
              <Image source={BackIcon} style={styles.back_icon} />
            </TouchableOpacity>
            <Image source={AppIcon} style={styles.app_icon} />
          </View> 
          <View style={styles.helpSection}>
            <SignOut />
            <View style={styles.chat_icon_container}>
              <Image source={ChatIcon} style={styles.chat_icon} />
            </View>
          </View>
        </View> */}

        {/* Main message panel */}
        <ScrollView style={styles.messagesContainer}>
            {messages.map((msg, index) => (
                <View key={`${msg.id}-${index}`} style={[styles.message, msg.sender === 'user' ? styles.userMessage : styles.botMessage]}>
                    <Text style={[styles.messageText, msg.sender === 'user' ? styles.userMessageText : styles.botMessageText]}>{msg.text}</Text>
                </View>
            ))}
            {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
        </ScrollView>


        {/* Input Box */}
        <View style={styles.inpCont}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={messageText}
              onChangeText={setMessageText}
              placeholder={"ho"}
            />
            <TouchableOpacity style={styles.audioButton} onPress={isListening ? stopRecording : startRecording}>
              <Icon source={isListening ? "stop" : "microphone"} size={26} style={styles.icon}></Icon>
            </TouchableOpacity>
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Icon source="send" size={26} style={styles.icon}></Icon>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  containkeyboard:{
    flex: 1,
  },
  container: {
    flex: 1,
    // paddingTop: 20
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 52,
    padding: 12,
    borderBottomColor: "#B6B6B6",
    borderBottomWidth: 0.5,
    backgroundColor: "white",
    elevation: 18,
    zIndex: 999
  },
  back_view:{
    // paddingTop: 36,
    // paddingBottom: 4,
    paddingLeft: 4, 
    backgroundColor: "white",
    zIndex: 9999999
  },
  back_icon: {
    width: 10,
    height: 20
  },
  app_icon:{
    height: 45,
    width: 65
  },
  backLogo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
  chat_icon:{
    width: 28.83,
    height: 24,
    marginLeft: 4
  },
  chat_icon_container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#E8EEF3"
  },
  back: {
    flexDirection: "row",
    alignItems: "center"
  },
  backTxt: {
    paddingHorizontal: 6,
    fontSize: 18,
    fontWeight: "500",
    // fontFamily: "Inter-Medium",
    color: "#224c6a",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    textAlign: "left",
  },
  helpSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  helpButton: {
    backgroundColor: "green",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
  },
  helpText: {
    color: "white",
    fontSize: 16,
  },
  account: {
    marginLeft: 12,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 14,
    backgroundColor: "#E7ECEF",
  },
  message: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 6,
    maxWidth: '80%',
  },
  userMessage: {
    // backgroundColor: '#add8e6',
    alignSelf: 'flex-end',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 30,
    backgroundColor: "#fff",
    // flex: 1,
    // width: "100%",
    flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center",
    paddingHorizontal: 18,
    // paddingVertical: 16
  },
  botMessage: {
    // backgroundColor: '#90ee90',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 2,
    backgroundColor: "#002e4f",
    flex: 1,
    // width: "100%",
    flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center",
    paddingHorizontal: 18,
    // paddingVertical: 12
  },
  userMessageText: {
    fontSize: 16,
    fontWeight: "500",
    // fontFamily: "Inter-Medium",
    color: "#002e4f",
    textAlign: "left"
  },
  botMessageText: {
    fontSize: 16,
    fontWeight: "500",
    // fontFamily: "Inter-Medium",
    color: "#fff",
    textAlign: "left",
  },
  inpCont: {
    backgroundColor: "#E7ECEF",
    
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 14,
    borderRadius: 40,
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.45)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    zIndex: 99999999999,
    elevation: 4
  },
  input: {
    flex: 1,
    // height: 40,
    // paddingHorizontal: 2,
    paddingLeft: 14,
    paddingVertical: 14
  },
  sendButton: {
    padding: 10,
  },
  icon: {
    color: "#002E4F"
  }
});

export default ChatScreen;
