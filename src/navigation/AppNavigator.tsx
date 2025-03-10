import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import LoginScreen from "../screens/loginScreen";
import RegisterScreen from "../screens/registerScreen";
import TabNavigator from "./TabNavigator";
import CreatePaletteScreen from "../screens/createPaletteScreen";
import { RootStackParamList } from "../types/types";
import { getUser } from "../services/userServices";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkUserToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      try {
        await getUser();
        setIsAuthenticated(true);
      } catch (error) {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userId");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkUserToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Tabs" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="CreatePalette" component={CreatePaletteScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
