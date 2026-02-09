import { FlatList, View, ActivityIndicator, StyleSheet, RefreshControl } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { Product } from "../types/Product";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/product";

export default function ProductListScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State untuk refresh

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response: any = await getProducts();
      // Menangani struktur data { products: [...] }
      if (response && response.products) {
        setProducts(response.products);
      } else {
        setProducts(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Matikan loading refresh setelah selesai
    }
  };

  // Fungsi yang dipanggil saat user menarik list ke bawah
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        // Tambahkan fitur refresh di sini
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#22c55e"]} // Warna loading di Android
            tintColor="#22c55e"   // Warna loading di iOS
          />
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate("ProductDetail", { id: item._id })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  list: {
    padding: 12,
  },
  loading: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
});