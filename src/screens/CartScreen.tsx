import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, Pressable, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API from "../services/api";

export default function CartScreen({ navigation }: any) {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      if (res.data && res.data.cart && res.data.cart.items) {
        setCartItems(res.data.cart.items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Fetch Cart Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Refresh data setiap kali user masuk ke screen ini
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCart();
    });
    return unsubscribe;
  }, [navigation]);

  const updateQty = async (productId: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      await API.put(`/cart/${productId}`, { quantity: newQty });
      fetchCart();
    } catch (err) {
      Alert.alert("Error", "Gagal memperbarui jumlah barang");
    }
  };

  const removeItem = async (productId: string) => {
    Alert.alert("Hapus Item", "Hapus item ini dari keranjang?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await API.delete(`/cart/${productId}`);
            fetchCart();
          } catch (err) {
            Alert.alert("Error", "Gagal menghapus item");
          }
        },
      },
    ]);
  };

  const clearCart = async () => {
    Alert.alert("Kosongkan Keranjang", "Hapus semua barang?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus Semua",
        style: "destructive",
        onPress: async () => {
          try {
            await API.delete("/cart");
            setCartItems([]);
            Alert.alert("Sukses", "Keranjang dikosongkan");
          } catch (err) {
            Alert.alert("Error", "Gagal mengosongkan keranjang");
          }
        },
      },
    ]);
  };

  // Fungsi untuk handle navigasi ke Checkout dengan pilihan metode
  const handleProceedToCheckout = () => {
    Alert.alert(
      "Metode Pembayaran",
      "Pilih metode pembayaran Anda",
      [
        {
          text: "Tunai (Cash)",
          onPress: () => navigation.navigate("Checkout", { 
            total: totalPrice, 
            method: "cash" 
          })
        },
        {
          text: "QRIS",
          onPress: () => navigation.navigate("Checkout", { 
            total: totalPrice, 
            method: "qris" 
          })
        },
        { text: "Batal", style: "cancel" }
      ]
    );
  };

  const totalPrice = cartItems.reduce((acc, item: any) => 
    acc + (item.product.price * item.quantity), 0);

  const renderItem = ({ item }: any) => (
    <View style={styles.cartCard}>
      <Image 
        source={{ uri: item.product.imageUrl || "https://via.placeholder.com/80" }} 
        style={styles.productImage} 
      />
      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={1}>{item.product.name}</Text>
        <Text style={styles.productPrice}>Rp {item.product.price.toLocaleString()}</Text>
        
        <View style={styles.quantityContainer}>
          <Pressable style={styles.qtyBtn} onPress={() => updateQty(item.product._id, item.quantity - 1)}>
            <Ionicons name="remove" size={18} color="#fff" />
          </Pressable>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <Pressable style={styles.qtyBtn} onPress={() => updateQty(item.product._id, item.quantity + 1)}>
            <Ionicons name="add" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>
      <Pressable style={styles.deleteBtn} onPress={() => removeItem(item.product._id)}>
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Keranjang Saya</Text>
        </View>
        {cartItems.length > 0 && (
          <Pressable onPress={clearCart} style={styles.clearBtn}>
            <Text style={styles.clearText}>Kosongkan</Text>
            <Ionicons name="trash-outline" size={18} color="#f87171" />
          </Pressable>
        )}
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={100} color="#1e293b" />
              <Text style={styles.emptyText}>Wah, keranjangmu kosong!</Text>
            </View>
          }
        />
      )}

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>Rp {totalPrice.toLocaleString()}</Text>
          </View>
          <Pressable style={styles.checkoutBtn} onPress={handleProceedToCheckout}>
            <Text style={styles.checkoutText}>Lanjut ke Checkout</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', // Agar judul dan tombol clear terpisah
    padding: 20, 
    paddingTop: 40 
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 5
  },
  clearText: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '700'
  },
  container: { flex: 1, backgroundColor: "#0f172a" },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800", marginLeft: 15 },
  cartCard: { flexDirection: "row", backgroundColor: "#1e293b", borderRadius: 16, padding: 12, marginBottom: 16, alignItems: "center" },
  productImage: { width: 85, height: 85, borderRadius: 12, backgroundColor: "#334155" },
  infoContainer: { flex: 1, marginLeft: 15 },
  productName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  productPrice: { color: "#60a5fa", fontSize: 14, marginTop: 4, fontWeight: "700" },
  quantityContainer: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  qtyBtn: { backgroundColor: "#334155", padding: 5, borderRadius: 8 },
  qtyText: { color: "#fff", marginHorizontal: 15, fontWeight: "bold", fontSize: 16 },
  deleteBtn: { padding: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 10 },
  footer: { backgroundColor: "#1e293b", padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 20 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  totalLabel: { color: "#9ca3af", fontSize: 16 },
  totalAmount: { color: "#fff", fontSize: 22, fontWeight: "800" },
  checkoutBtn: { backgroundColor: "#2563eb", paddingVertical: 16, borderRadius: 16 },
  checkoutText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "700" },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { color: "#475569", fontSize: 16, marginTop: 10, fontWeight: "600" },
});