import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Dimensions, StatusBar, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Edit2, Smartphone, LocationEdit, MapPinHouse, Trash, Home, MapPin, ChevronRight, Plus, Target, Building } from 'lucide-react-native';
import userStore from '../../../store/MyStore';

const { width } = Dimensions.get('screen');
const PAGE_LIMIT = 5;

const CollapsableHeader = ({ navigation }) => (
  <View 
    style={{ 
      width, 
      backgroundColor: '#ffffff', 
      // Platform-specific safe area with a more compact feel
      paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 6 : 44,
      paddingBottom: 10,
      paddingHorizontal: 20, // Slightly wider padding for a spacious feel
      borderBottomWidth: 1,
      borderBottomColor: '#F9FAFB', // Extremely subtle line
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        activeOpacity={0.6} 
        style={{ 
          marginRight: 8,
          width: 32, 
          height: 32, 
          alignItems: 'flex-start', 
          justifyContent: 'center' 
        }}
      >
        {/* Thinner stroke (2.0) for a more delicate look */}
        <ChevronLeft size={22} color="#374151" strokeWidth={2} />
      </TouchableOpacity>

      <View>
        <Text style={{ 
          fontSize: 16, // Smaller font
          fontWeight: '600', // Semi-bold instead of heavy 800
          color: '#1F2937', 
          letterSpacing: -0.3 
        }}>
          My addresses
        </Text>
        <Text style={{ 
          fontSize: 11, // Tiny but readable
          color: '#9CA3AF', // Lighter grey
          fontWeight: '400', 
          marginTop: -1 
        }}>
          Select delivery location
        </Text>
      </View>
    </View>

    {/* Refined Plus Button */}
    <TouchableOpacity 
      activeOpacity={0.6}
      style={{
        padding: 6,
        backgroundColor: '#F7FCF8', // Very faint green
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#0C831F10'
      }}
    >
      <Plus size={18} color="#0C831F" strokeWidth={2} />
    </TouchableOpacity>
  </View>
);

const AddressCard = ({address, deleteAddress, fetchAddressList , navigation , setCurrentAddress ,setDeliveryAddress}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
        
        console.log(address)
        console.log(address._id)
    if (!address?._id || loading) return;

   
    setLoading(true);
    try {

      
      const response = await deleteAddress(address._id);
      if (response?.success) {
        
        fetchAddressList(1, 10, true);
      }

      
    } catch (error) {
      console.log('Delete address error:', error);
    } finally {
      setLoading(false);
    }
  };



return (
  <View style={{ width, alignItems: 'center', marginVertical: 6 }}>
    <View
      style={{
        width: width * 0.94,
        backgroundColor: '#fff',
        borderRadius: 16, // Slightly tighter radius
        padding: 14,
        borderWidth: 1,
        borderColor: '#F1F1F1', // Thinner, lighter border
        // Softer, more modern shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* HEADER: TAG + PINCODE */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          backgroundColor: '#F7FCF8', 
          paddingHorizontal: 8, 
          paddingVertical: 3, 
          borderRadius: 6,
          borderWidth: 0.5,
          borderColor: '#0C831F15'
        }}>
          {address.addressType === 'home' ? (
            <>
              <Home size={12} color="#0C831F" strokeWidth={2} />
              <Text style={{ marginLeft: 5, fontSize: 10, fontWeight: '600', color: '#0C831F', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Home
              </Text>
            </>
          ) : (
            <>
              <Building size={12} color="#0C831F" strokeWidth={2} />
              <Text style={{ marginLeft: 5, fontSize: 10, fontWeight: '600', color: '#0C831F', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Work / Other
              </Text>
            </>
          )}
        </View>
        <Text style={{ fontSize: 11, fontWeight: '500', color: '#9CA3AF', letterSpacing: 0.5 }}>
          {address.pincode}
        </Text>
      </View>

      {/* ADDRESS CONTENT */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ marginTop: 2 }}>
          <MapPin size={18} color="#4B5563" strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14, // Refined small font
              fontWeight: '600', // Semi-bold
              color: '#1F2937',
              lineHeight: 18,
              marginBottom: 2,
            }}
          >
            {address.addressLine1 || address.fullAddress || 'Address'}
          </Text>
          <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '400' }}>
            {address.city}, {address.district}
          </Text>
        </View>
      </View>

      {/* MOBILE SECTION */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 12,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#F9FAFB',
        }}
      >
        <Smartphone size={14} color="#9CA3AF" strokeWidth={1.5} />
        <Text style={{ marginLeft: 6, fontSize: 12, color: '#6B7280', fontWeight: '500' }}>
          {address.mobileNo?.[0] || address.mobile || 'N/A'}
        </Text>
      </View>

      {/* ACTIONS */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 14,
          gap: 8,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setCurrentAddress({ ...address, latitude: address.location.coordinates[1], longitude: address.location.coordinates[0] })
            setDeliveryAddress({ ...address, latitude: address.location.coordinates[1], longitude: address.location.coordinates[0] })
            navigation.goBack('HomeScreen');
          }}
          style={{
            flex: 1,
            backgroundColor: '#0C831F',
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          <Text style={{ fontWeight: '600', color: '#fff', fontSize: 14 }}>
            Deliver here
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#F1F1F1',
            }}
          >
            <Edit2 size={16} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            disabled={loading}
            onPress={handleDelete}
            activeOpacity={0.6}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: '#FFF8F8', // Lighter red tint
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#FFE4E4',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#dc2626" />
            ) : (
              <Trash size={16} color="#dc2626" strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);
};




