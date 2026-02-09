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
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { createProduct } from "../services/product";

export default function AddProductScreen({ navigation }: any) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });

  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const submit = async () => {
    if (!image) {
      Alert.alert("Validasi", "Silakan pilih gambar produk");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", String(Number(form.price)));
      formData.append("category", form.category);
      formData.append("stock", String(Number(form.stock)));
      formData.append("description", form.description);

      formData.append("image", {
        uri: image.uri,
        name: "product.jpg",
        type: "image/jpeg",
      } as any);

      await createProduct(formData);

      Alert.alert("Berhasil", "Produk berhasil ditambahkan");
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
      <Text style={styles.title}>Tambah Produk</Text>

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
    {/* IMAGE PREVIEW */}
      <Pressable style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Pilih Gambar</Text>
        )}
      </Pressable>

      <Pressable
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={submit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Menyimpan..." : "Simpan Produk"}
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
    backgroundColor: "#1f2933",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  imageText: {
    color: "#9ca3af",
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
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
});
