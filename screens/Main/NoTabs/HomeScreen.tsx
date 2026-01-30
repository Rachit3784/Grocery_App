import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Dimensions,
    Platform,PermissionsAndroid
} from 'react-native';

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
       useSharedValue,
       useAnimatedStyle,
       withTiming,
       withRepeat,
       interpolate,
       Extrapolate,
} from 'react-native-reanimated';

import {
    Heart,
    Star,
    MapPin,
    Clock3,
    Search,
    Bell,
    Frown,
    Flame,
    MessageCircle,
    X,Timer,
    ArrowRight,
    CircleUser,
    Map,
    LogIn,
} from 'lucide-react-native';

import Geolocation from '@react-native-community/geolocation';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import userStore from '../../../store/MyStore';
import { MyContext } from '../../../store/MyContext';

const HEADER_HEIGHT = 155;
const SNAP_THRESHOLD = 80;
const STORES_PER_PAGE = 10;
const { width } = Dimensions.get('screen');
const TOP_CONTENT_HEIGHT = 70;

// Skeleton
const StoreCardSkeleton = () => {
    const opacity = useSharedValue(0.3);
    useEffect(() => {
        opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
    }, []);
    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <View style={storeStyles.cardContainer}>
            <Animated.View style={[storeStyles.skeletonImage, animatedStyle]} />
            <View style={storeStyles.skeletonDetails}>
                <Animated.View style={[storeStyles.skeletonTitle, animatedStyle]} />
                <Animated.View style={[storeStyles.skeletonLine, animatedStyle, { width: '70%' }]} />
                <Animated.View style={[storeStyles.skeletonLine, animatedStyle, { width: '50%' }]} />
            </View>
        </View>
    );
};




const EmptyState = ({ message }) => (
    <View style={homeStyles.emptyStateContainer}>
        <Frown size={80} color="#d1d5db" />
        <Text style={homeStyles.emptyStateText}>{message}</Text>
    </View>
);



const CollapsibleHeader = ({userName,userModelID , currentProfileUrl, headerY , navigation , currentAddress, setCurrentAddress ,  fetCurrentLoaction , setFetchCurrentLocation}) => {
  const insets = useSafeAreaInsets();

  const mapRef = useRef(null);
  


  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerY.value }],
  }));

  // 2️⃣ Top content fades + moves
  const topContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerY.value }],
    opacity: interpolate(
      headerY.value,
      [0, -TOP_CONTENT_HEIGHT],
      [1, 0],
      Extrapolate.EXTEND
    ),
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: '#fff',
          paddingTop: insets.top,
          elevation: 1,
        },
        headerStyle, 
      ]}
    >
      {/* 🔼 Collapsible Top Section */}
      <Animated.View style={topContentStyle}>
        <View
          style={{
            height: TOP_CONTENT_HEIGHT,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}
        >
          {/* Left */}
          <View style={{ flexDirection: 'row', gap: 12 , marginLeft : 10 }}>
            
            <TouchableOpacity
            onPress={()=>{
                navigation.navigate('LocationSettingScreen')
            }}
            >
                
              <Text style={{ fontSize: 16, fontWeight: '700' }}>
               Hello {userName}
              </Text>
              {
                currentAddress  ? (<View style = {{flexDirection : 'row' , alignItems : 'center' , gap : 2}}>
   <MapPin size={13}/>
                <Text 
  numberOfLines={1} 
  ellipsizeMode="tail"
  style={{ 
    fontSize: 12, 
    color: '#6b7280', 
    width: 100 
  }}
>
  {currentAddress.addressLine1}
</Text>
              </View>) : (<ActivityIndicator size={18} color={'#000'}/>)
              }
            </TouchableOpacity>

          </View>

          {/* Right */}
         <View style = {{flexDirection : 'row' , alignItems : 'center' , justifyContent : 'space-between'}}>
             <TouchableOpacity style={{ flexDirection: 'row', alignItems : 'center' , justifyContent : 'center' ,  height : 40 ,width : 40 }}>
            <Bell size={20} />
          </TouchableOpacity>
          {
            userModelID ? (
              <TouchableOpacity 
           onPress={()=>{
            navigation.navigate('ProfileScreen')
           }}
          style={{ flexDirection: 'row', alignItems : 'center' , justifyContent : 'center' ,  height : 40 ,width : 40 }}>
            {currentProfileUrl ?  (<View style = {{height : 30 ,width : 30 , overflow : 'hidden' , borderRadius : 999}}>
              <Image source={{uri : currentProfileUrl} } resizeMode='cover'  style = {{ width : '100%' , height : '100%' }}/>
            </View>) : <CircleUser size={20} />}
          </TouchableOpacity>
            ) : (<TouchableOpacity
            onPress={()=>{
              navigation.navigate('Auth')
            }}
            style = {{alignItems : 'center' , flexDirection : 'row' , justifyContent : 'center' , gap : 2  ,backgroundColor : '#ffe600' , borderRadius  :  8 , padding : 5 , width  : 70 , height : 30}}>
              <Text style = {{fontSize : 12 , fontWeight : '600' }}>
                Login
              </Text>
              <LogIn size={12}/>
            </TouchableOpacity>)
          }
         </View>
        </View>
      </Animated.View>
      
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 12,
        }}
      >
        <TouchableOpacity
        onPress={()=>{
          navigation.navigate('Screens',{
            screen : 'SearchProductScreen'
          })
        }}
          activeOpacity={0.9}
          style={{
            height: 48,
            borderRadius: 16,
            backgroundColor: '#f3f4f6',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
          }}
        >
          <Search size={20} color="#9ca3af" />
          <Text style={{ marginLeft: 10, color: '#9ca3af' }}>
            Search groceries & more
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};




