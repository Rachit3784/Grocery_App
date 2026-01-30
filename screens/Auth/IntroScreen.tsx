import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { ShoppingBasket, ArrowRight, UserCircle } from 'lucide-react-native';

const COLORS = {
  primary: '#10B981',
  textDark: '#111827',
  textMedium: '#4B5563',
  background: '#F9FAFB',
  white: '#FFFFFF',
  border: '#E5E7EB',
};

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Branding Section */}
        <View style={styles.brandSection}>
          <View style={styles.logoCircle}>
            <ShoppingBasket color={COLORS.primary} size={40} />
          </View>
          <Text style={styles.brandName}>GroceryFresh</Text>
          <Text style={styles.tagline}>Quality produce delivered to your doorstep.</Text>
        </View>

        {/* Action Section */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.primaryBtnText}>Get Started</Text>
            <ArrowRight size={18} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('login')}
          >
            <Text style={styles.secondaryBtnText}>I already have an account</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity 
            style={styles.guestBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <UserCircle size={20} color={COLORS.textMedium} />
            <Text style={styles.guestBtnText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: 30, justifyContent: 'space-between' },
  brandSection: { alignItems: 'center', marginTop: 60 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  brandName: { fontSize: 28, fontWeight: '800', color: COLORS.textDark },
  tagline: { fontSize: 15, color: COLORS.textMedium, textAlign: 'center', marginTop: 10, lineHeight: 22 },
  actionSection: { marginBottom: 20 },
  primaryBtn: { backgroundColor: COLORS.primary, height: 56, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, elevation: 4, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 8 },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  secondaryBtn: { height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  secondaryBtnText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { marginHorizontal: 15, color: COLORS.textLight, fontSize: 12, fontWeight: '700' },
  guestBtn: { height: 56, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: COLORS.white },
  guestBtnText: { color: COLORS.textMedium, fontSize: 15, fontWeight: '600' },
});