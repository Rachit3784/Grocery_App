// // screens/auth/SignupScreen.js
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   Alert,
//   TextInput,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   withSequence,
//   withSpring,
// } from 'react-native-reanimated';
// import { useNavigation } from '@react-navigation/native';
// import userStore from '../../store/MyStore';
// import { Mail, User, Lock, Hash } from 'lucide-react-native';

// // --- Premium Color Palette ---
// const COLORS = {
//   primary: '#007AFF',
//   primaryDark: '#0051D5',
//   secondary: '#FF9500',
//   background: '#FFFFFF',
//   backgroundSecondary: '#F2F2F7',
//   textDark: '#000000',
//   textMedium: '#8E8E93',
//   textLight: '#C7C7CC',
//   border: '#E5E5EA',
//   borderFocus: '#007AFF',
//   error: '#FF3B30',
//   errorLight: '#FFEBEA',
//   success: '#34C759',
//   white: '#FFFFFF',
// };

// const SPACING = {
//   xs: 8,
//   sm: 12,
//   md: 16,
//   lg: 20,
//   xl: 24,
//   xxl: 32,
// };

// /* ==================== FLOATING INPUT COMPONENT ==================== */

// const FloatingInput = ({ 
//   label, 
//   value, 
//   onChangeText, 
//   error, 
//   secure, 
//   keyboardType, 
//   icon: Icon,
//   ...props 
// }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const translateY = useSharedValue(0);
//   const scale = useSharedValue(1);
//   const shakeX = useSharedValue(0);

//   const animatedLabelStyle = useAnimatedStyle(() => ({
//     transform: [
//       { translateY: translateY.value },
//       { scale: scale.value },
//       { translateX: -8 * (1 - scale.value) }
//     ],
//   }));

//   const animatedContainerStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: shakeX.value }],
//   }));

//   React.useEffect(() => {
//     const shouldFloat = isFocused || value;
//     translateY.value = withSpring(shouldFloat ? -28 : 0, {
//       damping: 15,
//       stiffness: 150,
//     });
//     scale.value = withSpring(shouldFloat ? 0.75 : 1, {
//       damping: 15,
//       stiffness: 150,
//     });
//   }, [isFocused, value]);

//   React.useEffect(() => {
//     if (error) {
//       shakeX.value = withSequence(
//         withTiming(-8, { duration: 50 }),
//         withTiming(8, { duration: 50 }),
//         withTiming(-8, { duration: 50 }),
//         withTiming(8, { duration: 50 }),
//         withTiming(0, { duration: 50 })
//       );
//     }
//   }, [error]);

//   const getBorderColor = () => {
//     if (error) return COLORS.error;
//     if (isFocused) return COLORS.borderFocus;
//     return COLORS.border;
//   };

//   const getBackgroundColor = () => {
//     if (error) return COLORS.errorLight;
//     return COLORS.white;
//   };

//   return (
//     <Animated.View style={[floatingInputStyles.container, animatedContainerStyle]}>
//       <Animated.View
//         style={[
//           floatingInputStyles.labelContainer,
//           animatedLabelStyle,
//         ]}
//       >
//         <Text
//           style={[
//             floatingInputStyles.label,
//             {
//               color: error
//                 ? COLORS.error
//                 : isFocused || value
//                 ? COLORS.primary
//                 : COLORS.textMedium,
//             },
//           ]}
//         >
//           {label}
//         </Text>
//       </Animated.View>

//       <View
//         style={[
//           floatingInputStyles.inputWrapper,
//           {
//             borderColor: getBorderColor(),
//             backgroundColor: getBackgroundColor(),
//             borderWidth: isFocused ? 2 : 1.5,
//           },
//         ]}
//       >
//         {Icon && (
//           <Icon
//             size={20}
//             color={
//               error
//                 ? COLORS.error
//                 : isFocused
//                 ? COLORS.primary
//                 : COLORS.textMedium
//             }
//             style={floatingInputStyles.icon}
//           />
//         )}
//         <TextInput
//           value={value}
//           onChangeText={onChangeText}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//           secureTextEntry={secure}
//           keyboardType={keyboardType}
//           placeholderTextColor={COLORS.textLight}
//           style={floatingInputStyles.input}
//           {...props}
//         />
//       </View>

