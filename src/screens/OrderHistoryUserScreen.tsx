import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, RefreshControl } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import API from "../services/api";

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      // API: GET /api/orders
      const res = await API.get("/orders");
      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Gagal mengambil riwayat pesanan:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, []);

  // Fungsi untuk menentukan warna badge berdasarkan status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "forwarded_to_seller": return { bg: "#fef3c7", text: "#d97706", label: "Diteruskan ke Penjual" };
      case "processing": return { bg: "#dbeafe", text: "#2563eb", label: "Diproses" };
      case "completed": return { bg: "#dcfce7", text: "#16a34a", label: "Selesai" };
      case "waiting_payment": return { bg: "#fee2e2", text: "#dc2626", label: "Menunggu Pembayaran" };
      default: return { bg: "#f3f4f6", text: "#4b5563", label: status };
    }
  };

  const renderItem = ({ item }: any) => {
    const statusInfo = getStatusStyle(item.orderStatus);

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Text style={[styles.statusText, { color: statusInfo.text }]}>{statusInfo.label}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Menampilkan ringkasan item pertama dan jumlah total item */}
        <View style={styles.itemRow}>
          <Ionicons name="cube-outline" size={20} color="#94a3b8" />
          <Text style={styles.itemName} numberOfLines={1}>
            {item.items[0]?.name} {item.items.length > 1 ? `(+${item.items.length - 1} produk lainnya)` : ""}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.totalLabel}>Total Belanja</Text>
            <Text style={styles.totalAmount}>Rp {item.totalPrice.toLocaleString()}</Text>
          </View>
          <Text style={styles.paymentMethod}>{item.paymentMethod.toUpperCase()}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Pesanan</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item: any) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={80} color="#334155" />
              <Text style={styles.emptyText}>Belum ada riwayat pesanan</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  header: { padding: 20, paddingTop: 40, backgroundColor: "#1e293b" },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
  listContent: { padding: 16 },
  orderCard: { backgroundColor: "#1e293b", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#334155" },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  orderDate: { color: "#94a3b8", fontSize: 13 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#334155", marginBottom: 12 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 15 },
  itemName: { color: "#fff", fontSize: 15, flex: 1 },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  totalLabel: { color: "#94a3b8", fontSize: 12, marginBottom: 2 },
  totalAmount: { color: "#60a5fa", fontSize: 16, fontWeight: "800" },
  paymentMethod: { color: "#475569", fontSize: 11, fontWeight: "bold", backgroundColor: "#0f172a", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: { color: "#64748b", marginTop: 15, fontSize: 16 },
});