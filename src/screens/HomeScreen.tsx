import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Pastikan install expo-vector-icons
import { getUser, getToken, logoutService } from "../services/auth";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

type User = {
  name: string | null;
  role: "admin" | "user" | null;
};

export default function HomeScreen({ navigation }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const { logout } = useContext(AuthContext);

  const checkStatus = async () => {
    try {
      const token = await getToken();
      const userData = await getUser();
      setIsAuth(!!token);
      setUser(userData ? {
        name: userData.name,
        role: userData.role as "admin" | "user"
      } : null);
    } catch (error) {
      console.error("Auth check failed", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkStatus();
    }, [])
  );

  const handleLogout = async () => {
  Alert.alert("Konfirmasi", "Apakah Anda yakin ingin keluar?", [
    { text: "Batal", style: "cancel" },
    {
      text: "Keluar",
      style: "destructive",
      onPress: async () => {
        try {
          // 1. Jalankan proses logout (menghapus token dan update state AuthContext)
          await logout();

          // 2. Tampilkan alert sukses dengan callback pada tombol OK
          Alert.alert("Sukses", "Anda telah berhasil keluar.", [
            {
              text: "OK",
              onPress: () => {
                // 3. Reset navigasi untuk "refresh" aplikasi secara bersih
                navigation.reset({
                  index: 0,
                  routes: [{ name: "MainTabs" }], // Kembali ke layar utama publik
                });
              },
            },
          ]);
        } catch (error) {
          Alert.alert("Error", "Gagal melakukan logout.");
          console.error("Logout error:", error);
        }
      },
    },
  ]);
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>Toko Online</Text>
            <Text style={styles.tagline}>Premium MERN Collection</Text>
          </View>
          <Pressable
            style={styles.cartIconBtn}
            onPress={() => isAuth ? navigation.navigate("Cart") : navigation.navigate("Login")}
          >
            <Ionicons name="bag-handle-outline" size={28} color="#60a5fa" />
          </Pressable>
        </View>

        {/* AUTH CARD */}
        <View style={styles.authCard}>
          {isAuth ? (
            <View>
              <View style={styles.userInfoRow}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarLetter}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ marginLeft: 15 }}>
                  <Text style={styles.welcomeText}>Selamat datang kembali,</Text>
                  <Text style={styles.userNameText}>{user?.name}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{user?.role?.toUpperCase()}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionContainer}>
                {user?.role === "admin" ? (
                  /* TAMPILAN TOMBOL ADMIN YANG RAPI */
                  <View style={{ flex: 1 }}>
                    <View style={styles.adminActionGrid}>
                      <Pressable
                        style={[styles.actionBtn, styles.adminBtn]}
                        onPress={() => navigation.navigate("AddProduct")}
                      >
                        <Ionicons name="add-circle-outline" size={20} color="#fff" />
                        <Text style={styles.actionBtnText}>Tambah Produk</Text>
                      </Pressable>

                      <Pressable
                        style={[styles.actionBtn, styles.manageBtn]}
                        onPress={() => navigation.navigate("AdminOrderDashboard")}
                      >
                        <Ionicons name="list-outline" size={20} color="#fff" />
                        <Text style={styles.actionBtnText}>Kelola Pesanan</Text>
                      </Pressable>
                    </View>

                    <Pressable style={[styles.logoutBtn, { marginTop: 12 }]} onPress={handleLogout}>
                      <Ionicons name="log-out-outline" size={20} color="#f87171" />
                      <Text style={styles.logoutBtnText}>Keluar dari Panel Admin</Text>
                    </Pressable>
                  </View>
                ) : (
                  /* TAMPILAN TOMBOL USER */
                  <View style={{ flex: 1 }}>
                    <View style={styles.adminActionGrid}>
                      <Pressable
                        style={[styles.actionBtn, styles.userBtn]}
                        onPress={() => navigation.navigate("Cart")}
                      >
                        <Ionicons name="cart-outline" size={18} color="#fff" />
                        <Text style={styles.actionBtnText}>Keranjang</Text>
                      </Pressable>

                      <Pressable
                        style={[styles.actionBtn, styles.historyBtn]}
                        onPress={() => navigation.navigate("OrderHistoryUser")}
                      >
                        <Ionicons name="receipt-outline" size={18} color="#fff" />
                        <Text style={styles.actionBtnText}>Riwayat</Text>
                      </Pressable>
                    </View>

                    <Pressable style={[styles.logoutBtn, { marginTop: 12 }]} onPress={handleLogout}>
                      <Ionicons name="log-out-outline" size={20} color="#f87171" />
                      <Text style={styles.logoutBtnText}>Keluar</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.guestContent}>
              <View style={styles.iconCircle}>
                <Ionicons name="person-outline" size={40} color="#60a5fa" />
              </View>
              <Text style={styles.guestTitle}>Eksplorasi Tanpa Batas</Text>
              <Text style={styles.guestDesc}>
                Login sekarang untuk mendapatkan akses penuh ke fitur belanja kami.
              </Text>
              <Pressable
                style={styles.loginBtn}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.loginBtnText}>Masuk ke Akun</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </Pressable>
            </View>
          )}
        </View>

        {/* QUICK NAVIGATION */}
        <Text style={styles.sectionLabel}>Menu Utama</Text>
        <View style={styles.menuGrid}>
          <Pressable style={styles.menuItem} onPress={() => navigation.navigate("Products")}>
            <View style={[styles.menuIconBox, { backgroundColor: '#1e293b' }]}>
              <Ionicons name="grid-outline" size={24} color="#60a5fa" />
            </View>
            <Text style={styles.menuLabel}>Produk</Text>
          </Pressable>
          {/* Tambahkan menu lain di sini */}
        </View>
      </ScrollView>

      <Text style={styles.footerText}>© 2026 Nurhadi Toko Online</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // LAYOUT UTAMA
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  scrollContent: {
    padding: 24,
  },
  actionContainer: {
    marginTop: 20,
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  logoText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
  },
  tagline: {
    color: "#64748b",
    fontSize: 12,
    marginTop: -2,
  },
  cartIconBtn: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 12,
  },

  // AUTH CARD & USER INFO
  authCard: {
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#334155",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  welcomeText: {
    color: "#94a3b8",
    fontSize: 13,
  },
  userNameText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  badge: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  badgeText: {
    color: "#22c55e",
    fontSize: 10,
    fontWeight: "bold",
  },

  // GRID TOMBOL AKSI (ADMIN & USER)
  adminActionGrid: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  // WARNA TOMBOL KHUSUS
  adminBtn: { 
    backgroundColor: "#2563eb", 
  },
  manageBtn: { 
    backgroundColor: "#7c3aed", 
  },
  userBtn: { 
    backgroundColor: "#2563eb", 
  },
  historyBtn: { 
    backgroundColor: "#059669", 
  },

  // TOMBOL KELUAR (LOGOUT)
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(248, 113, 113, 0.1)",
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.2)",
    gap: 8,
    marginTop: 12,
  },
  logoutBtnText: { 
    color: "#f87171", 
    fontWeight: "700", 
    fontSize: 13 
  },

  // GUEST CONTENT (TAMPILAN JIKA BELUM LOGIN)
  guestContent: {
    alignItems: "center",
    paddingVertical: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(96, 165, 250, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  guestTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  guestDesc: {
    color: "#94a3b8",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  loginBtn: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 10,
  },
  loginBtnText: { 
    color: "#fff", 
    fontWeight: "800", 
    fontSize: 15 
  },

  // MENU GRID & NAVIGASI BAWAH
  sectionLabel: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 30,
    marginBottom: 15,
    textTransform: "uppercase",
  },
  menuGrid: {
    flexDirection: "row",
    gap: 15,
  },
  menuItem: {
    alignItems: "center",
    gap: 8,
  },
  menuIconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  menuLabel: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "600",
  },
  footerText: {
    textAlign: "center",
    color: "#475569",
    fontSize: 11,
    marginBottom: 20,
  },
});