const LocationType = ({ navigation }) => (
  <View style={{ width, alignItems: 'center', gap: 10, marginTop: 12, marginBottom: 6 }}>
    
    {/* LIVE ADDRESS BUTTON */}
    <TouchableOpacity 
      onPress={() => navigation.navigate("LiveMapScreen")} 
      activeOpacity={0.7}
      style={{ 
        width: width * 0.94, 
        flexDirection: 'row', 
        borderRadius: 14, 
        paddingVertical: 14, // Slightly slimmer
        paddingHorizontal: 16,
        backgroundColor: '#F7FCF8', // Even lighter tint
        borderWidth: 1, 
        borderColor: '#0C831F15',
        alignItems: 'center',
        // Softer shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      <View style={{ backgroundColor: '#0C831F', padding: 7, borderRadius: 10 }}>
        <Target size={18} color="#fff" strokeWidth={2} />
      </View>
      
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontWeight: '600', fontSize: 14, color: '#1F2937' }}>
          Use current location
        </Text>
        <Text style={{ fontSize: 11, color: '#0C831F', fontWeight: '400', marginTop: 1 }}>
          Using GPS for better accuracy
        </Text>
      </View>

      <ChevronRight size={16} color="#9CA3AF" strokeWidth={1.5} />
    </TouchableOpacity>

    {/* CUSTOM ADDRESS BUTTON */}
    <TouchableOpacity 
      activeOpacity={0.7}
      style={{ 
        width: width * 0.94, 
        flexDirection: 'row', 
        borderRadius: 14, 
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#fff', 
        borderWidth: 1, 
        borderColor: '#F1F1F1', // Thinner border color
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      <View style={{ backgroundColor: '#F9FAFB', padding: 7, borderRadius: 10, borderWidth: 1, borderColor: '#F1F1F1' }}>
        <Plus size={18} color="#4B5563" strokeWidth={2} />
      </View>
      
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontWeight: '600', fontSize: 14, color: '#1F2937' }}>
          Add address manually
        </Text>
        <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '400', marginTop: 1 }}>
          Search for area, street or landmark
        </Text>
      </View>

      <ChevronRight size={16} color="#D1D5DB" strokeWidth={1.5} />
    </TouchableOpacity>
    
  </View>
);


const LocationSettingScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
 
 
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const setDeliveryAddress = userStore(state=>state.setDeliveryAddress);
  const setCurrentAddress = userStore(state=>state.setCurrentAddress);
  const fetchAddress = userStore((state) => state.fetchAddress);
const deleteAddress = userStore((state) => state.deleteAddress);

  const fetchAddressList = useCallback(async (pageNumber = 1, limit = PAGE_LIMIT, reset = false) => {
    try {
      setLoading(true);
      const response = await fetchAddress(pageNumber, limit);
      
      if (response?.success) {
       setAddresses(prev =>reset ? response.AddressList : [...prev, ...response.AddressList]);
        setTotal(response.total || 0);
        setPage(pageNumber);
      }
    } catch (err) {
      console.log('Fetch addresses error:', err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [fetchAddress]);


  const onRefresh = useCallback(async () => {
  try {
    setRefreshing(true);
    await fetchAddressList(1, PAGE_LIMIT, true); // reset = true
  } catch (e) {
    console.log('Refresh error:', e);
  } finally {
    setRefreshing(false);
  }
}, [fetchAddressList]);



  useEffect(() => {
    fetchAddressList(1, PAGE_LIMIT, true);
  }, [fetchAddressList]);

  const loadMore = useCallback(() => {
    if (addresses.length < total && !loading) {
      fetchAddressList(page + 1, PAGE_LIMIT, false);
    }
  }, [addresses.length, total, loading, page, fetchAddressList]);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <CollapsableHeader navigation={navigation} />
      <LocationType navigation={navigation} />
      
      <View style={{ width, alignItems: 'center', marginBottom: 10 }}>
        <View style={{ width: width * 0.94, paddingHorizontal: 7, height: 30, justifyContent: 'flex-end' }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
            Saved Addresses ({addresses.length} of {total})
          </Text>
        </View>
      </View>

      <FlatList
        data={addresses}
        renderItem={({ item }) => <AddressCard setDeliveryAddress={setDeliveryAddress} setCurrentAddress={setCurrentAddress}  navigation = {navigation} address={item} deleteAddress={deleteAddress} fetchAddressList= {fetchAddressList}/>}
        keyExtractor={(item) => item._id?.toString() || item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
         refreshing={refreshing}
  onRefresh={onRefresh}
        ListEmptyComponent={
          initialLoading ? null : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
              <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center' }}>No addresses found</Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default LocationSettingScreen;
