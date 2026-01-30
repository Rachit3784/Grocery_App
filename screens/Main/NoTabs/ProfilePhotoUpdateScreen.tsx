import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import userStore from '../../../store/MyStore';


const ProfileUploadScreen = () => {
  const [image, setImage] = useState(null);
  const { updateProfilePhoto,  userModelID} = userStore();
const [isUploading , setisUploading] = useState(false);
  const handlePickImage = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true, // Perfect for profile photos
      compressImageQuality: 0.8,
      mediaType: 'photo',
      cropperActiveWidgetColor: '#4CAF50', // Grocery green theme
      cropperToolbarColor: '#4CAF50',
    }).then(selectedImage => {
      setImage(selectedImage.path);
    }).catch(err => {
      if (err.code !== 'E_PICKER_CANCELLED') {
        Alert.alert("Error", "Could not select image");
      }
    });
  };

  const handleUpdate = async () => {
    setisUploading(true)
    if (!image) return Alert.alert("Select Image", "Please pick a photo first");
    
    try {
      await updateProfilePhoto(userModelID, image);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (err) {
      Alert.alert("Upload Error", err.message);
    }finally{
        setisUploading(false)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Photo</Text>
      
      <TouchableOpacity onPress={handlePickImage} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImg} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Tap to Select</Text>
          </View>
        )}
        <View style={styles.cameraIconBadge}>
          <Text style={{ color: '#fff', fontSize: 12 }}>Edit</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, !image && styles.disabledButton]} 
        onPress={handleUpdate}
        disabled={isUploading || !image}
      >
        {isUploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Profile</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#F8F9FB', paddingTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 40, color: '#333' },
  imageContainer: { width: 160, height: 160, borderRadius: 80, backgroundColor: '#E1E1E1', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  profileImg: { width: 160, height: 160, borderRadius: 80 },
  placeholder: { alignItems: 'center' },
  placeholderText: { color: '#888', fontWeight: '600' },
  cameraIconBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#4CAF50', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, borderWidth: 2, borderColor: '#fff' },
  button: { marginTop: 50, backgroundColor: '#4CAF50', width: '80%', padding: 16, borderRadius: 12, alignItems: 'center' },
  disabledButton: { backgroundColor: '#A5D6A7' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' }
});

export default ProfileUploadScreen;