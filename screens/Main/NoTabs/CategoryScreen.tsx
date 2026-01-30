import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import userStore from '../../../store/MyStore';
import { ArrowRight, ChevronLeft, Search } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';


const { width } = Dimensions.get('window');
const CategoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Route Params
  const { CategoryId, initialCategoryName, initialCategoryImage } = route.params;

  const { 
    fetchCategories, 
    fetchAllCategoriesProduct, 
    fetchSelectedCategoriesProduct, 
    deleteCart, 
    setCart, 
    cart, 
    totalCartItems 
  } = userStore();

  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState('All');
  const [products, setProducts] = useState([]);
  const [prodPage, setProdPage] = useState(1);
  const [prodLoading, setProdLoading] = useState(false);
  const [hasMoreProds, setHasMoreProds] = useState(true);

  // Reanimated Shared Value
  const popupCartValue = useSharedValue(500);

  const PopupCartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: popupCartValue.value }],
  }));

  /* ================= FETCHING LOGIC ================= */

  const loadSidebar = useCallback(async () => {
    try {
      const res = await fetchCategories(CategoryId, 1, 50);
      if (res.success) {
        const allCat = {
          _id: 'All',
          SubCategoryName: 'All',
          SubCategoryCoverImage: initialCategoryImage,
        };
        setCategories([allCat, ...res.Category]);
      }
    } catch (err) { console.log(err); }
  }, [CategoryId]);

  const loadProducts = useCallback(async (page = 1, catId = 'All') => {
    if (page > 1 && !hasMoreProds) return;
    setProdLoading(true);
    try {
      const res = catId === 'All' 
        ? await fetchAllCategoriesProduct(CategoryId, page, 10)
        : await fetchSelectedCategoriesProduct(catId, page, 10);

      const fetchedProds = res?.products || [];
      setProducts(prev => (page === 1 ? fetchedProds : [...prev, ...fetchedProds]));
      setHasMoreProds(fetchedProds.length > 0);
    } catch (err) { console.log(err); }
    finally { setProdLoading(false); }
  }, [CategoryId]);

  useEffect(() => {
    loadSidebar();
    loadProducts(1, 'All');
  }, []);

  useEffect(() => {
   
    popupCartValue.value = withTiming(cart?.length > 0 ? 0 : 500, { duration: 300 });
  }, [cart]);

  const handleCategoryPress = (id) => {
    setSelectedCatId(id);
    setProdPage(1);
    setProducts([]);
    loadProducts(1, id);
  };

  /* ================= RENDER PRODUCT CARD ================= */

  const renderProduct = ({ item }) => {
    const cartItem = cart.find(c => c.variantId?.toString() === item._id?.toString());
    const qty = cartItem?.quantity || 0;

    return (
      <View style={{ width: '48%', margin: '1%', backgroundColor: '#fff', borderRadius: 12, padding: 8, borderWidth: 1, borderColor: '#f0f0f0' }}>
        <View style={{ width: '100%', height: 90 }}>
          <Image source={{ uri: item.coverImage }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          
          {/* Discount Badge */}
          {item.pricing?.discountPercentage > 0 && (
            <View style={{ position: 'absolute', top: -4, left: -4, backgroundColor: '#2563eb', paddingHorizontal: 5, borderRadius: 2 }}>
              <Text style={{ color: '#fff', fontSize: 8, fontWeight: 'bold' }}>{item.pricing.discountPercentage}% OFF</Text>
            </View>
          )}
          
          {/* Add / Quantity Button */}
          <View style={{ position: 'absolute', bottom: -12, right: 0 }}>
            {qty > 0 ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#16a34a', borderRadius: 6, height: 28, width: 65, justifyContent: 'space-between', paddingHorizontal: 6 }}>
                <TouchableOpacity onPress={() => deleteCart({ variantId: item._id , actualMRP : item.pricing.actualMRP , discountedMRP : item.pricing.discountedPrice })}><Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>−</Text></TouchableOpacity>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{qty}</Text>
                <TouchableOpacity onPress={() => {
                  
                  setCart({  variantId: item._id, productId: item.Parent._id, discountedMRP: item.pricing.discountedPrice , actualMRP : item.pricing.actualMRP, StoreId : item.Parent.StoreId._id , StoreAddressID :  item.Parent.StoreId.address , coverImage : item.coverImage ,ProductName : item.ProductName , ProductAmount : item.ProductAmount})
                 
                  } }><Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>+</Text></TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                onPress={() =>{
                     setCart({  variantId: item._id, productId: item.Parent._id, discountedMRP: item.pricing.discountedPrice , actualMRP : item.pricing.actualMRP, StoreId : item.Parent.StoreId._id , StoreAddressID :  item.Parent.StoreId.address , coverImage : item.coverImage ,ProductName : item.ProductName , ProductAmount : item.ProductAmount})
                  
                }}
                style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#16a34a', paddingHorizontal: 15, paddingVertical: 4, borderRadius: 6, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2 }}
              >
                <Text style={{ color: '#16a34a', fontWeight: '900', fontSize: 12 }}>ADD</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Info */}
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#000' }}>₹{item.pricing?.discountedPrice} <Text style={{ fontSize: 10, textDecorationLine: 'line-through', color: '#999', fontWeight: '400' }}>₹{item.pricing?.actualMRP}</Text></Text>
          <Text numberOfLines={2} style={{ fontSize: 11, color: '#1f2937', height: 32, marginTop: 2, fontWeight: '500' }}>{item.ProductName}</Text>
          <View style={{ backgroundColor: '#f3f4f6', alignSelf: 'flex-start', paddingHorizontal: 4, borderRadius: 4, marginTop: 4 }}>
            <Text style={{ fontSize: 10, color: '#666' }}>{item.ProductAmount}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: StatusBar.currentHeight + 10, paddingHorizontal: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ChevronLeft size={24} color="#000" /></TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>{initialCategoryName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SearchProductScreen')}><Search size={22} color="#000" /></TouchableOpacity>
      </View>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* SIDEBAR */}
        <View style={{ width: width * 0.22, backgroundColor: '#F8F9FB', borderRightWidth: 1, borderRightColor: '#eee' }}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => handleCategoryPress(item._id)}
                style={{ alignItems: 'center', paddingVertical: 15, backgroundColor: selectedCatId === item._id ? '#fff' : 'transparent', borderRightWidth: selectedCatId === item._id ? 3 : 0, borderRightColor: '#16a34a' }}
              >
                <View style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: '#fff', overflow: 'hidden', marginBottom: 5, elevation: 1, borderWidth: selectedCatId === item._id ? 1 : 0, borderColor: '#16a34a' }}>
                  <Image source={{ uri: item.SubCategoryCoverImage || item.CategoryCoverImage }} style={{ width: '100%', height: '100%' }} />
                </View>
                <Text style={{ fontSize: 10, textAlign: 'center', color: selectedCatId === item._id ? '#000' : '#666', fontWeight: selectedCatId === item._id ? 'bold' : '500' }}>
                  {item.SubCategoryName || item.CategoryName}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* PRODUCT GRID */}
        <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 4 }}>
          <FlatList
            data={products}
            numColumns={2}
            keyExtractor={(item) => item._id}
            renderItem={renderProduct}
            onEndReached={() => {
              if (!prodLoading && hasMoreProds) {
                const next = prodPage + 1;
                setProdPage(next);
                loadProducts(next, selectedCatId);
              }
            }}
            ListFooterComponent={prodLoading ? <ActivityIndicator color="#16a34a" style={{ margin: 20 }} /> : null}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        </View>
      </View>

      {/* POPUP CART */}
      <Animated.View style={[{ position: 'absolute', bottom: 30, left: 15, right: 15, backgroundColor: '#16a34a', borderRadius: 12, padding: 12, elevation: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, PopupCartAnimatedStyle]}>
        <TouchableOpacity 
          style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}
          onPress={() => navigation.navigate('Screens', { screen: 'ViewCartScreen' })}
        >
          <View>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>{totalCartItems} Item{totalCartItems > 1 ? 's' : ''}</Text>
            <Text style={{ color: '#dcfce7', fontSize: 11, fontWeight: '600' }}>View Cart</Text>
          </View>
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 5 }}>
            <ArrowRight size={18} color="#16a34a" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default CategoryScreen;