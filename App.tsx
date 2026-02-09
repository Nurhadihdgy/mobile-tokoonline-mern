import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
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
          <StatusBar barStyle="light-content" backgroundColor="#111827" />
          <AppNavigator />
        </NavigationContainer>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
