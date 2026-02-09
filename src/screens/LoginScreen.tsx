import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useContext, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import API from "../services/api";
import { saveAuth } from "../services/auth";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Gunakan fungsi 'login' dari context, bukan setIsAuth
  const { login } = useContext(AuthContext); 

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password harus diisi");
      return;
    }

    try {
      const res = await API.post("/auth/login", { email, password });

      // 1. Simpan ke Storage (AsyncStorage)
      await saveAuth(
        res.data.token,
        res.data.user.name,
        res.data.user.role
      );

      Alert.alert("Success", "Login berhasil!", [
        {
          text: "OK",
          onPress: () => {
            // 2. Panggil fungsi login dari Context untuk update state global
            // Ini akan otomatis memicu re-render pada AppNavigator
            login(res.data.user.role); 
            
            // 3. Navigasi ke MainTabs
            navigation.replace("MainTabs");
          },
        },
      ]);
    } catch (err) {
      Alert.alert("Error", "Email atau password salah");
    }
  };

  return (
    <View style={styles.container}>
      {/* Tombol Kembali */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
        <Text style={styles.backText}>Kembali</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Masuk untuk mengelola produk dan akun Anda</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>
            Belum punya akun? <Text style={styles.link}>Register</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    top: 48,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  backText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 16,
  },

  card: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 16,
    padding: 24,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },

  subtitle: {
    color: "#9ca3af",
    marginBottom: 24,
  },

  input: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },

  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
  },

  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  registerText: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 20,
  },

  link: {
    color: "#60a5fa",
    fontWeight: "600",
  },
});
