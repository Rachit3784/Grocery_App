import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, 
  ActivityIndicator, Alert 
} from 'react-native';
import userStore from '../../../store/MyStore';
import { useNavigation } from '@react-navigation/native';


const COLORS = {
  primary: '#064e3b', // Deep Forest Green
  accent: '#059669',
  background: '#ffffff',
  surface: '#f9fafb',
  border: '#f3f4f6',
  textMain: '#111827',
  textMuted: '#6b7280',
};





const EditUserDetailsScreen = () => {
  const { updateDetails , userName , userMobileNum} = userStore();
  const [name, setName] = useState(userName);

  const [mobile, setMobile] = useState(userMobileNum);
  const [isUploading,setisUploading] = useState(false)
   const navigation = useNavigation();
  const handleUpdate = async () => {
    if (!name || !mobile) {
      return Alert.alert("Missing Info", "Please fill in all fields");
    }
    if (mobile.length < 10) {
      return Alert.alert("Invalid Mobile", "Please enter a valid phone number");
    }
setisUploading(true)
    

    try {
      await updateDetails(name, mobile);
      navigation.goBack();
      Alert.alert("Success", "Profile details updated!");
    } catch (err) {
      Alert.alert("Error", err.message);
    }finally{

        setisUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >

    
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <Text style={styles.headerSubtitle}>Keep your contact details up to date</Text>
        </View>

        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
          </View>

          {/* Mobile Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.phoneInputRow}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={[styles.input, { flex: 1, borderLeftWidth: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]}
                placeholder="10 digit mobile number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                maxLength={10}
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleUpdate}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  inner: { flex: 1, padding: 24, justifyContent: 'space-between' },
  header: { marginTop: 40, marginBottom: 30 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  headerSubtitle: { fontSize: 14, color: '#666', marginTop: 8 },
  form: { flex: 1 },
  inputWrapper: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8, marginLeft: 4 },
  input: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  phoneInputRow: { flexDirection: 'row', alignItems: 'center' },
  countryCode: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRightWidth: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#00B159', // Grocery Green
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#00B159',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});

export default EditUserDetailsScreen;