//       {error && (
//         <View style={floatingInputStyles.errorContainer}>
//           <Text style={floatingInputStyles.errorText}>⚠ {error}</Text>
//         </View>
//       )}
//     </Animated.View>
//   );
// };

// /* ==================== SIGNUP SCREEN ==================== */

// export default function SignupScreen() {
//   const navigation = useNavigation();
//   const { createUser } = userStore();

//   const [form, setForm] = useState({
//     email: '',
//     username: '',
//     fullname: '',
//     password: '',
//     gender: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const handleChange = (name, text) => {
//     setForm((prev) => ({ ...prev, [name]: text }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const validate = () => {
//     let err = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!form.email.trim()) {
//       err.email = 'Email is required';
//     } else if (!emailRegex.test(form.email)) {
//       err.email = 'Please enter a valid email';
//     }

//     if (!form.username.trim()) {
//       err.username = 'Username is required';
//     } else if (form.username.length < 3) {
//       err.username = 'Username must be at least 3 characters';
//     }

//     if (!form.fullname.trim()) {
//       err.fullname = 'Full name is required';
//     }

//     if (!form.password) {
//       err.password = 'Password is required';
//     } else if (form.password.length < 6) {
//       err.password = 'Password must be at least 6 characters';
//     }

//     if (!form.gender) {
//       err.gender = 'Please select your gender';
//     }

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   const handleSignup = async () => {
//     if (!validate()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await createUser(form);

//       if (res?.success) {
//         console.log(res.success)
//         console.log("Passed")
//         setLoading(false);
//        navigation.navigate('OTP', {
//   email: form.email,
//   username: form.username,
//   fullname: form.fullname,
//   password: form.password,
//   gender: form.gender,  
//   type: 'SignUP'
// });
//       } else {
//         setLoading(false);
//         Alert.alert(
//           'Signup Failed',
//           res?.message || 'Unable to create account. Please try again.',
//           [{ text: 'OK' }]
//         );
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error('Signup error:', error);
//       Alert.alert(
//         'Network Error',
//         'Could not connect to the server. Please check your internet connection and try again.',
//         [{ text: 'OK' }]
//       );
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollViewContent}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Header Section */}
//           <View style={styles.header}>
//             <Text style={styles.welcomeText}>Create Account</Text>
//             <Text style={styles.tagline}>
//               Start your journey to limitless possibilities
//             </Text>
//           </View>

//           {/* Form Inputs */}
//           <View style={styles.formContainer}>
//             <FloatingInput
//               label="Email Address"
//               value={form.email}
//               onChangeText={(t) => handleChange('email', t)}
//               error={errors.email}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               autoCorrect={false}
//               icon={Mail}
//             />

//             <FloatingInput
//               label="Username"
//               value={form.username}
//               onChangeText={(t) => handleChange('username', t)}
//               error={errors.username}
//               autoCapitalize="none"
//               autoCorrect={false}
//               icon={User}
//             />

//             <FloatingInput
//               label="Full Name"
//               value={form.fullname}
//               onChangeText={(t) => handleChange('fullname', t)}
//               error={errors.fullname}
//               autoCapitalize="words"
//               icon={Hash}
//             />

//             <FloatingInput
//               label="Password"
//               value={form.password}
//               onChangeText={(t) => handleChange('password', t)}
//               error={errors.password}
//               secureTextEntry={true}
//               autoCapitalize="none"
//               autoCorrect={false}
//               icon={Lock}
//             />

