import { View, Text, TouchableOpacity, StatusBar, Dimensions, Image, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, ChevronRight, Ticket, Info, Banknote, Smartphone, CheckCircle2, Circle, Heart, MapPin, Building, Home, Wallet, XCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import userStore from '../../../store/MyStore';

const { width } = Dimensions.get('window');

// --- Header ---
const CollapsableHeader = ({ navigation, itemCount }) => (
    <View style={{
        paddingTop: StatusBar.currentHeight || 24,
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f3f3',
    }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                <ArrowLeft size={24} color="#111827" />
            </TouchableOpacity>
            <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827' }}>Checkout</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>{itemCount} Items</Text>
            </View>
        </View>
    </View>
);

// --- Savings Banner ---
const SavingsBanner = ({ totalDiscountedMoney }) => (
    <View style={{
        backgroundColor: '#eff6ff',
        marginHorizontal: 12,
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bfdbfe',
        borderStyle: 'dashed'
    }}>
        <View style={{ backgroundColor: '#2563eb', padding: 6, borderRadius: 20 }}>
            <Ticket size={14} color="#fff" />
        </View>
        <Text style={{ marginLeft: 10, fontSize: 13, color: '#1e40af', fontWeight: '700' }}>
            YAY! You are saving ₹{totalDiscountedMoney} on this order
        </Text>
    </View>
);
const WalletBalanceCard = ({ 
  balance = 0, 
  walletDiscount = 0, 
  setwalletDiscount, 
  grandTotal, 
  setgrandTotal 
}) => {
  const [amount, setAmount] = useState('');
  const [isApplied,setIsApplied] = useState(false);
  // 1. APPLY WALLET MONEY
  const handleApply = () => {
    const numericAmount = parseFloat(amount);
    
    // Validation
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    if (numericAmount > balance) {
      Alert.alert("Insufficient Wallet", "You don't have enough money in your wallet.");
      return;
    }

    if (numericAmount > grandTotal) {
      Alert.alert("Limit Reached", "You cannot apply more than the total bill amount.");
      return;
    }

    // Update States
    setwalletDiscount(numericAmount);
    setgrandTotal(prev => prev - numericAmount);
    setIsApplied(true);
    setAmount(''); // Reset input
  };

  // 2. REMOVE WALLET MONEY
 // Inside WalletBalanceCard component
const handleRemoveWallet = () => {
    // Crucial: Use the current walletDiscount value before resetting it
    setgrandTotal(prev => prev + walletDiscount); 
    setwalletDiscount(0);
    setAmount('');
    setIsApplied(false);
};

  const useMaxBalance = () => {
    // Cannot use more than what's in the wallet OR the bill itself
    const maxPossible = Math.min(balance, grandTotal);
    setAmount(maxPossible.toString());
  };



  return (
    <View
      style={{
        backgroundColor: isApplied ? '#F0F9FF' : '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 16,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: isApplied ? '#BAE6FD' : '#E2E8F0',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      {/* HEADER SECTION */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#DBEAFE', padding: 8, borderRadius: 10, marginRight: 12 }}>
            <Wallet size={20} color="#2563EB" />
          </View>
          <View>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
              Your Wallet
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1E293B' }}>
              ₹{balance.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {isApplied && (
          <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
            <Text style={{ fontSize: 10, fontWeight: '800', color: '#16A34A' }}>APPLIED</Text>
          </View>
        )}
      </View>

      <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 15 }} />

      {/* CONDITIONAL BODY: INPUT OR REMOVE BUTTON */}
      {!isApplied ? (
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569' }}>Apply Wallet Money</Text>
            <TouchableOpacity onPress={useMaxBalance}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#2563EB' }}>Use Max</Text>
            </TouchableOpacity>
          </View>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 50,
            borderWidth: 1,
            borderColor: '#E2E8F0',
          }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B' }}>₹</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={'#000'}
              style={{ flex: 1, fontSize: 16, fontWeight: '700', marginLeft: 8, color: '#1E293B' }}
            />
            <TouchableOpacity
              onPress={handleApply}
              style={{ backgroundColor: '#2563EB', paddingHorizontal: 15, height: 34, borderRadius: 8, justifyContent: 'center' }}
            >
              <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '700' }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#FFF',
          padding: 15,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#16A34A',
          borderStyle: 'dashed'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckCircle2 size={22} color="#16A34A" />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500' }}>Savings from wallet</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#16A34A' }}>- ₹{walletDiscount}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={handleRemoveWallet}
            activeOpacity={0.7}
            style={{ 
              backgroundColor: '#FEF2F2', 
              paddingHorizontal: 12, 
              paddingVertical: 8, 
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <XCircle size={16} color="#EF4444" />
            <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 12, marginLeft: 5 }}>REMOVE</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// --- Quote Card ---
const ExperienceQuote = () => (
    <View style={{ padding: 25, alignItems: 'center', justifyContent: 'center' }}>
        <Heart size={24} color="#e11d48" fill="#e11d48" style={{ marginBottom: 8, opacity: 0.6 }} />
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', textAlign: 'center' }}>
            Ordering for someone special?
        </Text>
        <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 4, lineHeight: 18 }}>
            Our partners ensure every delivery brings a smile.{"\n"}Thank you for choosing us, see you again!
        </Text>
    </View>
);

// --- Billing Details ---
const BillingDetails = ({ totalAmountToPay, totalDiscountedMoney, handlingFee, deliveryFee, PlatformFees, grandTotal , walletDiscount}) => {
    const Row = ({ label, value, isBold = false, isDiscount = false, hasIcon = false }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: isBold ? '#000' : '#4b5563', fontWeight: isBold ? '700' : '400' }}>{label}</Text>
                {hasIcon && <Info size={12} color="#9ca3af" style={{ marginLeft: 4 }} />}
            </View>
            <Text style={{ fontSize: 13, color: isDiscount ? '#16a34a' : '#000', fontWeight: '600' }}>
                {isDiscount ? `-₹${value}` : `₹${value}`}
            </Text>
        </View>
    );

    return (
        <View style={{ backgroundColor: '#fff', marginHorizontal: 12, marginVertical: 12, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' }}>
            <Text style={{ fontSize: 15, fontWeight: '800', marginBottom: 16 }}>Bill Details</Text>
            <Row label="Item Total" value={totalAmountToPay + totalDiscountedMoney} />
            {walletDiscount > 0 && <Row label= "Wallet Discount" value={walletDiscount} isDiscount/>}
            <Row label="Product Discount" value={totalDiscountedMoney} isDiscount />
            <Row label="Delivery Charge" value={deliveryFee} />
            <Row label="Handling Charge" value={handlingFee} hasIcon />
            <Row label="Platform Fees" value={PlatformFees} />
            <View style={{ height: 1, backgroundColor: '#f3f3f3', marginVertical: 10 }} />
<Row label="Grand Total" value={grandTotal} isBold />
        </View>
    );
};

// --- Cart Items ---
const ViewCartCard = ({ cartItems, onAdd, onRemove }) => {

    const renderItem = (item) => (
        <View key={item.variantId} style={{ flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f3f3' }}>
            <Image source={{ uri: item.coverImage }} style={{ width: 64, height: 64, borderRadius: 8, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#f3f3f3' }} />
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }}>{item.ProductName}</Text>
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{item.ProductAmount}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#000' }}>₹{item.discountedMRP}</Text>
                    <Text style={{ fontSize: 12, color: '#9ca3af', textDecorationLine: 'line-through', marginLeft: 6 }}>₹{item.actualMRP}</Text>
                </View>
            </View>
            <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#16a34a', borderRadius: 8, backgroundColor: '#f0fdf4' }}>
                    <TouchableOpacity onPress={() => onRemove({variantId : item.variantId , actualMRP : item.actualMRP  , discountedMRP : item.discountedMRP }) } style={{ padding: 6, paddingHorizontal: 10 }}><Text style={{ color: '#16a34a', fontWeight: 'bold' }}>-</Text></TouchableOpacity>
                    <Text style={{ color: '#16a34a', fontWeight: 'bold', minWidth: 20, textAlign: 'center' }}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => onAdd(item)} style={{ padding: 6, paddingHorizontal: 10 }}><Text style={{ color: '#16a34a', fontWeight: 'bold' }}>+</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={{ backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' }}>
            {cartItems.map((item) => renderItem(item))}
        </View>
    );
};


const Address = ({ address, navigation }) => {
  // 1. ADD THIS GUARD: If the store hasn't loaded the address, don't try to render
  if (!address) return null; 

  return (
    <View style={{ width, alignItems: 'center', marginVertical: 6 }}>
      <View
        style={{
          width: width * 0.94,
          backgroundColor: '#fff',
          borderRadius: 14,
          padding: 14,
          borderWidth: 1,
          borderColor: '#F1F1F1',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1, marginRight: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              backgroundColor: '#F7FCF8', 
              paddingHorizontal: 6, 
              paddingVertical: 2, 
              borderRadius: 4,
              marginRight: 8
            }}>
              {/* This is where it was crashing if address was undefined */}
              {address.addressType === 'home' ? (
                <Home size={10} color="#0C831F" strokeWidth={2} />
              ) : (
                <Building size={10} color="#0C831F" strokeWidth={2} />
              )}
              <Text style={{ marginLeft: 4, fontSize: 9, fontWeight: '700', color: '#0C831F', textTransform: 'uppercase' }}>
                {address.addressType === 'home' ? 'Home' : 'Work'}
              </Text>
            </View>
            <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '500' }}>
              {address.pincode}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
            <MapPin size={14} color="#4B5563" style={{ marginTop: 2, marginRight: 4 }} strokeWidth={2} />
            <Text
              numberOfLines={1}
              style={{ fontSize: 14, fontWeight: '600', color: '#1F2937', flex: 1 }}
            >
              {address.addressLine1 || address.fullAddress}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 18 }}>
            <Smartphone size={12} color="#9CA3AF" strokeWidth={1.5} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: '#6B7280', fontWeight: '400' }}>
              {address.mobileNo?.[0] || address.mobile || 'N/A'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('LocationSettingScreen')}
          activeOpacity={0.7}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#0C831F',
            backgroundColor: '#fff',
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#0C831F' }}>
            Change
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Payment Method Card ---
const PaymentMethodCard = ({ selectedMethod, setSelectedMethod }) => {
    const methods = [
        { id: 'UPI', label: 'UPI (PhonePe, Google Pay, Paytm)', icon: <Smartphone size={20} color="#6366f1" /> },
        { id: 'COD', label: 'Cash on Delivery', icon: <Banknote size={20} color="#16a34a" /> },
        
    ];

    return (
        <View style={{ backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' }}>
            <Text style={{ fontSize: 15, fontWeight: '800', marginBottom: 16 }}>Select Payment Method</Text>
            {methods.map((item, index) => (
                <TouchableOpacity 
                    key={item.id}
                    onPress={() => setSelectedMethod(item.id)}
                    activeOpacity={0.8}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: index === 0 ? 1 : 0, borderBottomColor: '#f3f3f3' }}
                >
                    <View style={{ width: 32 }}>{item.icon}</View>
                    <Text style={{ flex: 1, fontSize: 14, color: '#374151', fontWeight: '500' }}>{item.label}</Text>
                    {selectedMethod === item.id ? <CheckCircle2 size={22} color="#16a34a" fill="#dcfce7" /> : <Circle size={22} color="#d1d5db" />}
                </TouchableOpacity>
            ))}
        </View>
    );
};

