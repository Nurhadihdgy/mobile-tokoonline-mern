import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API from "../services/api";

export default function AdminOrderDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      // API: GET /api/admin/orders
      const res = await API.get("admin/orders");
      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Gagal mengambil semua pesanan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const updateStatus = async (orderId: string, currentStatus: string) => {
    // Tentukan urutan status berikutnya
    const statusOrder = ["waiting_payment", "forwarded_to_seller", "processing", "completed"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[currentIndex + 1];

    if (!nextStatus) {
      Alert.alert("Info", "Pesanan sudah dalam status akhir (Selesai).");
      return;
    }

    Alert.alert("Update Status", `Ubah status ke ${nextStatus.replace(/_/g, ' ')}?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Update",
        onPress: async () => {
          try {
            // API: PUT /api/admin/orders/:id/status
            await API.put(`/admin/orders/${orderId}/status`, { orderStatus: nextStatus });
            fetchAllOrders(); // Refresh data
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Kesalahan tidak diketahui";
            Alert.alert("Error", `Gagal memperbarui status.\n${errorMessage}`);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.customerName}>{item.user?.name || "User Terhapus"}</Text>
          <Text style={styles.customerEmail}>{item.user?.email}</Text>
        </View>
        <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <View style={styles.divider} />

      {item.items.map((prod: any, index: number) => (
        <Text key={index} style={styles.productText}>
          • {prod.name} x{prod.quantity}
        </Text>
      ))}

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.label}>Total Pendapatan</Text>
          <Text style={styles.amount}>Rp {item.totalPrice.toLocaleString()}</Text>
        </View>
        
        <Pressable 
          style={[styles.statusBtn, item.orderStatus === 'completed' && { backgroundColor: '#334155' }]} 
          onPress={() => updateStatus(item._id, item.orderStatus)}
        >
          <Text style={styles.statusBtnText}>
            {item.orderStatus.replace(/_/g, ' ').toUpperCase()}
          </Text>
          <Ionicons name="chevron-forward" size={14} color="#fff" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manajemen Pesanan</Text>
        <Text style={styles.headerSub}>Total: {orders.length} Transaksi</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item: any) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  header: { padding: 20, paddingTop: 40, backgroundColor: "#0f172a" },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "800" },
  headerSub: { color: "#64748b", fontSize: 13, marginTop: 4 },
  card: { backgroundColor: "#1e293b", borderRadius: 16, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: "#2563eb" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  customerName: { color: "#fff", fontSize: 16, fontWeight: "700" },
  customerEmail: { color: "#94a3b8", fontSize: 12 },
  orderDate: { color: "#64748b", fontSize: 11 },
  divider: { height: 1, backgroundColor: "#334155", marginVertical: 12 },
  productText: { color: "#cbd5e1", fontSize: 14, marginBottom: 4 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15 },
  label: { color: "#64748b", fontSize: 11 },
  amount: { color: "#22c55e", fontSize: 18, fontWeight: "800" },
  statusBtn: { backgroundColor: "#2563eb", flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 5 },
  statusBtnText: { color: "#fff", fontSize: 10, fontWeight: "bold" }
});