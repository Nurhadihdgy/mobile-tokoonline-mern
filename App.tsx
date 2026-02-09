import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import AppNavigator from "./src/navigations/AppNavigator";
import { setNavigation } from "./src/services/navigation";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
        <AuthProvider>
        <NavigationContainer ref={(ref) => setNavigation(ref)}>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
