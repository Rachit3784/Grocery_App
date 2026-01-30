import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { ChevronLeft, MapPin, Phone, Download, HelpCircle, CheckCircle2 } from "lucide-react-native";

const STATUS_STEPS = ["Ordered", "Packed", "Shipped", "NearTown", "Delivered"];

const OrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const productList = order.cart || [];
  const address = order.deliveryAddress;
  const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F6FB" }}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.headerTitle}>Order #{order._id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.headerSub}>Placed on {new Date(order.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- TRACKING SECTION (Vertical Style) --- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Tracking</Text>
          <View style={{ marginTop: 15 }}>
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isLast = index === STATUS_STEPS.length - 1;
              return (
                <View key={step} style={{ flexDirection: 'row', minHeight: 45 }}>
                  <View style={{ alignItems: 'center', width: 30 }}>
                    <View style={[styles.trackerDot, { backgroundColor: isCompleted ? "#0C831F" : "#E5E7EB" }]}>
                       {isCompleted && <CheckCircle2 size={12} color="#fff" />}
                    </View>
                    {!isLast && <View style={[styles.trackerLine, { backgroundColor: isCompleted ? "#0C831F" : "#E5E7EB" }]} />}
                  </View>
                  <View style={{ marginLeft: 12, paddingTop: 2 }}>
                    <Text style={{ 
                        fontSize: 14, 
                        fontWeight: isCompleted ? "700" : "500", 
                        color: isCompleted ? "#111827" : "#9CA3AF" 
                    }}>
                      {step === "NearTown" ? "Arriving at your station" : step}
                    </Text>
                    {index === currentStepIndex && (
                        <Text style={{ fontSize: 12, color: "#0C831F" }}>Currently processing</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* --- RIDER SECTION --- */}
        <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.riderIcon}>
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png' }} style={{ width: 30, height: 30 }} />
                </View>
                <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700' }}>Aman Singh</Text>
                    <Text style={{ fontSize: 12, color: '#6B7280' }}>Your delivery partner</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.callButton}>
                <Phone size={16} color="#0C831F" fill="#0C831F" />
                <Text style={styles.callText}>Call</Text>
            </TouchableOpacity>
        </View>

        {/* --- DELIVERY ADDRESS --- */}
        <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <MapPin size={18} color="#111827" />
                <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Delivery Address</Text>
            </View>
            <Text style={{ fontWeight: "700", color: '#374151' }}>{address?.name} ({address?.addressType})</Text>
            <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 4, lineHeight: 18 }}>
                {address?.addressLine1}, {address?.landmark}, {address?.city} - {address?.pincode}
            </Text>
        </View>

        {/* --- ITEMS --- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{productList.length} Items in this order</Text>
          {productList.map((item) => (
            <View key={item._id} style={styles.itemRow}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item.coverImage }} style={styles.itemImage} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontWeight: "600", color: '#111827' }}>{item.ProductName}</Text>
                <Text style={{ fontSize: 12, color: "#6B7280" }}>{item.ProductAmount} × {item.quantity}</Text>
              </View>
              <Text style={{ fontWeight: "700" }}>₹{item.discountedMRP * item.quantity}</Text>
            </View>
          ))}
        </View>

        {/* --- BILL DETAILS --- */}
        <View style={[styles.card, { marginBottom: 20 }]}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <BillRow label="Item Total" value={`₹${order.totalAmountOfProductsMoney}`} />
          {order.WalletDiscount > 0 && <BillRow label="Wallet Discount" value={`₹${order.WalletDiscount}`  } isDiscount = {true}/>}
          <BillRow label="Delivery Charge" value={`₹${order.DeliveryCharge}`} isFree={order.DeliveryCharge === 0} />
          <BillRow label="Handling Fee" value={`₹${order.HandellingFees}`} />
          <BillRow label="Platform Fee" value={`₹${order.PlatFormFees}`} />
          
          <View style={styles.savingsBox}>
            <Text style={styles.savingsText}>Total Savings</Text>
            <Text style={styles.savingsText}>₹{order.totalDiscountedMoney}</Text>
          </View>

          <View style={styles.divider} />
          <BillRow label="Bill Total" value={`₹${order.totalAmountToPay}`} bold />
          
          <View style={styles.paymentTag}>
            <Text style={styles.paymentTagText}>{order.paymentMethod} • {order.paymentDone ? 'PAID' : 'PENDING'}</Text>
          </View>
        </View>

        {/* --- FOOTER ACTIONS --- */}
        <View style={{ paddingHorizontal: 12, paddingBottom: 40 }}>
            <TouchableOpacity style={styles.secondaryAction}>
                <Download size={18} color="#374151" />
                <Text style={styles.secondaryActionText}>Download Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryAction, { marginTop: 10 }]}>
                <HelpCircle size={18} color="#374151" />
                <Text style={styles.secondaryActionText}>Need help with order?</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const BillRow = ({ label, value, bold, isFree , isDiscount = false}) => (
  <View style={styles.billRow}>
    <Text style={{ fontSize: 14, color: "#4B5563", fontWeight: bold ? "800" : "400" }}>{label}</Text>
    {
      isDiscount ? (<Text style={{ fontSize: 14, color: isDiscount ? "#0C831F" : "#111827", fontWeight: bold ? "800" : "600" }}>
        - {value}
    </Text>) : (<Text style={{ fontSize: 14, color: isFree ? "#0C831F" : "#111827", fontWeight: bold ? "800" : "600" }}>
        {isFree ? "FREE" : value}
    </Text>)
    }
    
  </View>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop : 30,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
  headerSub: { fontSize: 12, color: "#6B7280" },
  card: { backgroundColor: "#fff", marginHorizontal: 12, marginTop: 12, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: "#111827", marginBottom: 4 },
  trackerDot: { width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  trackerLine: { width: 2, flex: 1, marginVertical: -2 },
  riderIcon: { width: 45, height: 45, borderRadius: 23, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  callButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E7F6E9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  callText: { color: '#0C831F', fontWeight: '800', marginLeft: 6 },
  itemRow: { flexDirection: "row", marginTop: 16, alignItems: "center" },
  imageWrapper: { width: 50, height: 50, borderRadius: 8, backgroundColor: "#F3F4F6", padding: 4 },
  itemImage: { width: "100%", height: "100%", borderRadius: 4 },
  billRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 12 },
  savingsBox: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F0F9F1', padding: 8, borderRadius: 8, marginTop: 12 },
  savingsText: { color: '#0C831F', fontWeight: '700', fontSize: 13 },
  paymentTag: { alignSelf: 'flex-start', backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginTop: 12 },
  paymentTagText: { fontSize: 10, fontWeight: '800', color: '#6B7280' },
  secondaryAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  secondaryActionText: { marginLeft: 10, fontWeight: '700', color: '#374151' }
});

export default OrderDetailScreen;