//             {/* Gender Selector */}
//             <View style={styles.genderSection}>
//               <Text
//                 style={[
//                   styles.genderLabel,
//                   errors.gender && { color: COLORS.error },
//                 ]}
//               >
//                 Gender
//               </Text>
//               <View style={styles.genderContainer}>
//                 {['Male', 'Female', 'Other'].map((g) => (
//                   <TouchableOpacity
//                     key={g}
//                     onPress={() => handleChange('gender', g)}
//                     activeOpacity={0.7}
//                     style={[
//                       styles.genderChip,
//                       form.gender === g && styles.genderChipSelected,
//                       errors.gender && styles.genderChipError,
//                     ]}
//                   >
//                     <Text
//                       style={[
//                         styles.genderText,
//                         form.gender === g && styles.genderTextSelected,
//                       ]}
//                     >
//                       {g}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//               {errors.gender && (
//                 <Text style={styles.genderError}>⚠ {errors.gender}</Text>
//               )}
//             </View>

//             {/* Sign Up Button */}
//             <TouchableOpacity
//               onPress={handleSignup}
//               disabled={loading}
//               activeOpacity={0.8}
//               style={[
//                 styles.signupButton,
//                 loading && styles.signupButtonDisabled,
//               ]}
//             >
//               {loading ? (
//                 <ActivityIndicator color={COLORS.white} size="small" />
//               ) : (
//                 <Text style={styles.signupButtonText}>Sign Up</Text>
//               )}
//             </TouchableOpacity>

//             {/* Login Link */}
//             <View style={styles.loginLinkContainer}>
//               <Text style={styles.loginLinkText}>
//                 Already have an account?{' '}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => navigation.replace('login')}
//                 activeOpacity={0.7}
//               >
//                 <Text style={styles.loginLinkTextBold}>Log In</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// /* ==================== STYLES ==================== */

