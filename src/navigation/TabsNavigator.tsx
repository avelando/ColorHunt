import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Platform } from "react-native";
import ExploreScreen from "../screens/ExploreScreen";
import MyPalettesScreen from "../screens/MyPalettesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";

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
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Explorar" component={ExploreScreen} />
      <Tab.Screen name="Minhas Paletas" component={MyPalettesScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    width: "90%",
    marginHorizontal: "5%",
    elevation: 5,
    marginBottom: 10,
    backgroundColor: "#7E57C2",
    borderRadius: 30,
    height: 60,
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingBottom: Platform.OS === "ios" ? 10 : 0,
  },
  tabItem: {
    justifyContent: "center",
    alignItems: "center",
    top: "5%",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default TabsNavigator;
