import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Product } from "../types/Product";

type Props = {
  product: Product;
  onPress: () => void;
};

export default function ProductCard({ product, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image
        source={{
          uri:
            product.imageUrl ||
            "https://via.assets.so/img.jpg?w=400&h=400&bg=dcfce7",
        }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>

        <Text style={styles.price}>
          Rp {product.price.toLocaleString("id-ID")}
        </Text>

        <View style={styles.row}>
          <Text style={styles.meta}>{product.category}</Text>
          <Text style={styles.meta}>Stok: {product.stock}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1f2933",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 176,
  },
  content: {
    padding: 16,
  },
  name: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  price: {
    color: "#4ade80",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  meta: {
    color: "#9ca3af",
    fontSize: 12,
  },
});