const CONTAINER_PADDING = 10;
const ITEM_MARGIN = 6;
const ITEM_WIDTH = (width - (CONTAINER_PADDING * 2) - (ITEM_MARGIN * 8)) / 4;

const Category = ({ categoryData, navigation }) => {

  const CategoryBox = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Screens', {
            screen: 'CategoryScreen',
            params: { 
              CategoryId: item._id, 
              initialCategoryName: item.CategoryName, 
              initialCategoryImage: item.CategoryCoverImage 
            }
          })
        }}
        activeOpacity={0.7}
        style={{
          width: ITEM_WIDTH,
          marginHorizontal: ITEM_MARGIN,
          marginVertical: 8,
          alignItems: "center",
        }}
      >
        {/* Modern Image Container */}
        <View
          style={{
            width: ITEM_WIDTH,
            height: ITEM_WIDTH, // Perfectly square for the "tile" look
            borderRadius: 16,
            backgroundColor: "#F4F6F8", // Soft grey background
            padding: 8, // Padding so the product image doesn't touch the edges
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#F0F0F0', // Very subtle border
          }}
        >
          <Image
            source={{ uri: item.CategoryCoverImage }}
            resizeMode="contain" // Contain looks better for product categories
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </View>

        {/* Improved Typography */}
        <Text
          numberOfLines={2}
          style={{
            marginTop: 8,
            fontSize: 11,
            fontWeight: "600",
            textAlign: "center",
            color: "#333",
            lineHeight: 14,
            width: '100%',
          }}
        >
          {item.CategoryName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        width: width,
        paddingVertical: 16,
        backgroundColor: '#fff',
      }}
    >
      {/* Header Row */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8
      }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "800",
            color: "#1a1a1a",
            letterSpacing: -0.2,
          }}
        >
          {categoryData?.[0]?.CategoryTitle || "Shop by Category"}
        </Text>
      </View>

      {/* Grid Layout */}
      <FlatList
        data={categoryData}
        numColumns={4}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => <CategoryBox item={item} />}
        scrollEnabled={false} // Usually category grids on home are part of a larger scrollview
        contentContainerStyle={{
          paddingHorizontal: CONTAINER_PADDING,
          alignItems: 'center',
        }}
      />
    </View>
  );
};




