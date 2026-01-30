import {
  View,
  Text,
  Dimensions,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Image,
  Keyboard,
} from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import userStore from '../../../store/MyStore'
import { useNavigation } from '@react-navigation/native'
import { ArrowLeft, Search } from 'lucide-react-native'

const { width } = Dimensions.get('screen')

/* =======================
   DEBOUNCE
======================= */
const debounce = (func, delay) => {
  let timeoutId
  return (text) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(text), delay)
  }
}

const SearchProductScreen = () => {
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const { fetchSearchedProduct } = userStore()
  const navigation = useNavigation()

  /* =======================
     FETCH SUGGESTIONS
  ======================= */
  const fetchSuggestions = useCallback(async (text) => {
    if (!text.trim()) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetchSearchedProduct(text, 1, 5)

      const list = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.products)
        ? response.products
        : []

      setSuggestions(list)
    } catch (err) {
      console.log(err)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const debouncedSearch = useMemo(
    () => debounce(fetchSuggestions, 500),
    [fetchSuggestions]
  )

  const handleSearch = (text) => {
    setQuery(text)
    debouncedSearch(text)
  }

  
  const handleSubmit = () => {
    if (query.trim()) {
      Keyboard.dismiss()
      navigation.navigate('SearchResultScreen', { text: query.trim() })
    }
  }

 
  
  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('ProductDetail', {
          productId: item?.Parent,
          varientId: item?._id,
        })
      }
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 0.7,
        borderBottomColor: '#e0e0e0',
      }}
    >
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text
          style={{ fontSize: 16, fontWeight: '500', color: '#000' }}
          numberOfLines={2}
        >
          {item?.ProductName || 'Product'}
        </Text>
        <Text style={{ fontSize: 13, color: '#777', marginTop: 4 }}>
          ⭐ {item?.rating ?? '4.0'}
        </Text>
      </View>

      <Image
        source={{ uri: item?.coverImage }}
        style={{
          width: 46,
          height: 46,
          borderRadius: 6,
          backgroundColor: '#f2f2f2',
        }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* HEADER */}
     <View
  style={{
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  }}
>
  {/* BACK */}
  <TouchableOpacity
  onPress={()=>{
    navigation.goBack()
  }}
    activeOpacity={0.7}
    style={{
      height: 36,
      width: 36,
      borderRadius: 18,
      backgroundColor: '#f3f4f6',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    }}
  >
    <ArrowLeft size={20} color="#111" />
  </TouchableOpacity>

  {/* SEARCH BAR */}
  <View
    style={{
      flex: 1,
      backgroundColor: '#f9fafb',
      borderRadius: 18,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: '#16a34a',
    }}
  >
    {/* SEARCH ICON */}
    <Search size={16} color="#9ca3af" />

    <TextInput
      value={query}
      onChangeText={handleSearch}
      placeholder="Search grocery & more"
      placeholderTextColor="#9ca3af"
      style={{
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 14,
        color: '#111',
      }}
      returnKeyType="search"
      onSubmitEditing={handleSubmit}
    />
  </View>
</View>


      {/* LOADER */}
      {loading && (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#000" />
      )}

      {/* LIST */}
      {!loading && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item?._id}
          renderItem={renderSuggestion}
          ListEmptyComponent={
            query ? (
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 40,
                  fontSize: 16,
                  color: '#777',
                }}
              >
                No products found
              </Text>
            ) : null
          }
        />
      )}
    </View>
  )
}

export default SearchProductScreen
