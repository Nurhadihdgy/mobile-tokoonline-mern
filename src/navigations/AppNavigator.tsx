import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

// Screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/Register";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import ProductListScreen from "../screens/ProductListScreen";
import AddProductScreen from "../screens/AddProduct";
import EditProductScreen from "../screens/EditProduct";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import MainTabNavigator from "./MainTabNavigator";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Alert } from "react-native";
import OrderHistoryScreen from "../screens/OrderHistoryUserScreen";

// Services
import API from "../services/api";
import AdminOrderDashboard from "../screens/AdminOrderDashboard";

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  Register: undefined;
  Product: undefined;
  ProductDetail: { id: string };
  AddProduct: undefined;
  EditProduct: { id: string };
  OrderHistoryUser: undefined;
  Cart: undefined;
  AdminOrderDashboard: undefined;
  Checkout: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuth, role, loading,logoutService } = useContext(AuthContext);

  useEffect(() => {
    // Buat interceptor response di dalam useEffect agar punya akses ke 'logout' context
    const interceptor = API.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401 && isAuth) {
          Alert.alert(
            "Sesi Berakhir",
            "Sesi Anda telah berakhir, silakan login kembali.",
            [{ text: "OK", onPress: () => logoutService() }]
          );
        }
        return Promise.reject(error);
      }
    );

    return () => API.interceptors.response.eject(interceptor);
  }, [isAuth]);
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#111827" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: "Detail Produk" }} />

      {!isAuth ? (
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          {role === "admin" && (
            <>
              <Stack.Screen name="AddProduct" component={AddProductScreen} />
              <Stack.Screen name="EditProduct" component={EditProductScreen} />
              <Stack.Screen name="AdminOrderDashboard" component={AdminOrderDashboard} />
            </>
          )}
          {role === "user" && (
            <>
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen name="Checkout" component={CheckoutScreen} />
              <Stack.Screen name="OrderHistoryUser" component={OrderHistoryScreen} />
            </>
          )}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
});