// const floatingInputStyles = StyleSheet.create({
//   container: {
//     marginBottom: SPACING.xl,
//     position: 'relative',
//   },
//   labelContainer: {
//     position: 'absolute',
//     left: 12,
//     top: 16,
//     backgroundColor: COLORS.white,
//     paddingHorizontal: 4,
//     zIndex: 10,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 12,
//     paddingHorizontal: SPACING.md,
//     height: 52,
//     shadowColor: COLORS.textDark,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   icon: {
//     marginRight: SPACING.sm,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: COLORS.textDark,
//     fontWeight: '500',
//     paddingVertical: 0,
//     height: '100%',
//   },
//   errorContainer: {
//     marginTop: 6,
//     marginLeft: SPACING.md,
//   },
//   errorText: {
//     color: COLORS.error,
//     fontSize: 13,
//     fontWeight: '500',
//   },
// });

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   scrollViewContent: {
//     paddingHorizontal: SPACING.lg,
//     paddingTop: SPACING.xxl,
//     paddingBottom: SPACING.xl,
//   },

//   // Header Styles
//   header: {
//     marginBottom: SPACING.xxl + SPACING.md,
//   },
//   welcomeText: {
//     fontSize: 36,
//     fontWeight: '800',
//     color: COLORS.textDark,
//     marginBottom: SPACING.xs,
//     letterSpacing: -0.5,
//   },
//   tagline: {
//     fontSize: 16,
//     color: COLORS.textMedium,
//     fontWeight: '400',
//     lineHeight: 22,
//   },

//   // Form Container
//   formContainer: {
//     marginTop: SPACING.sm,
//   },

//   // Gender Selector Styles
//   genderSection: {
//     marginBottom: SPACING.xl,
//   },
//   genderLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.textDark,
//     marginBottom: SPACING.sm,
//     marginLeft: 2,
//   },
//   genderContainer: {
//     flexDirection: 'row',
//     gap: SPACING.sm,
//   },
//   genderChip: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     borderWidth: 1.5,
//     borderColor: COLORS.border,
//     backgroundColor: COLORS.white,
//   },
//   genderChipSelected: {
//     backgroundColor: COLORS.textDark,
//     borderColor: COLORS.textDark,
//   },
//   genderChipError: {
//     borderColor: COLORS.error,
//   },
//   genderText: {
//     color: COLORS.textDark,
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   genderTextSelected: {
//     color: COLORS.white,
//   },
//   genderError: {
//     color: COLORS.error,
//     fontSize: 13,
//     fontWeight: '500',
//     marginTop: 6,
//     marginLeft: SPACING.md,
//   },

//   // Button Styles
//   signupButton: {
//     backgroundColor: COLORS.textDark,
//     padding: SPACING.md,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 56,
//     shadowColor: COLORS.textDark,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//     marginTop: SPACING.sm,
//   },
//   signupButtonDisabled: {
//     backgroundColor: COLORS.textMedium,
//     shadowOpacity: 0,
//     elevation: 0,
//   },
//   signupButtonText: {
//     color: COLORS.white,
//     fontSize: 17,
//     fontWeight: '700',
//     letterSpacing: 0.3,
//   },

//   // Link Styles
//   loginLinkContainer: {
//     flexDirection: 'row',
//     marginTop: SPACING.xl,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   loginLinkText: {
//     color: COLORS.textMedium,
//     fontSize: 15,
//     fontWeight: '500',
//   },
//   loginLinkTextBold: {
//     fontWeight: '700',
//     color: COLORS.primary,
//     fontSize: 15,
//   },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Mail, User, Lock, Hash, ShoppingBasket, ChevronRight } from 'lucide-react-native';
import userStore from '../../store/MyStore';

const COLORS = {
  primary: '#10B981',      // Professional Emerald Green
  primaryLight: '#ECFDF5', 
  background: '#FFFFFF',
  textDark: '#111827',     // Slate Dark
  textMedium: '#4B5563',   // Gray 600
  textLight: '#9CA3AF',    // Gray 400
  border: '#E5E7EB',       // Gray 200
  error: '#EF4444',
  white: '#FFFFFF',
};

/* ==================== PROFESSIONAL OUTLINED INPUT ==================== */

const BorderLabelInput = ({ 
  label, 
  value, 
  onChangeText, 
  error, 
  secure, 
  keyboardType, 
  icon: Icon,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={inputStyles.container}>
      {/* Label sitting on the border */}
      <View style={inputStyles.labelWrapper}>
        <Text style={[
          inputStyles.label, 
          { color: error ? COLORS.error : (isFocused ? COLORS.primary : COLORS.textMedium) }
        ]}>
          {label}
        </Text>
      </View>

      <View style={[
        inputStyles.inputWrapper, 
        { 
          borderColor: error ? COLORS.error : (isFocused ? COLORS.primary : COLORS.border),
          borderWidth: isFocused ? 1.5 : 1
        }
      ]}>
        {Icon && <Icon size={16} color={isFocused ? COLORS.primary : COLORS.textLight} style={inputStyles.icon} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          style={inputStyles.input}
          selectionColor={COLORS.primary}
          {...props}
        />
      </View>
      {error && <Text style={inputStyles.errorText}>{error}</Text>}
    </View>
  );
};

/* ==================== MAIN SIGNUP SCREEN ==================== */

export default function SignupScreen() {
  const navigation = useNavigation();
  const { createUser } = userStore();

  const [form, setForm] = useState({ email: '', username: '', fullname: '', password: '', gender: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name, text) => {
    setForm(prev => ({ ...prev, [name]: text }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    let err = {};
    if (!form.email.includes('@')) err.email = 'Invalid email address';
    if (!form.username.trim()) err.username = 'Username required';
    if (!form.fullname.trim()) err.fullname = 'Full name required';
    if (!form.password || form.password.length < 6) err.password = 'Min. 6 characters';
    if (!form.gender) err.gender = 'Selection required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await createUser(form);
      if (res?.success) {
        navigation.navigate('OTP', { ...form, type: 'SignUP' });
      } else {
        Alert.alert('Registration Failed', res?.message || 'Details already exist');
      }
    } catch (e) {
      Alert.alert('Network Error', 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <ShoppingBasket color={COLORS.primary} size={24} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Fill in your details to start fresh grocery shopping.</Text>
          </View>

          <View style={styles.form}>
            <BorderLabelInput label="Email" value={form.email} onChangeText={t => handleChange('email', t)} error={errors.email} icon={Mail} keyboardType="email-address" autoCapitalize="none" />
            <BorderLabelInput label="Username" value={form.username} onChangeText={t => handleChange('username', t)} error={errors.username} icon={User} autoCapitalize="none" />
            <BorderLabelInput label="Full Name" value={form.fullname} onChangeText={t => handleChange('fullname', t)} error={errors.fullname} icon={Hash} />
            <BorderLabelInput label="Password" value={form.password} onChangeText={t => handleChange('password', t)} error={errors.password} icon={Lock} secure />

            <View style={styles.genderSection}>
              <Text style={styles.sectionLabel}>GENDER</Text>
              <View style={styles.genderRow}>
                {['Male', 'Female', 'Other'].map((g) => (
                  <TouchableOpacity 
                    key={g} 
                    onPress={() => handleChange('gender', g)}
                    style={[styles.genderChip, form.gender === g && styles.activeChip]}
                  >
                    <Text style={[styles.genderText, form.gender === g && styles.activeChipText]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.gender && <Text style={styles.errorTextSmall}>{errors.gender}</Text>}
            </View>

            <TouchableOpacity 
              onPress={handleSignup} 
              disabled={loading} 
              style={[styles.btn, loading && { opacity: 0.7 }]}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <View style={styles.btnContent}>
                  <Text style={styles.btnText}>Create Account</Text>
                  <ChevronRight size={18} color={COLORS.white} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.replace('login')} style={styles.loginLink}>
              <Text style={styles.loginText}>Already a member? <Text style={styles.loginTextBold}>Log In</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const inputStyles = StyleSheet.create({
  container: { marginBottom: 22 },
  labelWrapper: {
    position: 'absolute',
    top: -9,
    left: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 4,
    zIndex: 2,
  },
  label: { 
    fontSize: 12, 
    fontWeight: '600', 
    letterSpacing: 0.2 
  },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 48, 
    borderRadius: 8, 
    borderWidth: 1, 
    paddingHorizontal: 12 
  },
  icon: { marginRight: 10 },
  input: { 
    flex: 1, 
    color: COLORS.textDark, 
    fontSize: 14, 
    fontWeight: '500' 
  },
  errorText: { 
    color: COLORS.error, 
    fontSize: 11, 
    marginTop: 4, 
    marginLeft: 2, 
    fontWeight: '500' 
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 24, paddingTop: 40 },
  header: { marginBottom: 32 },
  logoBadge: { 
    width: 44, 
    height: 44, 
    backgroundColor: COLORS.primaryLight, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 },
  subtitle: { fontSize: 13, color: COLORS.textMedium, lineHeight: 18 },
  
  genderSection: { marginBottom: 24 },
  sectionLabel: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: COLORS.textLight, 
    marginBottom: 10, 
    letterSpacing: 1 
  },
  genderRow: { flexDirection: 'row', gap: 8 },
  genderChip: { 
    flex: 1, 
    height: 40, 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  activeChip: { backgroundColor: COLORS.textDark, borderColor: COLORS.textDark },
  genderText: { fontSize: 13, fontWeight: '500', color: COLORS.textMedium },
  activeChipText: { color: COLORS.white },
  
  btn: { 
    backgroundColor: COLORS.primary, 
    height: 50, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  btnContent: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  btnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  
  loginLink: { marginTop: 24, alignItems: 'center' },
  loginText: { color: COLORS.textMedium, fontSize: 13 },
  loginTextBold: { color: COLORS.primary, fontWeight: '700' },
  errorTextSmall: { color: COLORS.error, fontSize: 11, marginTop: 4 },
});