const QuantitySelector = ({
  onIncrease,
  onDecrease,
  quantity = 0,
  min = 0,
  max = 99,
}) => {
  const increase = () => {
    if (quantity < max) {
      onIncrease();
    }
  };

  const decrease = () => {
    if (quantity > min) {
      onDecrease();
    }
  };

  return ( <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#16a34a", // Solid green for better visibility
        borderRadius: 8,
        height: 32,
        width: 80, // Slightly wider for better touch targets
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <TouchableOpacity
        onPress={() => quantity > min && onDecrease()}
        activeOpacity={0.6}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>−</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 13, fontWeight: "800", color: "#fff", minWidth: 20, textAlign: 'center' }}>
        {quantity}
      </Text>

      <TouchableOpacity
        onPress={() => quantity < max && onIncrease()}
        activeOpacity={0.6}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProductCard = ({ item, setCallPopup, setPopupProducts, navigation, handlingCartAddition, cart, DeleteFromCart }) => {
  const [quantity, setQuantity] = useState(0);

 useEffect(() => {
  if (item.variants.length === 1) {
    const variantId = item.variants[0]._id.toString();

    const perticularItem = cart?.find(
      (cartItem) => cartItem.variantId?.toString() === variantId
    );

    
    setQuantity(perticularItem?.quantity || 0);
  }
}, [cart, item.variants]);


  const handleAddtoCart = async () => {
    if (item.variants.length > 1) {
      setCallPopup(true);
      setPopupProducts(item);
      console.log(item)

    } else {
      const success = await handlingCartAddition(
        item.variants[0]._id,
        item._id,
        item.variants[0].coverImage,
        item.variants[0]?.pricing?.actualMRP,
        item.variants[0]?.pricing?.discountedPrice,
        item.variants[0].ProductName,
        item.variants[0].ProductAmount,
        item.Store.StoreAddressID,
        item.Store._id
      
      );
      if (success) {
        setQuantity((quantity) => quantity + 1);
      }
    }
  };

  const handleIncrease = async () => {
  const success = await handlingCartAddition(
    item.variants[0]._id,      // variantId
    item._id,                  // productId
    item.variants[0].coverImage,
    item.variants[0]?.pricing?.actualMRP,
    item.variants[0]?.pricing?.discountedPrice,
    item.variants[0].ProductName,
    item.variants[0].ProductAmount,
    item.Store.StoreAddressID,
    item.Store._id
  );
  if (success) {
    setQuantity((q) => q + 1);
  }
};


 const handleDecrease = () => {
  DeleteFromCart({
    variantId: item.variants[0]._id,
    actualMRP: item.variants[0]?.pricing?.actualMRP,
    discountedMRP: item.variants[0]?.pricing?.discountedPrice,
  });

  setQuantity((q) => Math.max(0, q - 1)); 
};


  return (


<TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        navigation.navigate('Screens', {
          screen: 'ProductDetail',
          params: { varientId: item?.variants[0]?._id, productId: item?._id }
        })
      }}
      style={{
        width: width * 0.31,
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 4,
        borderWidth: 1,
        borderColor: '#f0f2f5',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      {/* IMAGE SECTION */}
      <View style={{ width: '100%', height: 110, padding: 10 }}>
        <Image
          source={{ uri: item.variants[0]?.coverImage }}
          resizeMode="contain"
          style={{ width: '100%', height: '100%' }}
        />

        {/* DISCOUNT BADGE */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: '#2563eb', // Blue badge is more modern for discounts
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderTopLeftRadius: 10,
          borderBottomRightRadius: 10
        }}>
          <Text style={{ fontSize: 9, color: '#fff', fontWeight: 'bold' }}>
            {item.variants[0]?.pricing?.discountPercentage}% OFF
          </Text>
        </View>

        {/* ADD BUTTON / QUANTITY SELECTOR */}
        <View style={{ position: 'absolute', bottom: -12, alignSelf: 'center', zIndex: 10 }}>
          {item.variants.length === 1 && quantity > 0 ? (
            <QuantitySelector
              quantity={quantity}
              max={item.variants[0].Stock}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          ) : (
            <TouchableOpacity
              onPress={handleAddtoCart}
              activeOpacity={0.8}
              style={{
                backgroundColor: '#fff',
                borderColor: '#16a34a',
                borderWidth: 1,
                borderRadius: 8,
                width: 75,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 4,
                shadowColor: '#16a34a',
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Text style={{ color: '#16a34a', fontSize: 12, fontWeight: '800' }}>ADD</Text>
              {item.variants.length > 1 && (
                <Text style={{ fontSize: 7, color: '#666', marginTop: -2 }}>Options</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* CONTENT SECTION */}
      <View style={{ padding: 8, paddingTop: 14 }}>
        <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: '500', color: '#374151', height: 34, lineHeight: 16 }}>
          {item.variants[0]?.ProductName}
        </Text>

        <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ backgroundColor: '#f3f4f6', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 }}>
                <Text style={{ fontSize: 9, color: '#6b7280', fontWeight: '600' }}>{item.variants[0]?.ProductAmount}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Star size={10} fill="#facc15" color="#facc15" />
                <Text style={{ fontSize: 10, fontWeight: '700', marginLeft: 2, color: '#4b5563' }}>{item.variants[0]?.rating}</Text>
            </View>
        </View>

        <View style={{ marginTop: 6, flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#111827' }}>
            ₹{item.variants[0]?.pricing.discountedPrice}
          </Text>
          <Text style={{ fontSize: 10, color: '#9ca3af', textDecorationLine: 'line-through' }}>
            ₹{item.variants[0]?.pricing?.actualMRP}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const VarientCards = ({ item, handlingCartAddition, PopupProducts, cart, deleteCart }) => {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const cartItem = cart?.find(
      (cp) => cp.variantId?.toString() === item._id?.toString()
    );
    setQuantity(cartItem?.quantity || 0);
  }, [cart, item._id]);

  const handleAddToCart = async () => {
   
  const success = await handlingCartAddition(
    item._id,                     // variantId
    PopupProducts?._id,           // productId
    item.coverImage,
    item.pricing?.actualMRP,
    item.pricing?.discountedPrice,
    item.ProductName,             // Add this
    item.ProductAmount,           // Add this
    PopupProducts?.Store.StoreAddressID,
    PopupProducts?.Store._id
  );
  if (success) {
    setQuantity(1);
  }
};


 const handleIncrease = async () => {
  const success = await handlingCartAddition(
    item._id,
    PopupProducts?._id,
    item.coverImage,
    item.pricing?.actualMRP,
    item.pricing?.discountedPrice,
    item.ProductName,
    item.ProductAmount,
    PopupProducts?.Store.StoreAddressID,  // Fix: Use PopupProducts.Store
    PopupProducts?.Store._id
  );
  if (success) {
    setQuantity((q) => q + 1);
  }
};


  const handleDecrease = () => {
    deleteCart({
      variantId: item._id,
      actualMRP: item.pricing?.actualMRP,
      discountedMRP: item.pricing?.discountedPrice,
    });
    setQuantity((q) => q - 1);
  };

  return (
    <View
      style={{
       flexDirection: 'row',
       backgroundColor: '#fff',
       borderRadius: 14,
       padding: 12,
       marginBottom: 12,
       elevation: 2,
       borderWidth: 1,
       borderColor: '#f1f1f1',
      }}
    >
      {/* Image */}
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: '#f9fafb',
        }}
      >
       <Image
    
    source={{
      uri: item?.coverImage 
    }}
    style={{ width: '100%', height: '100%' }}
    resizeMode="cover"
  
  />
      </View>

      {/* Info */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#111',
          }}
          numberOfLines={2}
        >
          {item.ProductName}
        </Text>

        <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
          {item.ProductAmount}
        </Text>

        {/* Price Row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
            gap: 6,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: '#111',
            }}
          >
            ₹{item.pricing?.discountedPrice}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: '#9ca3af',
              textDecorationLine: 'line-through',
            }}
          >
            ₹{item.pricing?.actualMRP}
          </Text>
        </View>
      </View>

      {/* ADD Button / QUANTITY SELECTOR */}
      {quantity > 0 ? (
        <QuantitySelector
          quantity={quantity}
          max={item.Stock}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
      ) : (
        <TouchableOpacity
          onPress={handleAddToCart}
          style={{
            alignSelf: 'center',
            backgroundColor: '#16a34a',
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 12,
              fontWeight: '700',
            }}
          >
            ADD
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const HomeScreen = () => {
  const {  loadNearByProducts, deleteCart, userModelID,setCart,currentProfileUrl, userName, totalCartItems , FetchCategory , setCurrentAddress , currentAddress} = userStore();


  const cart = userStore((state) => state.cart);
  const {fetCurrentLoaction , setFetchCurrentLocation} = useContext(MyContext)
  const navigation = useNavigation();
  
  const [Products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [callPopUp, setCallPopup] = useState(false);
  const [PopupProducts, setPopupProducts] = useState({});

  const [cartData, setCartData] = useState(cart?.slice(-4) || []);

  const prevCartLength = useRef(0);

  const popupCartValue = useSharedValue(cart?.length > 0 ? 0 : 500);

  const popupTranslate = useSharedValue(500);
  



  const [address, setAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    mobileNum : '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    country: '',
    pincode: '',
    addressType: 'home',
    latitude: null,
    longitude: null,
  });

  /* ================= LOCATION ================= */
  

  useFocusEffect(useCallback(() => { if(fetCurrentLoaction) getCurrentLocation(); }, [fetCurrentLoaction ]));

  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      const fineGranted =
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;
      const coarseGranted =
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;

      return fineGranted || coarseGranted;
    } catch (e) {
      console.log('Permission error', e);
      return false;
    }
  };

const getCurrentLocation = async () => {
  const ok = await requestLocationPermission();
  if (!ok) return;

  setLoading(true);
  
  // Step 1: Fast coarse location
  Geolocation.getCurrentPosition(
    pos => { 
      // SUCCESS: Extract coordinates and fetch address
      const { latitude, longitude } = pos.coords;
      fetchAddress(latitude, longitude);
      setLoading(false);
    },
    err => {
      console.log('Fast GPS failed, trying accurate...', err);
      // Step 2: High accuracy fallback
      Geolocation.getCurrentPosition(
        pos => { 
          // SUCCESS: Extract coordinates and fetch address
          const { latitude, longitude } = pos.coords;
          fetchAddress(latitude, longitude);
          setLoading(false);
        },
        err2 => { 
          console.log('High accuracy also failed', err2); 
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
  );
};



const fetchAddress = async (lat, lng) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'YourAppName/1.0 (contact@yourapp.com)', // Replace with your app details
        'Referer': 'https://yourapp.com',
        'Accept': 'application/json',
      },
    });

    // Check if response is ok and content-type is JSON
    if (!response.ok) {
      const text = await response.text();
      console.log('HTTP Error:', response.status, text.substring(0, 200));
      return;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.log('Non-JSON response:', text.substring(0, 200));
      return;
    }

    const data = await response.json();
    
    if (!data?.address) {
      console.log('No address data:', data);
      return;
    }

    const a = data.address;

    setAddress(prev => {
      const updated = {
        ...prev,
        addressLine1: data.display_name || a.road || a.house_number || '',
        city: a.city || a.town || a.village || a.municipality || '',
        district: a.state_district || a.county || '',
        state: a.state || '',
        country: a.country || 'India',
        pincode: a.postcode || '',
        latitude: lat,
        longitude: lng,
      };
      console.log('Updated address:', updated);
      return updated;
    });

  } catch (e) {
    console.log('Reverse geocode error:', e);
  }
};


