import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import API from "../services/api";
import { ActivityIndicator } from "react-native";


export default function CheckoutScreen({ route, navigation }: any) {
  // Mengambil data total dan method dari CartScreen
  const { total, method } = route.params;
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  // 1. Fungsi untuk Membuat Order (Checkout)
  const handleCreateOrder = async () => {
    setIsProcessing(true);
    try {
      // API: POST /orders/checkout
      const res = await API.post("/orders/checkout", { paymentMethod: method });
      
      if (res.data.status === "success") {
        const newOrderId = res.data.order._id;
        setOrderId(newOrderId);

        if (method === "cash") {
          Alert.alert("Sukses", "Pesanan berhasil dibuat dengan metode Tunai.", [
            { text: "OK", onPress: () => navigation.navigate("MainTabs") }
          ]);
        } else {
          Alert.alert("Pesanan Dibuat", "Silakan lakukan pembayaran QRIS.");
        }
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Gagal membuat pesanan");
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Fungsi untuk Verifikasi Pembayaran (Hanya untuk QRIS)
  const handleVerifyPayment = async () => {
    if (!orderId) return;
    setIsProcessing(true);
    try {
      // API: POST /orders/:id/check-payment
      const res = await API.post(`/orders/${orderId}/check-payment`);
      
      if (res.data.status === "success") {
        setIsPaid(true);
        Alert.alert("Pembayaran Berhasil", "Sesi pembayaran telah dikonfirmasi.", [
          { text: "Kembali ke Home", onPress: () => navigation.navigate("MainTabs") }
        ]);
      }
    } catch (err: any) {
      Alert.alert("Gagal", "Pembayaran belum terdeteksi. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.label}>Total Tagihan</Text>
        <Text style={styles.amount}>Rp {total.toLocaleString()}</Text>
      </View>

      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
        <View style={styles.methodCard}>
          <Ionicons 
            name={method === "qris" ? "qr-code-outline" : "cash-outline"} 
            size={24} 
            color="#2563eb" 
          />
          <Text style={styles.methodText}>
            {method === "qris" ? "QRIS (Pembayaran Digital)" : "Tunai / Cash"}
          </Text>
          <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
        </View>
      </View>

      {/* Tampilan QRIS hanya muncul jika pilih method qris */}
      {method === "qris" && (
        <View style={styles.qrisPlaceholder}>
          <Ionicons name="qr-code" size={200} color="#fff" />
          <Text style={styles.qrisHint}>Scan QR Code untuk membayar</Text>
        </View>
      )}

      <View style={styles.instructionCard}>
        <Text style={styles.instructionTitle}>Instruksi:</Text>
        {!orderId ? (
          <Text style={styles.step}>Klik "Buat Pesanan" untuk memproses data keranjang Anda.</Text>
        ) : (
          <>
            <Text style={styles.step}>1. Pesanan ID: {orderId.slice(-6).toUpperCase()}</Text>
            {method === "qris" && <Text style={styles.step}>2. Selesaikan pembayaran di aplikasi E-Wallet.</Text>}
            <Text style={styles.step}>{method === "qris" ? "3. Klik verifikasi pembayaran." : "2. Pesanan akan diteruskan ke penjual."}</Text>
          </>
        )}
      </View>

      {/* Tombol Dinamis */}
      {!orderId ? (
        <Pressable 
          style={[styles.payBtn, isProcessing && { opacity: 0.7 }]} 
          onPress={handleCreateOrder}
          disabled={isProcessing}
        >
          {isProcessing ? <ActivityIndicator color="#fff" /> : <Text style={styles.payText}>Buat Pesanan</Text>}
        </Pressable>
      ) : method === "qris" && !isPaid ? (
        <Pressable 
          style={[styles.payBtn, { backgroundColor: "#22c55e" }]} 
          onPress={handleVerifyPayment}
          disabled={isProcessing}
        >
          {isProcessing ? <ActivityIndicator color="#fff" /> : <Text style={styles.payText}>Verifikasi Pembayaran</Text>}
        </Pressable>
      ) : (
        <Pressable style={styles.payBtn} onPress={() => navigation.navigate("MainTabs")}>
          <Text style={styles.payText}>Kembali ke Home</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 20 },
  summaryCard: { backgroundColor: "#1e293b", padding: 25, borderRadius: 20, alignItems: "center", marginTop: 20 },
  label: { color: "#9ca3af", fontSize: 14, marginBottom: 8 },
  amount: { color: "#fff", fontSize: 32, fontWeight: "800" },
  paymentSection: { marginTop: 30 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 15 },
  methodCard: { flexDirection: "row", backgroundColor: "#1e293b", padding: 16, borderRadius: 15, alignItems: "center" },
  methodText: { color: "#fff", flex: 1, marginLeft: 12, fontWeight: "500" },
  qrisPlaceholder: { alignItems: "center", marginVertical: 30, padding: 20, backgroundColor: "#1e293b", borderRadius: 20 },
  qrisHint: { color: "#9ca3af", marginTop: 15, fontSize: 12 },
  instructionCard: { backgroundColor: "rgba(37, 99, 235, 0.1)", padding: 20, borderRadius: 15, borderLeftWidth: 4, borderLeftColor: "#2563eb" },
  instructionTitle: { color: "#fff", fontWeight: "700", marginBottom: 10 },
  step: { color: "#d1d5db", fontSize: 13, marginBottom: 5 },
  payBtn: { backgroundColor: "#2563eb", paddingVertical: 18, borderRadius: 16, marginTop: 30, marginBottom: 50 },
  payText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "800" },
});