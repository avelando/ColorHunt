import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import TabNavigator from "./TabsNavigator";
import MyPalettesScreen from "../screens/MyPalettesScreen";
import PaletteScreen from "../screens/PaletteScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import CreatePaletteScreen from "../screens/CreatePaletteScreen";
import EditPaletteScreen from "../screens/EditPaletteScreen";
import FollowersScreen from "../screens/FollowersScreen";
import FollowingScreen from "../screens/FollowingScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Minhas Paletas" component={MyPalettesScreen} />
      <Stack.Screen name="Paleta" component={PaletteScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Editar" component={EditProfileScreen} />
      <Stack.Screen name="CreatePalette" component={CreatePaletteScreen} />
      <Stack.Screen name="EditPalette" component={EditPaletteScreen} />
      <Stack.Screen name="Followers" component={FollowersScreen} />
      <Stack.Screen name="Following" component={FollowingScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
