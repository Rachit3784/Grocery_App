import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { ChevronLeft, Wallet, ShieldCheck, Zap, Sparkles, ArrowRight, Info } from 'lucide-react-native';
import userStore from '../../../store/MyStore';

const { width } = Dimensions.get('window');



import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';

const Skeleton = ({ style }) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmer.value, [0, 1], [-120, 120]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={[
        {
          backgroundColor: '#E5E7EB',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: 80,
            backgroundColor: 'rgba(255,255,255,0.5)',
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const WalletSkeleton = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFBFF' }}>

      {/* ---------- HEADER ---------- */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginTop: 30,
          paddingVertical: 12,
          backgroundColor: '#FFF',
        }}
      >
        <Skeleton style={{ width: 32, height: 32, borderRadius: 16 }} />
        <Skeleton style={{ width: 80, height: 12, borderRadius: 6 }} />
        <View style={{ width: 32 }} />
      </View>

      {/* ---------- BALANCE CARD ---------- */}
      <View style={{ padding: 16, backgroundColor: '#FFF' }}>
        <View
          style={{
            backgroundColor: '#EFF6FF',
            borderRadius: 20,
            padding: 20,
          }}
        >
          <Skeleton style={{ width: 100, height: 10, borderRadius: 4 }} />
          <Skeleton style={{ width: 160, height: 32, marginTop: 10 }} />
          <Skeleton style={{ width: 90, height: 18, marginTop: 20 }} />
        </View>
      </View>

      {/* ---------- INPUT CARD ---------- */}
      <View
        style={{
          margin: 16,
          padding: 20,
          backgroundColor: '#FFF',
          borderRadius: 20,
        }}
      >
        <Skeleton style={{ width: 120, height: 12 }} />
        <Skeleton style={{ width: '100%', height: 42, marginTop: 14 }} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16,
          }}
        >
          {[1, 2, 3, 4].map(i => (
            <Skeleton
              key={i}
              style={{
                width: 60,
                height: 24,
                borderRadius: 8,
              }}
            />
          ))}
        </View>

        <Skeleton
          style={{
            width: '100%',
            height: 50,
            borderRadius: 15,
            marginTop: 24,
          }}
        />
      </View>

      {/* ---------- BENEFITS ---------- */}
      <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
        <Skeleton style={{ width: 120, height: 12, marginBottom: 12 }} />

        {[1, 2, 3].map(i => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Skeleton
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
              }}
            />
            <View style={{ marginLeft: 12 }}>
              <Skeleton style={{ width: 140, height: 12 }} />
              <Skeleton
                style={{
                  width: 180,
                  height: 10,
                  marginTop: 6,
                }}
              />
            </View>
          </View>
        ))}
      </View>

      {/* ---------- TERMS ---------- */}
      <View style={{ padding: 20 }}>
        <Skeleton style={{ width: 140, height: 10, marginBottom: 10 }} />
        <Skeleton style={{ width: '100%', height: 8, marginBottom: 6 }} />
        <Skeleton style={{ width: '90%', height: 8, marginBottom: 6 }} />
        <Skeleton style={{ width: '80%', height: 8 }} />
      </View>

    </SafeAreaView>
  );
};



const WalletScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('500');
  const [balance , setBalance] = useState(0);
  const {PlaceOnlinePaymentOrder , VerifyOnlinePayment , AddWalletMoney , FetchWalletMoney} = userStore();
  const [loading,setLoading] = useState(false)

  useEffect(()=>{
    console.log("oooooooooooooooo")
  FetchMYWalletMoney()
  },[])

  const handlePaymentAddition = async ()=>{
    try{
      console.log('I am wallet')
     const res = await   PlaceOnlinePaymentOrder({totalAmountToPay : amount})
  
      if (!res.success) return;

      const verifyRes = await VerifyOnlinePayment({
        ...res.verificationData,
      });
      if (!verifyRes.success) return;

      const WalletRes = await AddWalletMoney({
        WalletMoney : verifyRes?.paymentDoc.amount_Paid
      });

     if(WalletRes.success){
      FetchMYWalletMoney()
// setBalance(parseInt(WalletRes?.result?.WalletMoney))
     }
    }catch(error){
      console.log(error)
    }
  }

  const FetchMYWalletMoney = async ()=>{
    setLoading(true)
  try{
  const response = await FetchWalletMoney();
  if(response.success){
    setBalance(response?.result?.WalletMoney);
  }
  }catch(error){
console.log(error);
  }finally{
setTimeout(()=>{
  setLoading(false)
},500)
  }
  }

  


  return (
<View style = {{flex : 1}}>

  
    {
      loading ? (<WalletSkeleton />) : (<SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backCircle}>
          <ChevronLeft size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <View style={{ width: 32 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* --- MODERN BALANCE CARD --- */}
        <View style={styles.heroSection}>
          <View style={styles.glassCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={styles.smallLabel}>Current Balance</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Text style={styles.currency}>₹</Text>
                  <Text style={styles.balanceMain}>{balance}</Text>
                </View>
              </View>
              <View style={styles.iconBadge}>
                <Wallet size={18} color="#2563EB" />
              </View>
            </View>
            
            <View style={styles.cardFooter}>
              <View style={styles.statusPill}>
                <View style={styles.dot} />
                <Text style={styles.statusText}>Active & Secure</Text>
              </View>
            </View>
          </View>
        </View>

        {/* --- INPUT SECTION --- */}
        <View style={styles.inputCard}>
          <Text style={styles.inputTitle}>Top-up Amount</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputPrefix}>₹</Text>
            <TextInput
              style={styles.textInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          <View style={styles.chipContainer}>
            {['100', '500', '1000', '2000'].map((val) => (
              <TouchableOpacity 
                key={val} 
                onPress={() =>setAmount(val)}
                style={[styles.chip, amount === val && styles.activeChip]}
              >
                <Text style={[styles.chipText, amount === val && styles.activeChipText]}>+₹{val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity  onPress={handlePaymentAddition} style={styles.payBtn} activeOpacity={0.9}>
            <Text style={styles.payBtnText}>Proceed to Pay</Text>
            <ArrowRight size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* --- BENEFITS (SMALL FONTS & ICONS) --- */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Why use wallet?</Text>
          
          <View style={styles.benefitBox}>
            <BenefitItem 
              icon={<Zap size={14} color="#059669" />} 
              title="Instant Refunds" 
              desc="Money goes back to wallet in seconds" 
            />
            <View style={styles.divider} />
            <BenefitItem 
              icon={<Sparkles size={14} color="#2563EB" />} 
              title="Cashback Rewards" 
              desc="Earn up to ₹50 on every refill" 
            />
            <View style={styles.divider} />
            <BenefitItem 
              icon={<ShieldCheck size={14} color="#059669" />} 
              title="Safe Checkout" 
              desc="No bank failure during peak hours" 
            />
          </View>
        </View>

        {/* --- TERMS (TINY FONTS) --- */}
        <View style={styles.termsBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Info size={12} color="#9CA3AF" />
            <Text style={styles.termsTitle}>Important Information</Text>
          </View>
          <Text style={styles.termText}>• Maximum balance limit is ₹10,000.</Text>
          <Text style={styles.termText}>• Wallet balance is non-transferable to other users or banks.</Text>
          <Text style={styles.termText}>• By topping up, you agree to the Wallet Terms of Service.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>)
    }
    

</View>
    
  );
};

const BenefitItem = ({ icon, title, desc }) => (
  <View style={styles.benefitRow}>
    <View style={styles.iconSmallCircle}>{icon}</View>
    <View style={{ marginLeft: 12 }}>
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitDesc}>{desc}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFF' }, // Very light blue tint
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop : 30,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  
  heroSection: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 2,
    shadowColor: '#2563EB',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  glassCard: {
    backgroundColor: '#EFF6FF', // Light blue
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  smallLabel: { fontSize: 11, fontWeight: '600', color: '#60A5FA', textTransform: 'uppercase', letterSpacing: 0.5 },
  currency: { fontSize: 18, fontWeight: '700', color: '#1E40AF', marginTop: 4, marginRight: 2 },
  balanceMain: { fontSize: 32, fontWeight: '800', color: '#1E40AF' },
  iconBadge: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  
  cardFooter: { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#DBEAFE' },
  statusPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 },
  statusText: { fontSize: 10, fontWeight: '700', color: '#059669' },

  inputCard: { margin: 16, padding: 20, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  inputTitle: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  inputPrefix: { fontSize: 24, fontWeight: '800', color: '#111827' },
  textInput: { flex: 1, fontSize: 28, fontWeight: '800', color: '#111827', marginLeft: 8 },
  
  chipContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6' },
  activeChip: { borderColor: '#10B981', backgroundColor: '#F0F9F1' },
  chipText: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  activeChipText: { color: '#059669' },

  payBtn: {
    backgroundColor: '#059669', // Modern Light Green
    height: 50,
    borderRadius: 15,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800', marginRight: 8 },

  section: { paddingHorizontal: 16, marginTop: 10 },
  sectionHeader: { fontSize: 12, fontWeight: '800', color: '#1F2937', marginBottom: 12, marginLeft: 4 },
  benefitBox: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#F3F4F6' },
  benefitRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  iconSmallCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  benefitTitle: { fontSize: 13, fontWeight: '700', color: '#111827' },
  benefitDesc: { fontSize: 11, color: '#9CA3AF' },
  divider: { height: 1, backgroundColor: '#F9FAFB', marginVertical: 4 },

  termsBox: { padding: 20, marginTop: 10 },
  termsTitle: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginLeft: 6 },
  termText: { fontSize: 10, color: '#9CA3AF', marginBottom: 4, lineHeight: 14 },
});

export default WalletScreen;