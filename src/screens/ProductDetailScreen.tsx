import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Product } from "../types/Product";
import { getProductById, deleteProduct } from "../services/product";
import { getUser } from "../services/auth";
import Ionicons from "react-native-vector-icons/Ionicons";
import API from "../services/api";

type RouteParams = {
  ProductDetail: {
    id: string;
  };
};

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const route = useRoute<RouteProp<RouteParams, "ProductDetail">>();
  const navigation = useNavigation<any>();
  const { id } = route.params;

  const [user, setUser] = useState<{ role: string | null; name: string | null } | null>(null);
const isAdmin = user?.role === "admin";

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const isUser = user?.role === "user";

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getUser();
      setUser(u);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      // Sesuai dengan list API: POST /cart
      // Payload biasanya membutuhkan productId dan quantity
      await API.post("/cart", {
        productId: id,
        quantity: 1
      });

      Alert.alert("Berhasil", "Produk telah ditambahkan ke keranjang", [
        { text: "Lihat Keranjang", onPress: () => navigation.navigate("Cart") },
        { text: "Lanjut Belanja", style: "cancel" }
      ]);
    } catch (err) {
      Alert.alert("Error", "Gagal menambahkan produk ke keranjang");
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Hapus Produk",
      "Data yang dihapus tidak bisa dikembalikan",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            await deleteProduct(id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Produk tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* IMAGE - Sesuaikan dengan imagePath dari API Anda */}
      <Image
        source={{
          uri:
            product.imageUrl ||
            "https://via.assets.so/img.jpg?w=400&h=400&bg=dcfce7",
        }}
        style={styles.image}
        resizeMode="cover"
        onError={(e) =>
          (e.currentTarget as any).setNativeProps({
            source: {
              uri: "https://via.assets.so/img.jpg?w=400&h=400&bg=dcfce7",
            },
          })
        }
      />

      <View style={styles.content}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>Rp {product.price.toLocaleString("id-ID")}</Text>
        <Text style={styles.desc}>{product.description || "Tidak ada deskripsi"}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>Kategori: {product.category}</Text>
          <Text style={styles.metaText}>Stok: {product.stock}</Text>
        </View>

        {/* ROLE USER ACTION: TAMBAH KE KERANJANG */}
        {isUser && (
          <Pressable
            style={[styles.cartBtn, isAdding && { opacity: 0.7 }]}
            onPress={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.cartBtnText}><Ionicons name="cart-outline" size={18} color="#fff" style={{ marginRight: 8 }} /> Tambah ke Keranjang</Text>
            )}
          </Pressable>
        )}

        {/* ROLE ADMIN ACTION */}
        {isAdmin && (
          <View style={styles.adminActions}>
            <Pressable
              style={styles.editBtn}
              onPress={() => navigation.navigate("EditProduct", { id })}
            >
              <Text style={styles.editText}><Ionicons name="create-outline" size={18} color="#000" style={{ marginRight: 8 }} /> Edit</Text>
            </Pressable>

            <Pressable style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.deleteText}><Ionicons name="trash-outline" size={18} color="#fff" style={{ marginRight: 8 }} /> Hapus</Text>
            </Pressable>
          </View>
        )}

        {/* LOGIN PROMPT (Jika belum login) */}
        {!user && (
          <Pressable
            style={styles.loginPromptBtn}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginPromptText}>Masuk untuk Membeli</Text>
          </Pressable>
        )}

        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Kembali</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  center: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: width * 0.75,
  },
  content: {
    padding: 20,
  },
  cartBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cartBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  loginPromptBtn: {
    backgroundColor: "#374151",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  loginPromptText: {
    color: "#9ca3af",
    textAlign: "center",
    fontWeight: "600",
  },
  // Update adminActions agar rapi
  adminActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },
  price: {
    color: "#22c55e",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  desc: {
    color: "#d1d5db",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metaText: {
    color: "#9ca3af",
    fontSize: 13,
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#facc15",
    paddingVertical: 12,
    borderRadius: 10,
  },
  editText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#000",
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    borderRadius: 10,
  },
  deleteText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#fff",
  },
  backBtn: {
    backgroundColor: "#1f2937",
    paddingVertical: 14,
    borderRadius: 12,
  },
  backText: {
    color: "#60a5fa",
    textAlign: "center",
    fontWeight: "600",
  },
});
