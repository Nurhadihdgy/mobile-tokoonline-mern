import React, { useState } from "react";
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
import { createProduct } from "../services/product";

export default function AddProductScreen({ navigation }: any) {
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
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.title}>Tambah Produk</Text>
        </View>

        {/* IMAGE PICKER SECTION */}
        <Text style={styles.label}>Foto Produk</Text>
        <Pressable style={styles.imageBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="camera-outline" size={40} color="#94a3b8" />
              <Text style={styles.imageText}>Pilih Gambar Produk</Text>
            </View>
          )}
        </Pressable>

        {/* INPUT FIELDS */}
        <Input
          label="Nama Produk"
          placeholder="Contoh: Mouse Wireless Logitech"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Input
              label="Harga (Rp)"
              keyboardType="numeric"
              placeholder="0"
              value={form.price}
              onChange={(v) => setForm({ ...form, price: v })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Stok"
              keyboardType="numeric"
              placeholder="0"
              value={form.stock}
              onChange={(v) => setForm({ ...form, stock: v })}
            />
          </View>
        </View>

        {/* CUSTOM CATEGORY PICKER */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kategori</Text>
          <Pressable
            style={styles.pickerTrigger}
            onPress={() => setShowPicker(true)}
          >
            <Text style={[styles.pickerValue, !form.category && { color: "#64748b" }]}>
              {form.category || "Pilih Kategori"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#94a3b8" />
          </Pressable>
        </View>

        <Input
          label="Deskripsi Produk"
          multiline
          numberOfLines={4}
          placeholder="Jelaskan detail produk Anda..."
          value={form.description}
          onChange={(v) => setForm({ ...form, description: v })}
          textAlignVertical="top"
        />

        <Pressable
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Simpan Produk</Text>
          )}
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* MODAL PICKER KATEGORI */}
      <Modal visible={showPicker} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowPicker(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Kategori</Text>
              <Pressable onPress={() => setShowPicker(false)}>
                <Ionicons name="close" size={24} color="#94a3b8" />
              </Pressable>
            </View>
            {categories.map((item) => (
              <Pressable
                key={item}
                style={[
                  styles.categoryItem,
                  form.category === item && styles.categoryItemSelected
                ]}
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
                  <Ionicons name="checkmark-circle" size={22} color="#2563eb" />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

/* ================= COMPONENT INPUT ================= */
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
        // SEBELUMNYA: onChangeText={(v) => onChange(v)}
        // PERBAIKAN:
        onChangeText={(v: string) => onChange(v)}
        style={[styles.input, props.multiline && { height: 100, paddingTop: 12 }]}
        placeholderTextColor="#4b5563"
      />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 20 },
  backBtn: { padding: 5, marginRight: 10 },
  title: { color: "#fff", fontSize: 24, fontWeight: "800" },
  row: { flexDirection: 'row' },
  inputGroup: { marginBottom: 18 },
  label: { color: "#94a3b8", fontSize: 13, fontWeight: "600", marginBottom: 8 },
  input: {
    backgroundColor: "#0f172a",
    color: "#fff",
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  pickerTrigger: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  pickerValue: { color: "#fff", fontSize: 15 },
  imageBox: {
    height: 200,
    borderRadius: 16,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: "#1e293b",
    overflow: 'hidden'
  },
  image: { width: "100%", height: "100%" },
  imageText: { color: "#64748b", marginTop: 8, fontSize: 13 },
  button: {
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 14,
    marginTop: 15,
    elevation: 4,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "800", fontSize: 16 },

  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#0f172a", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  categoryItem: {
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  categoryItemSelected: { borderBottomColor: "#2563eb" },
  categoryText: { color: "#cbd5e1", fontSize: 16 },
});