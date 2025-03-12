import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExploreScreen from "../screens/exploreScreen";
import MyPalettesScreen from "../screens/myPalettesScreen";
import ProfileScreen from "../screens/profileScreen";
import { Ionicons } from "@expo/vector-icons";
import { TabParamList } from "../types/TabParamList";

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";
          if (route.name === "Explorar") {
            iconName = focused ? "compass" : "compass-outline";
          } else if (route.name === "Minhas Paletas") {
            iconName = focused ? "color-palette" : "color-palette-outline";
          } else if (route.name === "Perfil") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007BFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Explorar" component={ExploreScreen} />
      <Tab.Screen name="Minhas Paletas" component={MyPalettesScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
