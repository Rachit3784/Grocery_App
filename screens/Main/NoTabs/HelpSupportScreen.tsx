import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ChevronLeft, Send, Headphones, MessageSquare, Sparkles, Bot } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const SUGGESTED_CHIPS = [
  "Order Status", 
  "Refund Issue", 
  "Wallet Top-up", 
  "Missing Items", 
  "Payment Failed"
];

const HelpSupportScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi Rachit! 👋 I am your personal assistant. How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  const handleChipPress = (chip) => {
    // Add user message
    const userMsg = { id: Date.now(), type: 'user', text: chip };
    setMessages(prev => [...prev, userMsg]);

    // Simulate Bot Response
    setTimeout(() => {
      const botMsg = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: `Got it! Checking details for your "${chip}" request... Please wait a moment.` 
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* --- MINI HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <ChevronLeft size={20} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.botIconSmall}>
            <Bot size={14} color="#2563EB" />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.headerTitle}>Support Assistant</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.callBtn}>
          <Headphones size={18} color="#059669" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          style={styles.chatArea}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Chat Bubbles */}
          {messages.map((msg) => (
            <View 
              key={msg.id} 
              style={[
                styles.messageWrapper, 
                msg.type === 'user' ? styles.userWrapper : styles.botWrapper
              ]}
            >
              {msg.type === 'bot' && (
                <View style={styles.botAvatar}>
                  <Bot size={12} color="#FFF" />
                </View>
              )}
              <View style={[
                styles.bubble, 
                msg.type === 'user' ? styles.userBubble : styles.botBubble
              ]}>
                <Text style={[
                  styles.messageText, 
                  msg.type === 'user' ? styles.userText : styles.botText
                ]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* --- DYNAMIC AUTO-SELECT CHIPS --- */}
        <View style={styles.chipSection}>
          <View style={styles.suggestHeader}>
             <Sparkles size={12} color="#2563EB" />
             <Text style={styles.suggestTitle}>SUGGESTED FOR YOU</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {SUGGESTED_CHIPS.map((chip, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.chip}
                onPress={() => handleChipPress(chip)}
              >
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- INPUT BAR --- */}
        <View style={styles.inputBar}>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity 
              style={[styles.sendBtn, { backgroundColor: inputText ? '#2563EB' : '#F3F4F6' }]}
              disabled={!inputText}
              onPress={() => {
                handleChipPress(inputText);
                setInputText('');
              }}
            >
              <Send size={18} color={inputText ? "#FFF" : "#9CA3AF"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop :38,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  botIconSmall: { width: 28, height: 28, borderRadius: 10, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 13, fontWeight: '800', color: '#1F2937' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 4 },
  onlineText: { fontSize: 10, fontWeight: '700', color: '#059669', textTransform: 'uppercase' },
  callBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F9F1', justifyContent: 'center', alignItems: 'center' },
  
  chatArea: { flex: 1, padding: 16 },
  messageWrapper: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  userWrapper: { justifyContent: 'flex-end' },
  botWrapper: { justifyContent: 'flex-start' },
  botAvatar: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', marginRight: 8, marginBottom: 4 },
  
  bubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  botBubble: { backgroundColor: '#F3F4F6', borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: '#2563EB', borderBottomRightRadius: 4 },
  messageText: { fontSize: 13, lineHeight: 18 },
  botText: { color: '#374151', fontWeight: '500' },
  userText: { color: '#FFFFFF', fontWeight: '500' },

  chipSection: { paddingVertical: 12, backgroundColor: '#FFF' },
  suggestHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 },
  suggestTitle: { fontSize: 10, fontWeight: '800', color: '#6B7280', marginLeft: 6, letterSpacing: 0.5 },
  chipScroll: { paddingHorizontal: 16 },
  chip: { 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 20, 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#DBEAFE', 
    marginRight: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1
  },
  chipText: { fontSize: 11, fontWeight: '700', color: '#2563EB' },

  inputBar: { padding: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', backgroundColor: '#FFF' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9FAFB', 
    borderRadius: 25, 
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  textInput: { flex: 1, height: 45, fontSize: 13, color: '#1F2937' },
  sendBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }
});

export default HelpSupportScreen;