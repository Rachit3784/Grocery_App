import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import userStore from '../../../store/MyStore'
import { ArrowRight, ChevronLeft, Search, ShoppingBag, Star } from 'lucide-react-native'
import Animated , { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const { width } = Dimensions.get('screen')

const SearchResultScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { text } = route.params

  const { fetchSearchedProduct, deleteCart, setCart, cart, totalCartItems } = userStore()

  const [products, setProducts ] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore ] = useState(false)

  const [cartData, setCartData] = useState(cart?.slice(-4) || [])
  const popupCartValue = useSharedValue(cart?.length > 0 ? 0 : 500)

  /* ================= POPUP CART ================= */
  useEffect(() => {
    const currentLength = cart?.length || 0
    setCartData(cart?.slice(-4) || [])

    popupCartValue.value = withTiming(currentLength > 0 ? 0 : 500, {
      duration: 300,
    })
  }, [cart])

  const PopupCartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: popupCartValue.value }],
  }))

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = useCallback(
    async (currentPage = 1) => {
      if (!text?.trim()) return

      currentPage === 1 ? setLoading(true) : setIsFetchingMore(true)

      try {
        const response = await fetchSearchedProduct(text, currentPage, 10)

        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.products)
          ? response.products
          : []

        if (currentPage === 1) setProducts(list)
        else setProducts(prev => [...prev, ...list])

        setHasMore(list.length > 0)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
        setIsFetchingMore(false)
      }
    },
    [text]
  )

  useEffect(() => {
    setPage(1)
    fetchProducts(1)
  }, [text])

  const handleLoadMore = () => {
    if (hasMore && !isFetchingMore) {
      const next = page + 1
      setPage(next)
      fetchProducts(next)
    }
  }

  /* ================= QUANTITY SELECTOR ================= */
 const QuantitySelector = ({ onIncrease, onDecrease, quantity=0, min=0, max=99 }) => {
  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#16a34a",
      borderRadius: 8,
      height: 32,
      width: 80,
      justifyContent: "space-between",
      elevation: 3,
    }}>
      <TouchableOpacity
        onPress={() => quantity > min && onDecrease()}
        style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>−</Text>
      </TouchableOpacity>

      <Text style={{ color: "#fff", fontWeight: "800" }}>
        {quantity}
      </Text>

      <TouchableOpacity
        onPress={() => quantity < max && onIncrease()}
        style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>+</Text>
      </TouchableOpacity>
    </View>
  )
}


  /* ================= PRODUCT CARD ================= */



const ProductCard = ({ product , navigation}) => {
  const [quantity, setQuantity] = useState(0)

  useEffect(() => {
    const cartItem = cart.find(
      item => item.variantId?.toString() === product?._id?.toString()
    )
    setQuantity(cartItem?.quantity || 0)
  }, [cart, product])

  const onIncrease = () => {
    setCart({
      variantId: product._id,
      productId: product.Parent,
      ProductName: product.ProductName,
      ProductAmount: product.ProductAmount,
      coverImage: product.coverImage,
      StoreId: product.StoreId,
      StoreAddressID: product.address,
      actualMRP: product.pricing.actualMRP,
      discountedMRP: product.pricing.discountedPrice,
    })
  }

  const onDecrease = () => {
    deleteCart({
      variantId: product._id,
      actualMRP: product.pricing.actualMRP,
      discountedMRP: product.pricing.discountedPrice,
    })
  }

  if (!product) return null

  return (
    <TouchableOpacity 
     activeOpacity={0.9}
  onPress={() => {
    console.log(product,"kkkkkkkkkkkkkkkkkkkkkkkkkk")
    navigation.navigate('Screens', {
      screen: 'ProductDetail',
      params: {
        varientId: product?._id,
        productId: product?.Parent
      }
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
    }}>

      {/* IMAGE */}
      <View style={{ width: '100%', height: 110, padding: 10 }}>
        <Image
          source={{ uri: product.coverImage }}
          resizeMode="contain"
          style={{ width: '100%', height: '100%' }}
        />

        {/* DISCOUNT */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: '#2563eb',
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderTopLeftRadius: 10,
          borderBottomRightRadius: 10
        }}>
          <Text style={{ fontSize: 9, color: '#fff', fontWeight: 'bold' }}>
            {product?.pricing?.discountPercentage}% OFF
          </Text>
        </View>

        {/* ADD / QTY */}
        <View style={{ position: 'absolute', bottom: -12, alignSelf: 'center' }}>
          {quantity > 0 ? (
            <QuantitySelector
              quantity={quantity}
              max={product.Stock}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
            />
          ) : (
            <TouchableOpacity
              onPress={onIncrease}
              style={{
                backgroundColor: '#fff',
                borderColor: '#16a34a',
                borderWidth: 1,
                borderRadius: 8,
                width: 75,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: '#16a34a', fontSize: 12, fontWeight: '800' }}>
                ADD
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* CONTENT */}
      <View style={{ padding: 8, paddingTop: 14 }}>
        <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: '500', color: '#374151', height: 34 }}>
          {product.ProductName}
        </Text>

        <View style={{ marginTop: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ backgroundColor: '#f3f4f6', paddingHorizontal: 5, borderRadius: 4 }}>
            <Text style={{ fontSize: 9 }}>{product.ProductAmount}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Star size={10} fill="#facc15" color="#facc15" />
            <Text style={{ fontSize: 10, marginLeft: 2 }}>
              {product.rating}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 6, flexDirection: 'row', gap: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: '800' }}>
            ₹{product.pricing.discountedPrice}
          </Text>
          <Text style={{ fontSize: 10, color: '#9ca3af', textDecorationLine: 'line-through' }}>
            ₹{product.pricing.actualMRP}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}







  /* ================= UI ================= */
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* HEADER */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: StatusBar.currentHeight + 12,
        paddingBottom: 12,
        paddingHorizontal: 15,
        height: 90,
        backgroundColor: '#fbfbfbff',
        elevation: 1,
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={20} color="#000" />
        </TouchableOpacity>

        <Text style={{ fontSize: 14, fontWeight: '500', color: '#000' }}>
          Search Results
        </Text>

        <TouchableOpacity onPress={()=>{
          navigation.navigate('SearchProductScreen')
        }} style={{ flexDirection: 'row', gap: 18 , marginRight : 3}}>
          <Search size={19} color="#000" />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      {loading && page === 1 ? (
        <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#000" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ProductCard navigation={navigation} product={item} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          numColumns={3}
          style={{ marginTop: 10 }}
          contentContainerStyle={{ gap: 10 }}
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator style={{ marginVertical: 12 }} color="#000" />
            ) : null
          }
        />
      )}

      {/* POPUP CART */}
      <Animated.View style={[
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
          elevation: 12,
        },
        PopupCartAnimatedStyle,
      ]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Screens', { screen: 'ViewCartScreen' })}
          style={{
            width: width * 0.6,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}>

          <FlatList
            data={cartData}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                overflow: 'hidden',
                backgroundColor: '#fff',
                borderWidth: 1.5,
                borderColor: '#fff',
                marginLeft: index === 0 ? 0 : -12,
              }}>
                {item?.coverImage && (
                  <Image
                    source={{ uri: item.coverImage }}
                    resizeMode="cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
              </View>
            )}
          />

          <View>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
              {totalCartItems} item{totalCartItems > 1 ? 's' : ''}
            </Text>
            <Text style={{ color: '#dcfce7', fontSize: 11, fontWeight: '600' }}>
              View Cart
            </Text>
          </View>

          <View style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ArrowRight size={16} color="#16a34a" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default SearchResultScreen
