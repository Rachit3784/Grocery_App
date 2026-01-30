import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {
  ArrowLeft,
  ChevronRight,
  Wallet,
  MapPin,
  ShoppingCart,
  Package,
  Heart,
  Tag,
  Truck,
  Users,
  Headphones,
  Settings,
  LogOut,
  Flag
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('screen');

// High-end Grocery Palette
const COLORS = {
  primary: '#064e3b', // Deep Forest Green
  accent: '#059669',
  background: '#ffffff',
  surface: '#f9fafb',
  border: '#f3f4f6',
  textMain: '#111827',
  textMuted: '#6b7280',
};

const ProfileScreen = () => {
  const navigation = useNavigation();

  const accountSettings = [
    { id: 1, name: 'My Addresses', subtitle: 'Manage delivery locations', route: 'LocationSettingScreen', icon: <MapPin size={18} /> },
    { id: 2, name: 'Order History', subtitle: 'Check your past purchases', route: 'OrderHistoryScreen', icon: <Package size={18} /> },
    { id: 3, name: 'Payments & Wallet', subtitle: '₹245.00 available', route: 'WalletScreen', icon: <Wallet size={18} /> },
    { id: 4, name: 'My Wishlist', subtitle: 'Items you saved for later', route: 'WishlistScreen', icon: <Heart size={18} /> },
    { id: 5, name: 'Help & Support', subtitle: '24/7 customer assistance', route: 'SupportScreen', icon: <Headphones size={18} /> },
  ];

  const renderHeader = () => (
    <View style={{
      paddingHorizontal: 20,
      paddingTop: StatusBar.currentHeight + 10,
      paddingBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: COLORS.background
    }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeft size={22} color={COLORS.textMain} />
      </TouchableOpacity>
      <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.textMain, letterSpacing: 0.5 }}>
        ACCOUNT
      </Text>
      <TouchableOpacity>
        <Settings size={20} color={COLORS.textMain} />
      </TouchableOpacity>
    </View>
  );

  const renderProfileInfo = () => (
    <View style={{ alignItems: 'center', paddingVertical: 24, backgroundColor: COLORS.background }}>
      <View style={{
        width: 84,
        height: 84,
        borderRadius: 42,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 4
      }}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' }}
          style={{ width: '100%', height: '100%', borderRadius: 40 }}
        />
      </View>
      <Text style={{ marginTop: 12, fontSize: 18, fontWeight: '700', color: COLORS.textMain }}>
        Rachit Gupta
      </Text>
      <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2, letterSpacing: 0.3 }}>
        grachit736@gmail.com   +91 8817998451
      </Text>
      
      <TouchableOpacity style={{
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border
      }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.textMain }}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = (title) => (
    <Text style={{
      fontSize: 11,
      fontWeight: '700',
      color: COLORS.textMuted,
      paddingHorizontal: 24,
      marginTop: 20,
      marginBottom: 8,
      letterSpacing: 1,
      textTransform: 'uppercase'
    }}>
      {title}
    </Text>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      {renderHeader()}
      
      <FlatList
        data={accountSettings}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <>
            {renderProfileInfo()}
            <View style={{ height: 8, backgroundColor: COLORS.surface }} />
            {renderSectionHeader('Activity & Orders')}
          </>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 14,
              paddingHorizontal: 24,
            }}
          >
            <View style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: COLORS.surface,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16
            }}>
              {React.cloneElement(item.icon, { color: COLORS.primary })}
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textMain }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>
                {item.subtitle}
              </Text>
            </View>
            
            <ChevronRight size={16} color="#d1d5db" />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: COLORS.border, marginLeft: 78 }} />
        )}
        ListFooterComponent={() => (
          <View style={{ paddingBottom: 40 }}>
            <View style={{ height: 8, backgroundColor: COLORS.surface, marginTop: 20 }} />
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 24,
              }}
            >
              <LogOut size={18} color="#dc2626" />
              <Text style={{ marginLeft: 16, fontSize: 14, fontWeight: '600', color: '#dc2626' }}>
                Logout
              </Text>
            </TouchableOpacity>
            
            <Text style={{ textAlign: 'center', color: COLORS.textMuted, fontSize: 10, letterSpacing: 1 }}>
              APP VERSION 2.4.0
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default ProfileScreen;