useEffect(()=>{
    
handleSubmit();
},[address])

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const {
      addressLine1,
      addressLine2,
      city,
      district,
      state,
      country,
      pincode,
      latitude,
      longitude,
      addressType,
      landmark,
      mobileNum
    } = address;

    if (!latitude || !longitude || !addressLine1) return;


       
    const res = await setCurrentAddress(address);

  if(res){
          
setFetchCurrentLocation(false)
  }

  };

  





  useEffect(() => {
    popupTranslate.value = withTiming(callPopUp ? 0 : 500, {
      duration: 300
    });
  }, [callPopUp]);



  useEffect(() => {
    const currentLength = cart?.length || 0;
    setCartData(cart?.slice(-4) || []);

    if (currentLength > 0) {
      popupCartValue.value = withTiming(50, { duration: 1800 });
    } else {
      popupCartValue.value = withTiming(300, { duration: 1800 });
    }

    prevCartLength.current = currentLength;
  }, [cart]);

  const PopupCartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: popupCartValue.value }],
  }));



  const BottomCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: popupTranslate.value }]
  }));

  const headerY = useSharedValue(0);
  const lastScrollY = useRef(0);

 
const fetchProducts = useCallback(async (pageNum = 1, isRefresh = false) => {
    

    console.log(pageNum , loadingMore , hasMore)
  // 1. Guard against duplicate calls
  if (pageNum !== 1 && (loadingMore || !hasMore)) return;

  if (pageNum === 1) {
    isRefresh ? setRefreshing(true) : setLoading(true);
  } else {
    setLoadingMore(true);
  }

  try {
    if (!currentAddress?.latitude || !currentAddress?.longitude) return;

    const res = await loadNearByProducts(pageNum, currentAddress.latitude, currentAddress.longitude);
    
    if (res?.success) {
      const newProducts = res.Products || [];
      console.log(newProducts.length,"kkkkkkkkkkllllllllllllllll")
      setProducts(prev => {
       
        if (pageNum === 1) return newProducts;
        
        
        const existingIds = new Set(prev.map(p => p._id));
        const filteredNew = newProducts.filter(p => !existingIds.has(p._id));
        return [...prev, ...filteredNew];

      });

     
      setHasMore(newProducts.length >= 9); 
      
      setPage(pageNum);
    } else {
      setHasMore(false);
    }
  } catch (err) {
    console.error("Fetch Error:", err);
  } finally {
    setLoading(false);
    setRefreshing(false);
    setLoadingMore(false);
  }
}, [currentAddress?.latitude, currentAddress?.longitude, loadingMore, hasMore]); 


  const fetchCategories = useCallback(async ()=>{
    
    try{
      const res = await FetchCategory("Grocery & Kitchen");
      
      if(res.success){
        setCategory(res.Categories);
      }
    }catch(error){
      console.log(error)
      return;
    }
  },[]);

