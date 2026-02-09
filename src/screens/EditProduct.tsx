import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getProductById, updateProduct } from "../services/product";

export default function EditProductScreen({ route, navigation }: any) {
  const { id } = route.params;

  const categories = [
    "Elektronik",
    "Fashion",
    "Makanan",
    "Minuman",
    "Alat Tulis",
    "Lainnya",
  ];

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
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    // Mengambil data produk berdasarkan ID saat layar dimuat
    getProductById(id).then((p) => {
      setForm({
        name: p.name,
        price: String(p.price),
        category: p.category,
        stock: String(p.stock),
        description: p.description || "",
      });
      setOldImage(p.imageUrl); // URL Cloudinary dari backend
    });
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
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

      // Gambar bersifat opsional saat edit (hanya dikirim jika diganti)
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
        err.response?.data?.message || "Terjadi kesalahan saat memperbarui produk"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.title}>Edit Produk</Text>
        </View>

        {/* PREVIEW GAMBAR */}
        <Text style={styles.label}>Foto Produk</Text>
        <Pressable style={styles.imageBox} onPress={pickImage}>
          <Image
            source={{
              uri: image?.uri || oldImage || "https://via.placeholder.com/400",
            }}
            style={styles.image}
          />
          <View style={styles.imageHint}>
            <Ionicons name="camera" size={14} color="#fff" />
            <Text style={styles.imageHintText}>Tap untuk ganti</Text>
          </View>
        </Pressable>

        <Input 
          label="Nama Produk" 
          value={form.name}
          onChange={(v: string) => setForm({ ...form, name: v })} 
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Input 
              label="Harga (Rp)" 
              keyboardType="numeric" 
              value={form.price}
              onChange={(v: string) => setForm({ ...form, price: v })} 
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input 
              label="Stok" 
              keyboardType="numeric" 
              value={form.stock}
              onChange={(v: string) => setForm({ ...form, stock: v })} 
            />
          </View>
        </View>

        {/* INPUT KATEGORI DENGAN MODAL PICKER */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kategori</Text>
          <Pressable 
            style={styles.pickerTrigger} 
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.pickerValue}>{form.category || "Pilih Kategori"}</Text>
            <Ionicons name="chevron-down" size={18} color="#94a3b8" />
          </Pressable>
        </View>

        <Input 
          label="Deskripsi" 
          multiline 
          numberOfLines={4}
          value={form.description}
          onChange={(v: string) => setForm({ ...form, description: v })} 
          textAlignVertical="top"
        />

        <Pressable
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Simpan Perubahan</Text>
          )}
        </Pressable>
      </ScrollView>

      {/* MODAL PICKER KATEGORI */}
      <Modal visible={showPicker} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowPicker(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Kategori</Text>
            {categories.map((item) => (
              <Pressable
                key={item}
                style={styles.categoryItem}
                onPress={() => {
                  setForm({ ...form, category: item });
                  setShowPicker(false);
                }}
              >
                <Text style={[
                  styles.categoryText,
                  form.category === item && { color: "#2563eb", fontWeight: '700' }
                ]}>
                  {item}
                </Text>
                {form.category === item && (
                  <Ionicons name="checkmark-circle" size={20} color="#2563eb" />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function Input({ label, onChange, ...props }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        onChangeText={onChange}
        style={[styles.input, props.multiline && { height: 100 }]}
        placeholderTextColor="#4b5563"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 20 },
  backBtn: { padding: 5, marginRight: 10 },
  title: { color: "#fff", fontSize: 24, fontWeight: "800" },
  row: { flexDirection: 'row' },
  imageBox: { height: 200, borderRadius: 16, overflow: "hidden", marginBottom: 25, backgroundColor: "#0f172a" },
  image: { width: "100%", height: "100%" },
  imageHint: { 
    position: "absolute", bottom: 12, right: 12, 
    backgroundColor: "rgba(0,0,0,0.7)", flexDirection: 'row', 
    alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 5 
  },
  imageHintText: { color: "#fff", fontSize: 11, fontWeight: '600' },
  inputGroup: { marginBottom: 18 },
  label: { color: "#94a3b8", fontSize: 13, fontWeight: "600", marginBottom: 8 },
  input: { 
    backgroundColor: "#0f172a", color: "#fff", borderRadius: 12, 
    padding: 15, fontSize: 15, borderWidth: 1, borderColor: "#1e293b" 
  },
  pickerTrigger: {
    backgroundColor: "#0f172a", borderRadius: 12, padding: 15,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderWidth: 1, borderColor: "#1e293b"
  },
  pickerValue: { color: "#fff", fontSize: 15 },
  button: { backgroundColor: "#f59e0b", padding: 18, borderRadius: 14, marginTop: 15 },
  buttonText: { color: "#000", textAlign: "center", fontWeight: "800", fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#0f172a", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40 },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 20 },
  categoryItem: { paddingVertical: 16, flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#1e293b" },
  categoryText: { color: "#cbd5e1", fontSize: 16 },
});