// --- Main Screen ---

const ViewCartScreen = () => {
    const [selectedMethod, setSelectedMethod] = useState('UPI');
    const [walletDiscount,setwalletDiscount] = useState(0);
    const navigation = useNavigation();
    const [OrderLoading , setOrderLoading] = useState(false)
    const { cart, setCart, totalCartItems,deleteCart, totalAmounttoPay,  EmptyCart, totalDiscountedMoney ,deliveryAddress, OrderProduct , PlaceOnlinePaymentOrder , VerifyOnlinePayment ,FetchWalletMoney} = userStore();
    
    const [WalletTotalAmount , setWalletTotalAmount] = useState(0);
    const handlingFee = 5, deliveryFee = 10, PlatformFee = 3;
    const [grandTotal, setgrandTotal] = useState(0);



    const FetchMyWallet = async ()=>{
      try{
  const response =  await  FetchWalletMoney()

  if(response.success){
  setWalletTotalAmount(response?.result.WalletMoney);
  }
      }catch(error){
        console.log(error)

      }
    }
    useEffect(()=>{
   FetchMyWallet();
    },[])

  

const handleOrder = async () => {
  if (OrderLoading) return;
  setOrderLoading(true);

  try {
    const data = {
      cart,
      WalletDiscount : walletDiscount,
      totalAmountToPay: grandTotal,
      totalAmountOfProductsMoney: totalAmounttoPay,
      DeliveryCharge: deliveryFee,
      PlatFormFees: PlatformFee,
      HandellingFees: handlingFee,
      totalDiscountedMoney,
      deliveryAddress: cart[0]?.StoreAddressID,
      appliedOfferId: '',
    };


    if(grandTotal === 0  && walletDiscount > 0){
      const orderRes = await OrderProduct({
        ...data,
        paymentMethod: "WALLET",
        paymentDone: true,
      });

      if (orderRes.success) {

         EmptyCart()


         navigation.reset({
  index: 0,
  routes: [
    {
      name: "Screens",
    },
  ],
});

      }


    }else if(grandTotal > 0 && walletDiscount > 0 && selectedMethod === 'UPI'){

       const orderIdRes = await PlaceOnlinePaymentOrder(data);
      if (!orderIdRes.success) return;

      const verifyRes = await VerifyOnlinePayment({
        ...orderIdRes.verificationData,
      });
      if (!verifyRes.success) return;

      const orderRes = await OrderProduct({
        ...data,
        paymentDone: true,
        paymentMethod: "WALLET AND UPI",
        paymentId: verifyRes.paymentDoc._id,
      });

      if (orderRes.success) {

        EmptyCart()
        navigation.reset({
  index: 0,
  routes: [
    {
      name: "Screens",
    },
  ],
});

      }






    }else if(grandTotal > 0 && walletDiscount > 0 && selectedMethod === 'COD'){
      const orderRes = await OrderProduct({
        ...data,
        paymentMethod: "WALLET AND COD",
        paymentDone: false,
      });

      if (orderRes.success) {

         EmptyCart()


         navigation.reset({
  index: 0,
  routes: [
    {
      name: "Screens",
    },
  ],
});

      }


    }else if (selectedMethod === "UPI" && walletDiscount === 0) {
        
      const orderIdRes = await PlaceOnlinePaymentOrder(data);
      if (!orderIdRes.success) return;

      const verifyRes = await VerifyOnlinePayment({
        ...orderIdRes.verificationData,
      });
      if (!verifyRes.success) return;

      const orderRes = await OrderProduct({
        ...data,
        paymentDone: true,
        paymentMethod: "UPI",
        paymentId: verifyRes.paymentDoc._id,
      });

      if (orderRes.success) {

        EmptyCart()
        navigation.reset({
  index: 0,
  routes: [
    {
      name: "Screens",
    },
  ],
});

      }
    } 
     else if (selectedMethod === "COD" && walletDiscount === 0) {

      const orderRes = await OrderProduct({
        ...data,
        paymentMethod: "COD",
        paymentDone: false,
      });

      if (orderRes.success) {

         EmptyCart()


         navigation.reset({
  index: 0,
  routes: [
    {
      name: "Screens",
    },
  ],
});

      }
    }

  } catch (error) {
    console.log("handleOrder error:", error);
  } finally {
    setOrderLoading(false);
  }
};




  
  useEffect(() => {
    const baseTotal = deliveryFee + handlingFee + PlatformFee + totalAmounttoPay;
    // We set the total as Base Price MINUS whatever is currently in walletDiscount
    setgrandTotal(baseTotal - walletDiscount);
}, [totalAmounttoPay, walletDiscount]); // Added walletDiscount here

    return (
        
        <View style = {{flex : 1}}>
{
            totalCartItems > 0 ? (<View style={{ flex: 1, backgroundColor: '#f8f9fb' }}>
            <CollapsableHeader navigation={navigation} itemCount={cart.length} />
            


            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {totalDiscountedMoney > 0 && <SavingsBanner totalDiscountedMoney={totalDiscountedMoney} />}
                
                <Address address={deliveryAddress} navigation={navigation}/>
                <ViewCartCard cartItems={cart} onAdd={setCart} onRemove={deleteCart} />
                
                <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' }}>
                    <Ticket size={20} color="#2563eb" />
                    <Text style={{ flex: 1, marginLeft: 12, fontWeight: '600', fontSize: 14 }}>Apply Coupon</Text>
                    <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>

                <PaymentMethodCard  selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />
                <WalletBalanceCard 
  setgrandTotal={setgrandTotal} 
  grandTotal={grandTotal} 
  balance={WalletTotalAmount}  
  walletDiscount={walletDiscount} // Add this line
  setwalletDiscount={setwalletDiscount}
/>
                <BillingDetails 
                    walletDiscount={walletDiscount}
                    deliveryFee={deliveryFee} 
                    handlingFee={handlingFee} 
                    PlatformFees={PlatformFee} 
                    grandTotal={grandTotal} 
                    totalAmountToPay={totalAmounttoPay} 
                    totalDiscountedMoney={totalDiscountedMoney} 
                />

                <ExperienceQuote />
            </ScrollView>

            {/* Final Place Order Bar */}
            <View style={{
                position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', 
                padding: 16, paddingBottom: 30, borderTopWidth: 1, borderTopColor: '#f3f3f3',
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 4
            }}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: '#000' }}>₹{grandTotal}</Text>
                    <Text style={{ fontSize: 11, color: '#16a34a', fontWeight: '700' }}>TOTAL BILL</Text>
                </View>
                { OrderLoading ? (<ActivityIndicator size={30} color={'#000'}/>) : (<TouchableOpacity 
                    style={{ backgroundColor: '#16a34a', paddingVertical: 14, paddingHorizontal: 35, borderRadius: 12, flexDirection: 'row', alignItems: 'center' }}
                    onPress={handleOrder}
                >
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16, marginRight: 8 }}>
                        {selectedMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                    </Text>
                    <ChevronRight size={18} color="#fff" strokeWidth={3} />
                </TouchableOpacity>)}
            </View>
        </View>) : (<View style = {{flex : 1 , alignItems : 'center' , justifyContent : 'center' , backgroundColor : '#fff'}}>
            <Text style = {{fontSize : 15 , fontWeight : '600' , color : 'black'}}>No Carts</Text>
            </View>)
        }
        </View>
    );
}

export default ViewCartScreen;