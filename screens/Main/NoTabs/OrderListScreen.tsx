import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronRight, Clock, MapPin, CheckCircle2, Circle } from 'lucide-react-native';
import userStore from '../../../store/MyStore';

const { width } = Dimensions.get('window');

/* ================= THEME & STYLES ================= */

const COLORS = {
  primary: '#0C831F', // Blinkit Green
  secondary: '#FDE800', // Blinkit Yellow
  bg: '#F4F6FB',
  white: '#FFFFFF',
  textMain: '#1F2937',
  textSub: '#6B7280',
  border: '#E5E7EB',
  blue: '#3B82F6',
};

/* ================= UTILS ================= */

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

/* ================= COMPONENTS ================= */

// A cleaner skeleton for better UX
const SkeletonCard = () => (
  <View style={[styles.card, { opacity: 0.5 }]}>
    <View style={{ height: 20, width: '40%', backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 12 }} />
    <View style={{ flexDirection: 'row' }}>
      <View style={{ width: 60, height: 60, backgroundColor: '#E5E7EB', borderRadius: 8 }} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <View style={{ height: 15, width: '80%', backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 8 }} />
        <View style={{ height: 12, width: '50%', backgroundColor: '#F3F4F6', borderRadius: 4 }} />
      </View>
    </View>
  </View>
);

const OrderCard = ({ order, onPress }) => {
  const product = order?.cart?.[0];
  const totalItems = order?.cart?.reduce((sum, item) => sum + item.quantity, 0);
  const isDelivered = order?.orderStatus === 'Delivered';

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      {/* Status Header */}
      <View style={styles.cardHeader}>
        <View style={styles.statusBadge}>
          {isDelivered ? (
            <CheckCircle2 size={14} color={COLORS.primary} strokeWidth={3} />
          ) : (
            <Clock size={14} color={COLORS.blue} strokeWidth={3} />
          )}
          <Text style={[styles.statusText, { color: isDelivered ? COLORS.primary : COLORS.blue }]}>
            {order?.orderStatus}
          </Text>
        </View>
        <Text style={styles.dateText}>{formatDate(order?.createdAt)}</Text>
      </View>

      {/* Main Info */}
      <View style={styles.productSection}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product?.coverImage }} style={styles.image} resizeMode="contain" />
        </View>
        
        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={styles.productTitle}>
            {order?.cart?.length > 1 
              ? `${product?.ProductName} & ${order.cart.length - 1} more` 
              : product?.ProductName}
          </Text>
          <View style={styles.detailsRow}>
            <Text style={styles.subInfo}>₹{order?.totalAmountToPay}</Text>
            <View style={styles.dot} />
            <Text style={styles.subInfo}>{totalItems} {totalItems > 1 ? 'items' : 'item'}</Text>
          </View>
          
          <View style={styles.addressRow}>
            <MapPin size={12} color={COLORS.textSub} />
            <Text numberOfLines={1} style={styles.addressText}>
              {order?.deliveryAddress?.city}, {order?.deliveryAddress?.pincode}
            </Text>
          </View>
        </View>

        <ChevronRight size={18} color="#D1D5DB" />
      </View>

      {/* Footer Action */}
      <View style={styles.cardFooter}>
         <View style={styles.paymentMethod}>
            <Text style={styles.paymentText}>{order?.paymentMethod || 'Prepaid'}</Text>
         </View>
         <TouchableOpacity style={styles.reorderBtn}>
            <Text style={styles.reorderText}>View Items</Text>
         </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

/* ================= MAIN SCREEN ================= */

const OrderListScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchOrders = userStore((state) => state.fetchOrders);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchOrders(1, 20);
      if (response?.success) setOrders(response.orders);
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={COLORS.textMain} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Order History</Text>
          <Text style={styles.headerSub}>View all your past purchases</Text>
        </View>
      </View>

      <FlatList
        data={loading ? [1, 2, 3] : orders}
        keyExtractor={(item, index) => (loading ? index.toString() : item._id)}
        renderItem={({ item }) => loading ? <SkeletonCard /> : (
          <OrderCard order={item} onPress={() => navigation.navigate('OrderDetailScreen', { order: item })} />
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    backgroundColor: '#fff',
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: { padding: 8, marginLeft: -8, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textMain },
  headerSub: { fontSize: 12, color: COLORS.textSub, marginTop: -2 },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '800', marginLeft: 4, letterSpacing: 0.5 },
  dateText: { fontSize: 12, color: COLORS.textSub, fontWeight: '500' },
  productSection: { flexDirection: 'row', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  imageContainer: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  image: { width: 45, height: 45 },
  infoContainer: { flex: 1, marginLeft: 12 },
  productTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textMain, marginBottom: 4 },
  detailsRow: { flexDirection: 'row', alignItems: 'center' },
  subInfo: { fontSize: 13, fontWeight: '600', color: COLORS.textMain },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#D1D5DB', marginHorizontal: 8 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  addressText: { fontSize: 12, color: COLORS.textSub, marginLeft: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  reorderBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.primary },
  reorderText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  paymentMethod: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  paymentText: { fontSize: 10, fontWeight: '700', color: COLORS.textSub, textTransform: 'uppercase' },
});

export default OrderListScreen;