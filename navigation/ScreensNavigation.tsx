import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ChatScreen from '../screens/Main/NoTabs/ChatScreen';
import SearchScreen from '../screens/Main/NoTabs/SearchScreen';
import UserListScreen from '../screens/Main/NoTabs/UserList';
import UserProfileScreen from '../screens/Main/NoTabs/UsersProfile';
import ProductDetailScreen from '../screens/Main/NoTabs/ProductDetailScreen';
import LocationScreen from '../screens/Main/NoTabs/LocationScreen';
import LiveMapScreen from '../screens/Main/NoTabs/LiveMapScreen';

import OrderListScreen from '../screens/Main/NoTabs/OrderListScreen';
import SearchProductScreen from '../screens/Main/NoTabs/SearchProductScreen';
import LocationSettingScreen from '../screens/Main/NoTabs/LocationSettingScreen';
import SearchResultScreen from '../screens/Main/NoTabs/SearchedProductResultScreen';
import CartListScreen from '../screens/Main/NoTabs/CartScreen';
import OrderDetailScreen from '../screens/Main/NoTabs/OrderDetailScreen';
import WishListScreen from '../screens/Main/NoTabs/WishListScreen';
import ViewCartScreen from '../screens/Main/NoTabs/ViewCartScreen';
import CategoryScreen from '../screens/Main/NoTabs/CategoryScreen';
import HomeScreen from '../screens/Main/NoTabs/HomeScreen';
import ProfileScreen from '../screens/Main/NoTabs/ProfileScreen';
import ProfileUploadScreen from '../screens/Main/NoTabs/ProfilePhotoUpdateScreen';
import EditUserDetailsScreen from '../screens/Main/NoTabs/UserInfoUpdate';
import WalletScreen from '../screens/Main/NoTabs/WalletScreen';
import HelpSupportScreen from '../screens/Main/NoTabs/HelpSupportScreen';


const Stack = createNativeStackNavigator();

const ScreensNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown : false}}>
        <Stack.Screen name='HomeScreen' component={HomeScreen} options={{headerShown : false}} />

        <Stack.Screen name='ProfileScreen' component={ProfileScreen} options={{headerShown : false}} />

        <Stack.Screen name='EditUserDetailsScreen' component={EditUserDetailsScreen} options={{headerShown : false}} />
        <Stack.Screen name='LiveMapScreen' component={LiveMapScreen} options={{headerShown : false}} />
        <Stack.Screen name='HelpSupportScreen' component={HelpSupportScreen} options={{headerShown : false}} />
        <Stack.Screen name='WalletScreen' component={WalletScreen} options={{headerShown : false}} />
        <Stack.Screen name='ProfileUploadScreen' component={ProfileUploadScreen} options={{headerShown : false}} />
        <Stack.Screen name='ProductDetail' component={ProductDetailScreen}  options={{headerShown : false}}/>
        <Stack.Screen name='Chats' component={ChatScreen}  options={{headerShown : false}}/>
        <Stack.Screen name='Users' component={UserListScreen}  options={{headerShown : false}}/>
        <Stack.Screen name='Search' component={SearchScreen}  options={{headerShown : false}}/>
        <Stack.Screen name='LocationSelection' component={LocationScreen} options={{headerShown : false}}/>
       
        <Stack.Screen name='OrderLists' component={OrderListScreen} options={{headerShown : false}}/>
        <Stack.Screen name='SearchProductScreen' component={SearchProductScreen} options={{headerShown : false}}/>
        <Stack.Screen name='LocationSettingScreen' component={LocationSettingScreen} options={{headerShown : false}}/>
        <Stack.Screen name='SearchResultScreen' component={SearchResultScreen} options={{headerShown : false}}/>
        <Stack.Screen name='CartListScreen' component={CartListScreen} options={{headerShown : false}}/>
        <Stack.Screen name='OrderDetailScreen'   component={OrderDetailScreen}  options={{headerShown : false}}/>
        <Stack.Screen name='WishListScreen'   component={WishListScreen}  options={{headerShown : false}}/>
        <Stack.Screen name='CategoryScreen' component={CategoryScreen}  options={{headerShown : false}}/>
        <Stack.Screen name='ViewCartScreen'   component={ViewCartScreen}  options={{headerShown : false}}/>  
   </Stack.Navigator>
  )
}

export default ScreensNavigation