import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { getProductById, updateProduct } from "../services/product";

export default function EditProductScreen({ route, navigation }: any) {
  const { id } = route.params;

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });

  const [image, setImage] = useState<any>(null);
  const [oldImage, setOldImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProductById(id).then((p) => {
      setForm({
        name: p.name,
        price: String(p.price),
        category: p.category,
        stock: String(p.stock),
        description: p.description || "",
      });
      setOldImage(p.imageUrl);
    });
  }, [id]);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const submit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", String(Number(form.price)));
      formData.append("category", form.category);
      formData.append("stock", String(Number(form.stock)));
      formData.append("description", form.description);

      // image optional (kalau user ganti)
      if (image) {
        formData.append("image", {
          uri: image.uri,
          name: "product.jpg",
          type: "image/jpeg",
        } as any);
      }

      await updateProduct(id, formData);

      Alert.alert("Berhasil", "Produk berhasil diperbarui");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert(
        "Gagal",
        err.response?.data?.message || "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Produk</Text>

      {/* IMAGE */}
      <Pressable style={styles.imageBox} onPress={pickImage}>
        <Image
          source={{
            uri:
              image?.uri ||
              oldImage ||
              "https://via.assets.so/img.jpg?w=400&h=400&bg=dcfce7",
          }}
          style={styles.image}
        />
        <Text style={styles.imageHint}>Tap untuk ganti gambar</Text>
      </Pressable>

      <Input label="Nama Produk" value={form.name}
        onChange={(v) => setForm({ ...form, name: v })} />

      <Input label="Harga" keyboardType="numeric" value={form.price}
        onChange={(v) => setForm({ ...form, price: v })} />

      <Input label="Kategori" value={form.category}
        onChange={(v) => setForm({ ...form, category: v })} />

      <Input label="Stok" keyboardType="numeric" value={form.stock}
        onChange={(v) => setForm({ ...form, stock: v })} />

      <Input label="Deskripsi" multiline value={form.description}
        onChange={(v) => setForm({ ...form, description: v })} />

      <Pressable
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={submit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Menyimpan..." : "Update Produk"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

/* ================= INPUT ================= */
function Input({
  label,
  onChange,
  ...props
}: {
  label: string;
  onChange: (v: string) => void;
  [key: string]: any;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        onChangeText={onChange}
        style={styles.input}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  imageBox: {
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageHint: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#1f2933",
    color: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#f59e0b",
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "700",
  },
});
