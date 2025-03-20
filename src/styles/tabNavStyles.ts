import { Platform, StyleSheet } from "react-native";

export const tabNavStyles = StyleSheet.create({
  tabBar: {
    width: "90%",
    marginHorizontal: "5%",
    elevation: 5,
    marginBottom: 10,
    backgroundColor: "#6a1b9a",
    borderRadius: 30,
    height: 60,
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
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