useEffect(() => {
  // Only trigger if we have coordinates AND we aren't already looking at products
  // or if it's the very first load.
  if (currentAddress?.latitude && currentAddress?.longitude && Products.length === 0) {
    fetchProducts(1);
    fetchCategories();
  }
}, [currentAddress?.latitude, currentAddress?.longitude]); // Watch specific values, not the whole object // Watch the whole object for changes
  

  const HEADER_TOP_HEIGHT = 70;
  

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const diff = y - lastScrollY.current;

    if (y > 40 && diff > 0) {
      headerY.value = withTiming(-HEADER_TOP_HEIGHT, { duration: 250 });
    } else if (diff < -10) {
      headerY.value = withTiming(0, { duration: 200 });
    }

    lastScrollY.current = y;
  };

  const handlingCartAddition = async (variantId, productId, coverImage, actualMRP, discountedMRP , ProductName , ProductAmount , StoreAddressID , StoreId) => {
    try {
      const response = await setCart({ productId, variantId, coverImage, actualMRP, discountedMRP , ProductName , ProductAmount , StoreAddressID , StoreId});
      return response.success;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <View style={homeStyles.container}>
        <CollapsibleHeader userModelID={userModelID} currentProfileUrl={currentProfileUrl} userName={userName} currentAddress={currentAddress} headerY={headerY} navigation = {navigation} setCurrentAddress = {setCurrentAddress} fetCurrentLoaction = {fetCurrentLoaction} setFetchCurrentLocation = {setFetchCurrentLocation}/>

        <FlatList
          data={Products}
          numColumns={3}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={21}
          removeClippedSubviews={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ProductCard
            navigation={navigation}
              cart={cart}
              item={item}
              handlingCartAddition={handlingCartAddition}
              setCallPopup={setCallPopup}
              setPopupProducts={setPopupProducts}
              DeleteFromCart={deleteCart}
            />
          )}
          onEndReached={() => {
    
      fetchProducts(page + 1);
    
  }}
  onEndReachedThreshold={0.2}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
                
                  <Category categoryData={category} navigation={navigation}/>
               
              
              <View style={[homeStyles.contentContainer, { paddingTop: 10 }]}>
                <Text style={homeStyles.sectionTitle}>
                  Products
                </Text>
              </View>


              {loading && Products.length === 0 && (
                <View style={homeStyles.contentContainer}>
                  {[...Array(6)].map((_, i) => <StoreCardSkeleton key={i} />)}
                </View>
              )}
            </>
          }
          ListEmptyComponent={<EmptyState message="No Products found" />}
          ListFooterComponent={
            loadingMore ? (
              <View style={homeStyles.footerLoader}>
                <ActivityIndicator size="small" color="#111827" />
                <Text style={homeStyles.footerText}>Loading more Products...</Text>
              </View>
            ) : !hasMore && Products.length > 0 ? (
              <View style={homeStyles.footerEnd}>
                <Text style={homeStyles.footerEndText}>You've reached the end</Text>
              </View>
            ) : null
          }
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT + 5,
            paddingBottom: 120,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                fetchProducts(1, true)
                fetchCategories('Grocery & Kitchen')
              }}
              colors={['#111827']}
              tintColor="#111827"
              progressViewOffset={HEADER_HEIGHT + 80}
              title="Refreshing Products..."
              titleColor="#6b7280"
            />
          }
        />

        {/* Variant Popup */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: 12,
              elevation: 10,
              maxHeight: '65%',
            },
            BottomCardAnimatedStyle,
          ]}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderColor: '#eee',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>
              Select Variant
            </Text>

            <TouchableOpacity
              onPress={() => setCallPopup(false)}
              style={{
                height: 36,
                width: 36,
                borderRadius: 18,
                backgroundColor: '#f3f4f6',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} color="#111" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Product List */}
          <FlatList
            data={PopupProducts?.variants || []}
            keyExtractor={(item, index) => item?._id?.toString() || index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16 , paddingBottom : 0 }}
            nestedScrollEnabled
            renderItem={({ item }) => (
              <VarientCards
                item={item}
                handlingCartAddition={handlingCartAddition}
                PopupProducts={PopupProducts}
                cart={cart}
                deleteCart={deleteCart}
              />
            )}
            ListFooterComponent={() => (
              <View style={{ backgroundColor: '#fff', width, height: 50 }}>
                <Text></Text>
              </View>
            )}
          />
        </Animated.View>




        {/* Cart Popup */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 80,
              alignSelf: 'center',
              backgroundColor: '#16a34a',
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 12,
            },
            PopupCartAnimatedStyle,
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Screens' , {
              screen : 'ViewCartScreen'
            })}


            style={{
              width: width * 0.6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {/* Product Preview Stack */}
            <FlatList
              data={cartData}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 2 }}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    borderWidth: 1.5,
                    borderColor: '#fff',
                    marginLeft: index === 0 ? 0 : -12,
                  }}
                >
                  {item?.coverImage ? (
                    <Image
                      source={{ uri: item.coverImage }}
                      resizeMode="cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: '#e5e7eb',
                      }}
                    />
                  )}
                </View>
              )}
            />

            {/* Cart Info */}
            <View>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: '700',
                  lineHeight: 14,
                }}
              >
                {totalCartItems} item
                {totalCartItems > 1 ? 's' : ''}
              </Text>

              <Text
                style={{
                  color: '#dcfce7',
                  fontSize: 11,
                  fontWeight: '600',
                }}
              >
                View Cart
              </Text>
            </View>

            {/* Arrow */}
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowRight size={16} color="#16a34a" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaProvider>
  );
};






const homeStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    header: {
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        backgroundColor: '#fff', height: HEADER_HEIGHT,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 1,
    },
    expandedHeader: { paddingHorizontal: 16, paddingBottom: 10 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    profileSection: { flexDirection: 'row', alignItems: 'center' },
    profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    greetingText: { fontSize: 14, color: '#9ca3af', fontWeight: '500' },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    locationText: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginLeft: 4 },
    notificationButton: { padding: 8, borderRadius: 20, backgroundColor: '#f3f4f6', position: 'relative' },
    notificationBadge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 15, paddingVertical: Platform.OS === 'ios' ? 12 : 10 },
    searchInput: { marginLeft: 10, fontSize: 15, flex: 1 },
    categoryContainer: { paddingVertical: 10 },
    categoryTray: { paddingHorizontal: 16, paddingTop: 5, paddingBottom: 15 },
    categoryChip: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, borderWidth: 1, borderColor: '#e5e7eb' },
    categoryChipSelected: { backgroundColor: '#1f2937', borderColor: '#1f2937' },
    categoryText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
    categoryTextSelected: { color: '#fff' },
    contentContainer: { paddingHorizontal: 16, backgroundColor: '#f9fafb' },
    sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 10 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
    viewAllText: { fontSize: 14, color: '#6b7280', fontWeight: '600' },
    footerLoader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
    footerText: { marginLeft: 8, fontSize: 14, color: '#6b7280' },
    footerEnd: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 30 },
    footerEndText: { fontSize: 13, color: '#9ca3af', marginHorizontal: 10 },
    divider: { height: 1, backgroundColor: '#e5e7eb', width: '25%' },
    emptyStateContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
    emptyStateText: { marginTop: 15, fontSize: 16, color: '#9ca3af', textAlign: 'center', fontWeight: '600' },
});

const storeStyles = StyleSheet.create({
    cardContainer: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 6, borderWidth: 1, borderColor: '#f1f1f1' },
    imageWrapper: { position: 'relative' },
    storeImage: { width: '100%', height: 200, resizeMode: 'cover' },
    statusBadge: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
    statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff', marginRight: 6 },
    statusText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
    detailsContainer: { padding: 16 },
    storeName: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    ratingStars: { flexDirection: 'row', marginRight: 6 },
    ratingCount: { fontSize: 13, color: '#6b7280', fontWeight: '600' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    infoText: { fontSize: 13.5, color: '#4b5563', marginLeft: 6, flex: 1 },
    skeletonImage: { width: '100%', height: 200, backgroundColor: '#e5e7eb', borderRadius: 16 },
    skeletonDetails: { padding: 16 },
    skeletonTitle: { height: 20, width: '80%', backgroundColor: '#e5e7eb', borderRadius: 8, marginBottom: 12 },
    skeletonLine: { height: 16, backgroundColor: '#e5e7eb', borderRadius: 8, marginBottom: 10 },
});



export default HomeScreen;