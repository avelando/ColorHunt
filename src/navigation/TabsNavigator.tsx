import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExploreScreen from "../screens/ExploreScreen";
import MyPalettesScreen from "../screens/MyPalettesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { tabNavStyles } from "../styles/tabNavStyles";

const Tab = createBottomTabNavigator();

const TabsNavigator = () => {
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
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#D1C4E9",
        tabBarStyle: tabNavStyles.tabBar,
        tabBarLabelStyle: tabNavStyles.tabLabel,
        tabBarItemStyle: tabNavStyles.tabItem,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Explorar" component={ExploreScreen} />
      <Tab.Screen name="Minhas Paletas" component={MyPalettesScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabsNavigator;
