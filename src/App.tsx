import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./screens/loginScreen";
import RegisterScreen from "./screens/registerScreen";
import HomeScreen from "./screens/homeScreen";
import HistoryScreen from "./screens/historyScreen";  // Importação da nova tela

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkUserToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkUserToken();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: true,
            title: "Home",
            headerStyle: { backgroundColor: "#6200ee" },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="HistoryScreen"
          component={HistoryScreen}
          options={{
            headerShown: true,
            title: "Histórico de Paletas",
            headerStyle: { backgroundColor: "#00186C" },
            headerTintColor: "#fff",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
